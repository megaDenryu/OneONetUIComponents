import { ButtonC, DivC, HtmlComponentBase, LV2HtmlComponentBase, SpanC } from "SengenUI/index";





import { IEnumInput } from "../Interfaces/IInputComponent";
import {
    button_group_container,
    button_group_vertical,
    enum_button,
    enum_button_selected,
    enum_button_icon
} from "./style.css";
import { EnumOption } from "./types";

export interface EnumButtonGroupInputOptions<T extends string | number> {
    options: EnumOption<T>[];
    initialValue?: T;
    disabled?: boolean;
    direction?: "horizontal" | "vertical";
    class?: string | string[];
}

type EnumChangeHandler<T> = (value: T) => void;

/**
 * Enum用ボタングループ入力コンポーネント
 * タブのような見た目で選択
 */
export class EnumButtonGroupInput<T extends string | number> extends LV2HtmlComponentBase implements IEnumInput<T> {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: EnumButtonGroupInputOptions<T>;
    private readonly buttons: Map<T, ButtonC> = new Map();
    private currentValue: T | undefined;
    private readonly changeListeners: EnumChangeHandler<T>[] = [];

    public constructor(options: EnumButtonGroupInputOptions<T>) {
        super();
        this.options = options;
        this.currentValue = options.initialValue;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const containerClasses = [button_group_container];
        if (this.options.direction === "vertical") {
            containerClasses.push(button_group_vertical);
        }
        if (this.options.class) {
            containerClasses.push(...(Array.isArray(this.options.class) ? this.options.class : [this.options.class]));
        }

        return new DivC({ class: containerClasses }).childs(
            this.options.options.map((opt) => this.createButton(opt))
        );
    }

    /**
     * ボタンを作成する。
     */
    private createButton(opt: EnumOption<T>): ButtonC {
        const isSelected = opt.value === this.options.initialValue;
        const isDisabled = this.options.disabled || opt.disabled;

        const buttonClasses = [enum_button];
        if (isSelected) {
            buttonClasses.push(enum_button_selected);
        }

        const button = new ButtonC({
            class: buttonClasses,
            disabled: isDisabled
        })
            .childs([
                opt.icon ? new SpanC({ text: opt.icon, class: enum_button_icon }) : undefined,
                new SpanC({ text: opt.label })
            ].filter(Boolean) as HtmlComponentBase[])
            .addTypedEventListener("click", () => {
                if (!isDisabled) {
                    this.handleChange(opt.value);
                }
            })
            .bind((btn) => {
                this.buttons.set(opt.value, btn);
            });

        return button;
    }

    /**
     * 現在の値を取得する。
     */
    public getValue(): T | undefined {
        return this.currentValue;
    }

    /**
     * 値を設定する。
     */
    public setValue(value: T): this {
        if (this.currentValue === value) return this;

        this.currentValue = value;
        this.updateButtonStyles();
        return this;
    }

    /**
     * 有効/無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.buttons.forEach((button) => {
            button.setDisabled(disabled);
        });
        return this;
    }

    /**
     * 値が変化したタイミングを監視するコールバックを追加する。
     */
    public onChange(handler: EnumChangeHandler<T>): this {
        this.changeListeners.push(handler);
        return this;
    }

    /**
     * 選択変更を処理する。
     */
    private handleChange(value: T): void {
        this.currentValue = value;
        this.updateButtonStyles();
        this.emitChange(value);
    }

    /**
     * ボタンのスタイルを更新する。
     */
    private updateButtonStyles(): void {
        this.buttons.forEach((button, value) => {
            if (value === this.currentValue) {
                button.addClass(enum_button_selected);
            } else {
                button.dom.removeCSSClass(enum_button_selected);
            }
        });
    }

    /**
     * 値変更リスナーへ値を通知する。
     */
    private emitChange(value: T): void {
        for (const handler of this.changeListeners) {
            handler(value);
        }
    }
}
