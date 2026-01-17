import { DivC, HtmlComponentBase, LV2HtmlComponentBase, LabelC, RadioInputC, SpanC } from "SengenUI/index";






import { radio_group_container, radio_option, radio_input, radio_label } from "./style.css";

export interface BoolRadioGroupInputOptions {
    trueLabel?: string;
    falseLabel?: string;
    initialValue?: boolean;
    disabled?: boolean;
    class?: string | string[];
    optionClass?: string | string[];
    inputClass?: string | string[];
    labelClass?: string | string[];
}

type BoolChangeHandler = (value: boolean) => void;

export class BoolRadioGroupInput extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: BoolRadioGroupInputOptions;
    private trueRadio!: RadioInputC;
    private falseRadio!: RadioInputC;
    private currentValue: boolean = false;
    private readonly changeListeners: BoolChangeHandler[] = [];
    private readonly groupName: string;

    public constructor(options: BoolRadioGroupInputOptions = {}) {
        super();
        this.options = options;
        this.groupName = `bool_radio_${Math.random().toString(36).substring(2, 11)}`;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const trueOption = this.createRadioOption(true, this.options.trueLabel ?? "はい");
        const falseOption = this.createRadioOption(false, this.options.falseLabel ?? "いいえ");

        return new DivC({class: this.combineClasses(radio_group_container, this.options.class)})
                .childs([trueOption, falseOption])
                .bind(() => {this.applyInitialValue();});
    }

    /**
     * ラジオボタンオプションを生成する。
     */
    private createRadioOption(value: boolean, labelText: string): LabelC {
        const radio = new RadioInputC({
                    name: this.groupName,
                    value: String(value),
                    class: this.combineClasses(radio_input, this.options.inputClass),
                    disabled: this.options.disabled
                })
                .addRadioEventListener("change", () => {this.handleChange(value);})
                .bind((component) => {
                    if (value) {
                        this.trueRadio = component;
                    } else {
                        this.falseRadio = component;
                    }
                });

        const label = new SpanC({ text: labelText, class: this.combineClasses(radio_label, this.options.labelClass) });

        return new LabelC({class: this.combineClasses(radio_option, this.options.optionClass)}).childs([radio, label]);
    }

    /**
     * 現在の真偽値を取得する。
     */
    public getValue(): boolean {
        return this.currentValue;
    }

    /**
     * 値を更新し、ラジオボタンの選択状態に反映する。
     */
    public setValue(value: boolean): this {
        this.currentValue = value;
        if (value) {
            this.trueRadio.setChecked(true);
        } else {
            this.falseRadio.setChecked(true);
        }
        this.emitChange(value);
        return this;
    }

    /**
     * True側のラジオボタンへフォーカスを移す。
     */
    public focus(): this {
        this.trueRadio.focus();
        return this;
    }

    /**
     * ラジオボタンの有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.trueRadio.setDisabled(disabled);
        this.falseRadio.setDisabled(disabled);
        return this;
    }

    /**
     * 値が変化したタイミングを監視するコールバックを追加する。
     */
    public onChange(handler: BoolChangeHandler): this {
        this.changeListeners.push(handler);
        return this;
    }

    /**
     * ラジオボタンの変更イベントを処理し、監視処理へ通知する。
     */
    private handleChange(value: boolean): void {
        this.currentValue = value;
        this.emitChange(value);
    }

    /**
     * 初期値を適用する。
     */
    private applyInitialValue(): void {
        const initial = this.options.initialValue ?? false;
        this.currentValue = initial;
        if (initial) {
            this.trueRadio.setChecked(true);
        } else {
            this.falseRadio.setChecked(true);
        }
    }

    /**
     * 値変更リスナーへ値を通知する。
     */
    private emitChange(value: boolean): void {
        for (const handler of this.changeListeners) {
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
}

