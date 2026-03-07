import { DivC, HtmlComponentBase, LV2HtmlComponentBase, SelectC } from "SengenUI/index";




import { IEnumInput } from "../Interfaces/IInputComponent";
import { select_container, select_input, select_width } from "./style.css";
import { EnumOption } from "./types";

export interface EnumSelectInputOptions<T extends string | number> {
    options: EnumOption<T>[];
    initialValue?: T;
    placeholder?: string;
    disabled?: boolean;
    width?: "small" | "medium" | "large" | "full";
    class?: string | string[];
}

type EnumChangeHandler<T> = (value: T) => void;

/**
 * Enum用セレクトボックス入力コンポーネント
 * ドロップダウンで選択肢を表示
 */
export class EnumSelectInput<T extends string | number> extends LV2HtmlComponentBase implements IEnumInput<T> {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: EnumSelectInputOptions<T>;
    private selectComponent!: SelectC;
    private currentValue: T | undefined;
    private readonly changeListeners: EnumChangeHandler<T>[] = [];

    public constructor(options: EnumSelectInputOptions<T>) {
        super();
        this.options = options;
        this.currentValue = options.initialValue;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const widthClass = this.options.width ? select_width[this.options.width] : select_width.medium;
        const classes = this.combineClasses([select_input, widthClass], this.options.class);

        // オプション配列を構築
        const selectOptions: { value: string; text: string; selected?: boolean }[] = [];

        // プレースホルダーオプション
        if (this.options.placeholder) {
            selectOptions.push({
                value: "",
                text: this.options.placeholder,
                selected: !this.options.initialValue
            });
        }

        // Enumオプションを追加
        this.options.options.forEach((opt) => {
            const displayText = opt.icon ? `${opt.icon} ${opt.label}` : opt.label;
            selectOptions.push({
                value: String(opt.value),
                text: displayText,
                selected: opt.value === this.options.initialValue
            });
        });

        return new DivC({ class: select_container }).child(
            new SelectC({
                class: classes,
                disabled: this.options.disabled,
                options: selectOptions
            })
                .bind((select) => {
                    this.selectComponent = select;
                })
                .onSelectChange((event) => {
                    const value = (event.target as HTMLSelectElement).value;
                    if (value) {
                        this.handleChange(value as T);
                    }
                })
        );
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
        this.currentValue = value;
        (this.selectComponent.dom.element as HTMLSelectElement).value = String(value);
        return this;
    }

    /**
     * フォーカスを移す。
     */
    public focus(): this {
        this.selectComponent.dom.element.focus();
        return this;
    }

    /**
     * 有効/無効を切り替える。
     */
    public setDisabled(disabled: boolean): this {
        this.selectComponent.setDisabled(disabled);
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

    /**
     * 選択肢のリストを動的に更新する。
     * @param options 新しいEnumOptionの配列
     * @param config.silent trueの場合、onChangeリスナーへの通知を抑制する。
     *   プログラム的に選択肢を差し替えるだけで副作用（保存等）を起こしたくない場合に使用する。
     */
    public setOptions(options: EnumOption<T>[], config?: { silent?: boolean }): this {
        const silent = config?.silent ?? false;
        this.options.options = options;
        
        // selectのDOMから既存のoptionを全て削除
        const selectElement = this.selectComponent.dom.element as HTMLSelectElement;
        while (selectElement.firstChild) {
            selectElement.removeChild(selectElement.firstChild);
        }

        // プレースホルダーオプション
        if (this.options.placeholder) {
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.text = this.options.placeholder;
            defaultOption.selected = !this.options.initialValue;
            selectElement.appendChild(defaultOption);
        }

        // 新しいオプション要素を追加
        this.options.options.forEach((opt) => {
            const optionElement = document.createElement("option");
            optionElement.value = String(opt.value);
            optionElement.text = opt.icon ? `${opt.icon} ${opt.label}` : opt.label;
            
            // 現在の選択値と一致、またはinitialValueと一致する場合はselectedにする
            if (this.currentValue === opt.value || (!this.currentValue && opt.value === this.options.initialValue)) {
                optionElement.selected = true;
                this.currentValue = opt.value;
            }
            selectElement.appendChild(optionElement);
        });

        // silent でない場合のみリスナーへ通知する
        if (!silent && this.currentValue !== undefined) {
             this.emitChange(this.currentValue);
        }

        return this;
    }

    /**
     * 複数のクラスを結合する。
     */
    private combineClasses(base: string | string[], extra?: string | string[]): string | string[] {
        if (!extra) {
            return base;
        }
        const baseArray = Array.isArray(base) ? base : [base];
        const extraArray = Array.isArray(extra) ? extra : [extra];
        return [...baseArray, ...extraArray];
    }
}
