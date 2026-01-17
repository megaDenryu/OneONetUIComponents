import { CheckboxInputC, DivC, HtmlComponentBase, LV2HtmlComponentBase, LabelC, SpanC } from "SengenUI/index";






import { toggle_container, toggle_switch, toggle_input, toggle_slider, toggle_slider_checked, toggle_label } from "./style.css";

export interface BoolToggleSwitchInputOptions {
    label?: string;
    initialValue?: boolean;
    disabled?: boolean;
    labelPosition?: "left" | "right";
    class?: string | string[];
    switchClass?: string | string[];
    labelClass?: string | string[];
}

type BoolChangeHandler = (value: boolean) => void;

export class BoolToggleSwitchInput extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: BoolToggleSwitchInputOptions;
    private inputComponent!: CheckboxInputC;
    private sliderComponent!: SpanC;
    private currentValue: boolean = false;
    private readonly changeListeners: BoolChangeHandler[] = [];

    public constructor(options: BoolToggleSwitchInputOptions = {}) {
        super();
        this.options = options;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const hiddenInput = new CheckboxInputC({
                    class: toggle_input, 
                    disabled: this.options.disabled,
                    checked: this.options.initialValue ?? false
                })
                .bind((component) => {
                    this.inputComponent = component;
                    this.currentValue = this.options.initialValue ?? false;
                });

        const slider = new SpanC({ text: "", class: toggle_slider })
                .bind((component) => {
                    this.sliderComponent = component;
                    if (this.options.initialValue) {
                        component.addClass(toggle_slider_checked);
                    }
                });

        const switchLabel = new LabelC({class: this.combineClasses(toggle_switch, this.options.switchClass)})
                .childs([hiddenInput, slider])
                .addTypedEventListener("click", (event) => {
                    event.preventDefault(); // checkboxの自動トグルを防ぐ
                    this.handleClick();
                });

        if (!this.options.label) {
            return switchLabel;
        }

        const textLabel = new SpanC({ text: this.options.label, class: this.combineClasses(toggle_label, this.options.labelClass) });
        const labelPosition = this.options.labelPosition ?? "right";
        const children = labelPosition === "left" ? [textLabel, switchLabel] : [switchLabel, textLabel];

        return new DivC({class: this.combineClasses(toggle_container, this.options.class)}).childs(children);
    }

    /**
     * 現在の真偽値を取得する。
     */
    public getValue(): boolean {
        return this.currentValue;
    }

    /**
     * 値を更新し、トグルスイッチの表示に反映する。
     */
    public setValue(value: boolean): this {
        this.currentValue = value;
        this.inputComponent.setChecked(value);
        this.updateSlider(value);
        this.emitChange(value);
        return this;
    }

    /**
     * トグル状態を反転させる。
     */
    public toggle(): this {
        const newValue = !this.currentValue;
        this.setValue(newValue);
        return this;
    }

    /**
     * トグルスイッチへフォーカスを移す。
     */
    public focus(): this {
        this.inputComponent.focus();
        return this;
    }

    /**
     * トグルスイッチの有効 / 無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.inputComponent.setDisabled(disabled);
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
     * クリックイベントを処理し、状態を切り替える。
     */
    private handleClick(): void {
        this.currentValue = !this.currentValue;
        this.inputComponent.setChecked(this.currentValue);
        this.updateSlider(this.currentValue);
        this.emitChange(this.currentValue);
    }

    /**
     * スライダーの視覚的な状態を更新する。
     */
    private updateSlider(value: boolean): void {
        if (value) {
            this.sliderComponent.addClass(toggle_slider_checked);
        } else {
            this.sliderComponent.dom.removeCSSClass(toggle_slider_checked);
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

