import { ButtonC, DivC, HtmlComponentBase, InputC, LV2HtmlComponentBase } from "SengenUI/index";





import { stepper_container } from "./style.css";
import { stepper_button } from "./style.css";
import { stepper_input } from "./style.css";

export interface NumberStepperInputOptions {
    min?: number;
    max?: number;
    step?: number;
    initialValue?: number;
    disabled?: boolean;
    allowNegative?: boolean;
    class?: string | string[];
    decrementButtonClass?: string | string[];
    incrementButtonClass?: string | string[];
    inputClass?: string | string[];
    decrementLabel?: string;
    incrementLabel?: string;
    valueFormatter?: (value: number) => string;
}

type NumberChangeHandler = (value: number) => void;

export class NumberStepperInput extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: NumberStepperInputOptions;
    private decrementButton!: ButtonC;
    private incrementButton!: ButtonC;
    private inputComponent!: InputC;
    private currentValue: number = 0;
    private readonly inputListeners: NumberChangeHandler[] = [];
    private readonly commitListeners: NumberChangeHandler[] = [];
    private isComponentDisabled: boolean = false;

    public constructor(options: NumberStepperInputOptions = {}) {
        super();
        this.options = options;
        this.isComponentDisabled = Boolean(options.disabled);
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({
                    class: this.combineClasses(stepper_container, this.options.class)
                })
                .childs([
                    new ButtonC({
                        text: this.options.decrementLabel ?? "<",
                        class: this.combineClasses(stepper_button, this.options.decrementButtonClass)
                    })
                        .addTypedEventListener("click", () => {this.handleStep(-1);})
                        .bind((component) => {this.decrementButton = component;}),
                    new InputC({
                        type: "text",
                        class: this.combineClasses(stepper_input, this.options.inputClass),
                        disabled: this.options.disabled,
                        inputMode: "decimal"
                    })
                        .setPattern(this.buildPattern())
                        .onInput(() => {this.handleInputEvent();})
                        .onChange(() => {this.handleCommitEvent();})
                        .bind((component) => {this.inputComponent = component;}),
                    new ButtonC({
                        text: this.options.incrementLabel ?? ">",
                        class: this.combineClasses(stepper_button, this.options.incrementButtonClass)
                    })
                        .addTypedEventListener("click", () => {this.handleStep(1);})
                        .bind((component) => {this.incrementButton = component;})
                ])
                .bind(() => {this.applyInitialValue();});
    }

    /**
     * 現在の数値を取得する。
     */
    public getValue(): number {
        return this.currentValue;
    }

    /**
     * 値を更新し、表示とボタン状態を同期する。
     */
    public setValue(value: number): this {
        const clamped = this.clampValue(value);
        this.currentValue = clamped;
        this.inputComponent.setValue(this.formatValue(clamped));
        this.updateButtonState();
        this.emitInput(clamped);
        return this;
    }

    /**
     * 入力欄へフォーカスを移す。
     */
    public focus(): this {
        this.inputComponent.focus();
        return this;
    }

    /**
     * コンポーネント全体の有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.isComponentDisabled = disabled;
        this.inputComponent.setDisabled(disabled);
        this.decrementButton.setDisabled(disabled);
        this.incrementButton.setDisabled(disabled);
        this.updateButtonState();
        return this;
    }

    /**
     * 入力途中の値を監視するコールバックを追加する。
     */
    public onValueInput(handler: NumberChangeHandler): this {
        this.inputListeners.push(handler);
        return this;
    }

    /**
     * 値確定タイミングを監視するコールバックを追加する。
     */
    public onValueCommit(handler: NumberChangeHandler): this {
        this.commitListeners.push(handler);
        return this;
    }

    /**
     * Enter キー押下時の挙動を差し込む。
     */
    public onEnterKey(callback: () => void): this {
        this.inputComponent.onEnterKey(callback);
        return this;
    }

    /**
     * 手動入力された値を正規化し、監視処理へ通知する。
     */
    private handleInputEvent(): void {
        const sanitized = this.sanitize(this.inputComponent.getValue());
        if (sanitized !== this.inputComponent.getValue()) {
            this.inputComponent.setValue(sanitized);
        }
        const parsed = this.parseValue(sanitized);
        const clamped = this.clampValue(parsed);
        this.currentValue = clamped;
        this.updateButtonState();
        this.emitInput(clamped);
    }

    /**
     * 値確定時にステップに沿って丸め込み、監視処理へ通知する。
     */
    private handleCommitEvent(): void {
        const parsed = this.parseValue(this.inputComponent.getValue());
        const clamped = this.alignToStep(this.clampValue(parsed));
        this.currentValue = clamped;
        this.inputComponent.setValue(this.formatValue(clamped));
        this.updateButtonState();
        this.emitCommit(clamped);
    }

    /**
     * ボタン操作でステップ分だけ値を増減させる。
     */
    private handleStep(direction: 1 | -1): void {
        if (this.isComponentDisabled) {
            return;
        }
        const step = this.options.step ?? 1;
        const next = this.currentValue + step * direction;
        const clamped = this.alignToStep(this.clampValue(next));
        this.currentValue = clamped;
        this.inputComponent.setValue(this.formatValue(clamped));
        this.updateButtonState();
        this.emitInput(clamped);
        this.emitCommit(clamped);
    }

    /**
     * 初期値または既定値を設定する。
     */
    private applyInitialValue(): void {
        const initial = this.options.initialValue ?? this.options.min ?? 0;
        const clamped = this.alignToStep(this.clampValue(initial));
        this.currentValue = clamped;
        this.inputComponent.setValue(this.formatValue(clamped));
        this.updateButtonState();
    }

    /**
     * 入力内容を安全な数値文字列に整える。
     */
    private sanitize(raw: string): string {
        let normalized = raw.replace(/[^0-9\-\.]/g, "");
        if (!this.allowNegative()) {
            normalized = normalized.replace(/-/g, "");
        }
        const minus = normalized.startsWith("-") ? "-" : "";
        const body = minus ? normalized.slice(1) : normalized;
        const parts = body.split(".");
        const integerPart = parts[0];
        const decimalPart = parts.slice(1).join("");
        const rebuilt = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
        return `${minus}${rebuilt}`;
    }

    /**
     * 文字列を数値へ変換する。失敗時は現在値を返す。
     */
    private parseValue(value: string): number {
        const parsed = Number.parseFloat(value);
        return Number.isNaN(parsed) ? this.currentValue : parsed;
    }

    /**
     * 範囲外の値を制約内に丸め込む。
     */
    private clampValue(value: number): number {
        let result = value;
        if (this.options.min !== undefined && result < this.options.min) {
            result = this.options.min;
        }
        if (this.options.max !== undefined && result > this.options.max) {
            result = this.options.max;
        }
        return result;
    }

    /**
     * ステップ幅に合わせた丸め込みを行う。
     */
    private alignToStep(value: number): number {
        const step = this.options.step ?? 1;
        if (step <= 0) {
            return value;
        }
        const base = this.options.min ?? 0;
        const rounded = Math.round((value - base) / step) * step + base;
        const precision = this.detectPrecision(step);
        return Number.parseFloat(rounded.toFixed(precision));
    }

    /**
     * 現在値に応じてボタンの有効状態を更新する。
     */
    private updateButtonState(): void {
        if (this.isComponentDisabled) {
            this.decrementButton.setDisabled(true);
            this.incrementButton.setDisabled(true);
            return;
        }
        const atMin = this.options.min !== undefined && this.currentValue <= this.options.min;
        const atMax = this.options.max !== undefined && this.currentValue >= this.options.max;
        this.decrementButton.setDisabled(atMin);
        this.incrementButton.setDisabled(atMax);
    }

    /**
     * 有効な小数パターンを構築する。
     */
    private buildPattern(): string {
        return this.allowNegative() ? "^-?\\d*(\\.\\d*)?$" : "^\\d*(\\.\\d*)?$";
    }

    /**
     * 値を表示用文字列に変換する。
     */
    private formatValue(value: number): string {
        return this.options.valueFormatter ? this.options.valueFormatter(value) : String(value);
    }

    /**
     * ステップ幅の小数点桁数を推定する。
     */
    private detectPrecision(step: number): number {
        const stepString = step.toString();
        if (!stepString.includes(".")) {
            return 0;
        }
        return stepString.split(".")[1]?.length ?? 0;
    }

    /**
     * 入力監視リスナーへ値を通知する。
     */
    private emitInput(value: number): void {
        for (const handler of this.inputListeners) {
            handler(value);
        }
    }

    /**
     * 値確定リスナーへ値を通知する。
     */
    private emitCommit(value: number): void {
        for (const handler of this.commitListeners) {
            handler(value);
        }
    }

    /**
     * 負の値を許容するかどうかを判定する。
     */
    private allowNegative(): boolean {
        if (this.options.allowNegative !== undefined) {
            return this.options.allowNegative;
        }
        if (this.options.min !== undefined) {
            return this.options.min < 0;
        }
        return true;
    }

    /**
     * 基本スタイルと追加スタイルを結合する。
     */
    private combineClasses(base: string, extra?: string | string[]): string | string[] {
        if (!extra) {
            return base;
        }
        return Array.isArray(extra) ? [base, ...extra] : [base, extra];
    }
}
