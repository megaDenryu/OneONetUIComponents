import { HtmlComponentBase, InputC, LV2HtmlComponentBase } from "SengenUI/index";



import { IIntInput } from "../Interfaces/IInputComponent";

export interface IntTextInputOptions {
    placeholder?: string;
    class?: string | string[];
    initialValue?: number | null;
    min?: number;
    max?: number;
    allowNegative?: boolean;
    disabled?: boolean;
}

type ValueChangeHandler = (value: number | null) => void;

export class IntTextInput extends LV2HtmlComponentBase implements IIntInput {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: IntTextInputOptions;
    private inputComponent!: InputC;
    private currentValue: number | null = null;
    private readonly inputListeners: ValueChangeHandler[] = [];  //入力途中の値が変化したタイミングで呼び出す監視処理
    private readonly commitListeners: ValueChangeHandler[] = []; //フォーカスアウトなどで値が確定したタイミングの監視処理

    public constructor(options: IntTextInputOptions = {}) {
        super();
        this.options = options;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new InputC({
                    type: "text",
                    placeholder: this.options.placeholder,
                    class: this.options.class,
                    disabled: this.options.disabled,
                    inputMode: "numeric"
                })
                .setPattern(this.buildPattern())
                .onInput(() => {this.handleInputEvent();})
                .onChange(() => {this.handleCommitEvent();})
                .bind((self) => {
                    this.inputComponent = self;
                    if (this.options.initialValue !== undefined) {this.setValue(this.options.initialValue);}
                    else {this.updateCurrentValueFromComponent();}
                });
    }

    /**
     * 現在保持している整数値を返す。入力中で未確定の場合は null を返す。
     */
    public getValue(): number | null {
        return this.currentValue;
    }

    /**
     * 表示値と内部状態をまとめて更新し、登録済みの入力監視コールバックを呼び出す。
     */
    public setValue(value: number | null | undefined): this {
        if (value === null || value === undefined) {
            this.currentValue = null;
            this.inputComponent.setValue("");
            this.emitInput(null);
            return this;
        }

        const clamped = this.clampValue(value);
        this.currentValue = clamped;
        this.inputComponent.setValue(String(clamped));
        this.emitInput(clamped);
        return this;
    }

    /**
     * 入力欄にフォーカスを当てる。
     */
    public focus(): this {
        this.inputComponent.focus();
        return this;
    }

    /**
     * 入力欄の有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.inputComponent.setDisabled(disabled);
        return this;
    }

    /**
     * 入力途中の値が変化したタイミングで呼び出す監視処理を追加する。
     */
    public onValueInput(handler: ValueChangeHandler): this {
        this.inputListeners.push(handler);
        return this;
    }

    /**
     * フォーカスアウトなどで値が確定したタイミングの監視処理を追加する。
     */
    public onValueCommit(handler: ValueChangeHandler): this {
        this.commitListeners.push(handler);
        return this;
    }

    /**
     * Enter キー押下時の動作を外部から差し込む。
     */
    public onEnterKey(callback: () => void): this {
        this.inputComponent.onEnterKey(callback);
        return this;
    }

    /**
     * 入力イベント発火時に値を正規化し、監視処理へ通知する。
     */
    private handleInputEvent(): void {
        const sanitized = this.sanitize(this.inputComponent.getValue());
        if (sanitized !== this.inputComponent.getValue()) {
            this.inputComponent.setValue(sanitized);
        }

        this.currentValue = this.tryParseInt(sanitized);
        this.emitInput(this.currentValue);
    }

    /**
     * 値が確定した際に最終的な整数へ丸め込み、監視処理へ通知する。
     */
    private handleCommitEvent(): void {
        const sanitized = this.sanitize(this.inputComponent.getValue());
        const parsed = this.tryParseInt(sanitized);
        const clamped = this.clampValue(parsed);

        if (clamped === null) {
            if (sanitized !== "") {
                this.inputComponent.setValue("");
            }
            this.currentValue = null;
        } else {
            const normalized = String(clamped);
            if (sanitized !== normalized) {
                this.inputComponent.setValue(normalized);
            }
            this.currentValue = clamped;
        }

        this.emitCommit(this.currentValue);
    }

    /**
     * 入力文字列から不要な記号を排除し、必要であれば先頭の負号のみ残す。
     */
    private sanitize(raw: string): string {
        const digitsAndMinus = raw.replace(/[^0-9-]/g, "");
        if (!this.allowNegative()) {
            return digitsAndMinus.replace(/-/g, "");
        }

        const hasLeadingMinus = digitsAndMinus.startsWith("-");
        const withoutMinus = digitsAndMinus.replace(/-/g, "");
        return hasLeadingMinus ? `-${withoutMinus}` : withoutMinus;
    }

    /**
     * 正規化済み文字列を整数に変換する。未完成の入力の場合は null を返す。
     */
    private tryParseInt(value: string): number | null {
        if (value === "" || (this.allowNegative() && value === "-")) {
            return null;
        }

        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    /**
     * 最小値・最大値の制約を超えないように値を丸め込む。
     */
    private clampValue(value: number | null | undefined): number | null {
        if (value === null || value === undefined) {
            return null;
        }

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
     * 負の値を許容するかどうかを設定から参照する。
     */
    private allowNegative(): boolean {
        return this.options.allowNegative ?? false;
    }

    /**
     * 負号の扱いを含めた正規表現を生成し、HTML の pattern 属性に渡す。
     */
    private buildPattern(): string {
        return this.allowNegative() ? "^-?\\d*$" : "^\\d*$";
    }

    /**
     * 入力監視リスナーへ値を通知する。
     */
    private emitInput(value: number | null): void {
        for (const handler of this.inputListeners) {
            handler(value);
        }
    }

    /**
     * 値確定時のリスナーへ値を通知する。
     */
    private emitCommit(value: number | null): void {
        for (const handler of this.commitListeners) {
            handler(value);
        }
    }

    /**
     * 既存 DOM の値から内部状態を再計算し、必要なら正規化した値に置き換える。
     */
    private updateCurrentValueFromComponent(): void {
        const sanitized = this.sanitize(this.inputComponent.getValue());
        if (sanitized !== this.inputComponent.getValue()) {
            this.inputComponent.setValue(sanitized);
        }
        this.currentValue = this.tryParseInt(sanitized);
    }

    /**
     * IInputComponent互換のonChangeメソッド
     * 値が確定したタイミング（フォーカスアウトなど）で呼び出される
     */
    public onChange(callback: (value: number | null) => void): this {
        this.commitListeners.push(callback);
        return this;
    }
}

