import { DivC, HtmlComponentBase, InputC, LV2HtmlComponentBase, SpanC } from "SengenUI/index";





import { INumberInput } from "../Interfaces/IInputComponent";
import { slider_container } from "./style.css";
import { slider_track } from "./style.css";
import { slider_value } from "./style.css";

export interface NumberSliderInputOptions {
    min?: number;
    max?: number;
    step?: number;
    initialValue?: number;
    disabled?: boolean;
    class?: string | string[];
    trackClass?: string | string[];
    valueClass?: string | string[];
    valueFormatter?: (value: number) => string;
}

type NumberChangeHandler = (value: number) => void;

export class NumberSliderInput extends LV2HtmlComponentBase implements INumberInput {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: NumberSliderInputOptions;
    private inputComponent!: InputC;
    private valueLabel!: SpanC;
    private currentValue: number = 0;
    private readonly inputListeners: NumberChangeHandler[] = [];
    private readonly commitListeners: NumberChangeHandler[] = [];

    public constructor(options: NumberSliderInputOptions = {}) {
        super();
        this.options = options;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({
                    class: this.combineClasses(slider_container, this.options.class)
                })
                .childs([
                    new InputC({
                        type: "range",
                        class: this.combineClasses(slider_track, this.options.trackClass),
                        disabled: this.options.disabled
                    })
                        .setRangeParam(this.buildRangeParameters())
                        .onInput(() => {this.handleInputEvent();})
                        .onChange(() => {this.handleCommitEvent();})
                        .bind((component) => {this.inputComponent = component;}),
                    new SpanC({
                        text: "",
                        class: this.combineClasses(slider_value, this.options.valueClass)
                    })
                        .bind((component) => {this.valueLabel = component;})
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
     * 数値を更新し、スライダー表示とラベルに反映する。
     */
    public setValue(value: number): this {
        const clamped = this.clampValue(value);
        this.currentValue = clamped;
        this.inputComponent.setValue(String(clamped));
        this.updateLabel(clamped);
        this.emitInput(clamped);
        return this;
    }

    /**
     * スライダーにフォーカスを移す。
     */
    public focus(): this {
        this.inputComponent.focus();
        return this;
    }

    /**
     * スライダーの有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.inputComponent.setDisabled(disabled);
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
     * 値が確定したタイミングを監視するコールバックを追加する。
     */
    public onValueCommit(handler: NumberChangeHandler): this {
        this.commitListeners.push(handler);
        return this;
    }

    /**
     * 入力イベント時に現在値とラベルを更新し、監視処理へ通知する。
     */
    private handleInputEvent(): void {
        const parsed = this.parseValue(this.inputComponent.getValue());
        const clamped = this.clampValue(parsed);
        if (clamped !== parsed) {
            this.inputComponent.setValue(String(clamped));
        }
        this.currentValue = clamped;
        this.updateLabel(clamped);
        this.emitInput(this.currentValue);
    }

    /**
     * 値確定時に丸め込みを行い、ラベルと監視処理へ伝播する。
     */
    private handleCommitEvent(): void {
        const parsed = this.parseValue(this.inputComponent.getValue());
        const clamped = this.clampValue(parsed);
        if (clamped !== parsed) {
            this.inputComponent.setValue(String(clamped));
        }
        this.currentValue = clamped;
        this.updateLabel(clamped);
        this.emitCommit(clamped);
    }

    /**
     * 初期値または既定値をスライダーへ設定する。
     */
    private applyInitialValue(): void {
        const initial = this.options.initialValue ?? this.options.min ?? 0;
        const clamped = this.clampValue(initial);
        this.currentValue = clamped;
        this.inputComponent.setValue(String(clamped));
        this.updateLabel(clamped);
    }

    /**
     * 指定された値をラベルへ描画する。
     */
    private updateLabel(value: number): void {
    this.valueLabel.setTextContent(this.formatValue(value));
    }

    /**
     * スライダーに適用する min / max / step の値を算出する。
     */
    private buildRangeParameters() {
        return {
            min: this.options.min,
            max: this.options.max,
            step: this.options.step ?? 0.1
        };
    }

    /**
     * 文字列を数値に変換し、変換失敗時は現在値を返す。
     */
    private parseValue(raw: string): number {
        const parsed = Number.parseFloat(raw);
        return Number.isNaN(parsed) ? this.currentValue : parsed;
    }

    /**
     * 範囲制約を超えないように値を丸め込む。
     */
    private clampValue(value: number): number {
        let result = value;
        if (this.options.min !== undefined && result < this.options.min) {
            result = this.options.min;
        }
        if (this.options.max !== undefined && result > this.options.max) {
            result = this.options.max;
        }
        return this.alignToStep(result);
    }

    /**
     * ステップ幅に沿って値を丸める。
     */
    private alignToStep(value: number): number {
        const step = this.options.step;
        if (!step || step <= 0) {
            return value;
        }
        const base = this.options.min ?? 0;
        const rounded = Math.round((value - base) / step) * step + base;
        const precision = this.detectPrecision(step);
        return Number.parseFloat(rounded.toFixed(precision));
    }

    /**
     * ラベル表示フォーマットを適用する。
     */
    private formatValue(value: number): string {
        return this.options.valueFormatter ? this.options.valueFormatter(value) : String(value);
    }

    /**
     * ステップ幅に応じた小数点桁数を推定する。
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
     * 基本スタイルと追加スタイルを結合する。
     */
    private combineClasses(base: string, extra?: string | string[]): string | string[] {
        if (!extra) {
            return base;
        }
        return Array.isArray(extra) ? [base, ...extra] : [base, extra];
    }

    /**
     * IInputComponent互換のonChangeメソッド
     * 値が確定したタイミング（スライダーリリースなど）で呼び出される
     */
    public onChange(callback: (value: number) => void): this {
        this.commitListeners.push(callback);
        return this;
    }

    public setMin(min: number): this {
        (this.options as any).min = min;
        this.inputComponent.setRangeParam(this.buildRangeParameters());
        return this;
    }

    public setMax(max: number): this {
        (this.options as any).max = max;
        this.inputComponent.setRangeParam(this.buildRangeParameters());
        return this;
    }
}
