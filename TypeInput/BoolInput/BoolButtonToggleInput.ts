import { ButtonC, DivC, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";




import { IBoolInput } from "../Interfaces/IInputComponent";
import { button_toggle_container, button_toggle, button_toggle_active } from "./style.css";

export interface BoolButtonToggleInputOptions {
    labelTrue?: string;
    labelFalse?: string;
    initialValue?: boolean;
    disabled?: boolean;
    class?: string | string[];
    buttonClass?: string | string[];
    icon?: {
        true?: string;
        false?: string;
    };
}

type BoolChangeHandler = (value: boolean) => void;

export class BoolButtonToggleInput extends LV2HtmlComponentBase implements IBoolInput {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: BoolButtonToggleInputOptions;
    private buttonComponent!: ButtonC;
    private currentValue: boolean = false;
    private readonly changeListeners: BoolChangeHandler[] = [];

    public constructor(options: BoolButtonToggleInputOptions = {}) {
        super();
        this.options = options;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const button = new ButtonC({
                    text: this.getButtonText(this.options.initialValue ?? false),
                    class: this.buildButtonClasses(this.options.initialValue ?? false)
                })
                .addTypedEventListener("click", () => {this.handleClick();})
                .bind((component) => {
                    this.buttonComponent = component;
                    this.currentValue = this.options.initialValue ?? false;
                    if (this.options.disabled) {
                        component.setDisabled(true);
                    }
                });

        return new DivC({class: this.combineClasses(button_toggle_container, this.options.class)}).childs([button]);
    }

    /**
     * 現在の真偽値を取得する。
     */
    public getValue(): boolean {
        return this.currentValue;
    }

    /**
     * 値を更新し、ボタンの表示に反映する。
     */
    public setValue(value: boolean): this {
        this.currentValue = value;
        this.updateButton(value);
        this.emitChange(value);
        return this;
    }

    /**
     * ボタン状態を反転させる。
     */
    public toggle(): this {
        const newValue = !this.currentValue;
        this.setValue(newValue);
        return this;
    }

    /**
     * ボタンへフォーカスを移す。
     */
    public focus(): this {
        (this.buttonComponent.dom.element as HTMLButtonElement).focus();
        return this;
    }

    /**
     * ボタンの有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.buttonComponent.setDisabled(disabled);
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
     * ボタンクリックイベントを処理し、状態を切り替える。
     */
    private handleClick(): void {
        this.currentValue = !this.currentValue;
        this.updateButton(this.currentValue);
        this.emitChange(this.currentValue);
    }

    /**
     * ボタンのテキストと外観を更新する。
     */
    private updateButton(value: boolean): void {
        this.buttonComponent.dom.element.textContent = this.getButtonText(value);
        const classes = this.buildButtonClasses(value);
        this.buttonComponent.dom.element.className = "";
        this.buttonComponent.addClass(classes);
    }

    /**
     * 現在の状態に応じたボタンテキストを取得する。
     */
    private getButtonText(value: boolean): string {
        const icon = value ? this.options.icon?.true ?? "" : this.options.icon?.false ?? "";
        const label = value ? (this.options.labelTrue ?? "ON") : (this.options.labelFalse ?? "OFF");
        return icon ? `${icon} ${label}` : label;
    }

    /**
     * 現在の状態に応じたボタンのCSSクラスを構築する。
     */
    private buildButtonClasses(value: boolean): string | string[] {
        const baseClasses = this.combineClasses(button_toggle, this.options.buttonClass);
        if (!value) {
            return baseClasses;
        }
        if (Array.isArray(baseClasses)) {
            return [...baseClasses, button_toggle_active];
        }
        return [baseClasses, button_toggle_active];
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

