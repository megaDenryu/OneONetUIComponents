import { CheckboxInputC, HtmlComponentBase, LV2HtmlComponentBase, LabelC } from "SengenUI/index";




import { IBoolInput } from "../Interfaces/IInputComponent";
import { checkbox_container, checkbox_input, checkbox_label } from "./style.css";

export interface BoolCheckboxInputOptions {
    label?: string;
    initialValue?: boolean;
    disabled?: boolean;
    labelPosition?: "left" | "right";
    class?: string | string[];
    inputClass?: string | string[];
    labelClass?: string | string[];
}

type BoolChangeHandler = (value: boolean) => void;

export class BoolCheckboxInput extends LV2HtmlComponentBase implements IBoolInput {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: BoolCheckboxInputOptions;
    private checkboxComponent!: CheckboxInputC;
    private currentValue: boolean = false;
    private readonly changeListeners: BoolChangeHandler[] = [];

    public constructor(options: BoolCheckboxInputOptions = {}) {
        super();
        this.options = options;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const checkbox = new CheckboxInputC({
                    class: this.combineClasses(checkbox_input, this.options.inputClass),
                    disabled: this.options.disabled,
                    checked: this.options.initialValue ?? false
                })
                .addCheckboxEventListener("change", () => {this.handleChange();})
                .bind((component) => {
                    this.checkboxComponent = component;
                    this.currentValue = component.isChecked();
                });

        if (!this.options.label) {
            return checkbox;
        }

        const label = new LabelC({
                    text: this.options.label,
                    class: this.combineClasses(checkbox_label, this.options.labelClass)
                })
                .addTypedEventListener("click", () => {this.toggle();});

        const labelPosition = this.options.labelPosition ?? "right";
        const children = labelPosition === "left" ? [label, checkbox] : [checkbox, label];

        return new LabelC()
                .addClass(this.combineClasses(checkbox_container, this.options.class))
                .childs(children);
    }

    /**
     * 現在の真偽値を取得する。
     */
    public getValue(): boolean {
        return this.currentValue;
    }

    /**
     * 値を更新し、チェックボックスの表示に反映する。
     */
    public setValue(value: boolean): this {
        this.currentValue = value;
        this.checkboxComponent.setChecked(value);
        this.emitChange(value);
        return this;
    }

    /**
     * チェック状態を反転させる。
     */
    public toggle(): this {
        const newValue = !this.currentValue;
        this.setValue(newValue);
        return this;
    }

    /**
     * チェックボックスへフォーカスを移す。
     */
    public focus(): this {
        this.checkboxComponent.focus();
        return this;
    }

    /**
     * チェックボックスの有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.checkboxComponent.setDisabled(disabled);
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
     * チェックボックスの変更イベントを処理し、監視処理へ通知する。
     */
    private handleChange(): void {
        this.currentValue = this.checkboxComponent.isChecked();
        this.emitChange(this.currentValue);
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

