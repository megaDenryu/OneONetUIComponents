import { DivC, HtmlComponentBase, LV2HtmlComponentBase, LabelC, RadioInputC, SpanC } from "SengenUI/index";






import {
    radio_group_container,
    radio_group_horizontal,
    radio_option,
    radio_input,
    radio_label,
    radio_icon,
    radio_disabled
} from "./style.css";
import { EnumOption } from "./types";

export interface EnumRadioGroupInputOptions<T extends string | number> {
    options: EnumOption<T>[];
    initialValue?: T;
    name?: string;
    disabled?: boolean;
    direction?: "vertical" | "horizontal";
    class?: string | string[];
}

type EnumChangeHandler<T> = (value: T) => void;

/**
 * Enum用ラジオボタングループ入力コンポーネント
 * 選択肢が少ない場合に最適
 */
export class EnumRadioGroupInput<T extends string | number> extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: EnumRadioGroupInputOptions<T>;
    private readonly radioInputs: Map<T, RadioInputC> = new Map();
    private currentValue: T | undefined;
    private readonly changeListeners: EnumChangeHandler<T>[] = [];
    private readonly groupName: string;

    public constructor(options: EnumRadioGroupInputOptions<T>) {
        super();
        this.options = options;
        this.currentValue = options.initialValue;
        this.groupName = options.name ?? `radio-group-${Math.random().toString(36).substr(2, 9)}`;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const containerClasses = [radio_group_container];
        if (this.options.direction === "horizontal") {
            containerClasses.push(radio_group_horizontal);
        }
        if (this.options.class) {
            containerClasses.push(...(Array.isArray(this.options.class) ? this.options.class : [this.options.class]));
        }

        return new DivC({ class: containerClasses }).childs(
            this.options.options.map((opt) => this.createRadioOption(opt))
        );
    }

    /**
     * ラジオボタンオプションを作成する。
     */
    private createRadioOption(opt: EnumOption<T>): LabelC {
        const isChecked = opt.value === this.options.initialValue;
        const isDisabled = this.options.disabled || opt.disabled;

        const radioInput = new RadioInputC({
            value: String(opt.value),
            name: this.groupName,
            checked: isChecked,
            disabled: isDisabled,
            class: radio_input
        }).bind((input) => {
            this.radioInputs.set(opt.value, input);
        });

        const optionClasses = [radio_option];
        if (isDisabled) {
            optionClasses.push(radio_disabled);
        }

        return new LabelC({ class: optionClasses })
            .childs([
                radioInput,
                opt.icon ? new SpanC({ text: opt.icon, class: radio_icon }) : undefined,
                new SpanC({ text: opt.label, class: radio_label })
            ].filter(Boolean) as HtmlComponentBase[])
            .addTypedEventListener("click", (event) => {
                if (!isDisabled) {
                    event.preventDefault(); // ラジオボタンの自動選択を防ぐ
                    this.handleChange(opt.value);
                }
            });
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
        const radioInput = this.radioInputs.get(value);
        if (radioInput) {
            this.currentValue = value;
            radioInput.setChecked(true);
        }
        return this;
    }

    /**
     * 有効/無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.radioInputs.forEach((input) => {
            input.setDisabled(disabled);
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

        // 選択されたラジオボタンをチェック
        const radioInput = this.radioInputs.get(value);
        if (radioInput) {
            radioInput.setChecked(true);
        }

        this.emitChange(value);
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
