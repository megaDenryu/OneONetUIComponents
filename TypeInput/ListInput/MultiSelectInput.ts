import { ButtonC, CheckboxInputC, DivC, HtmlComponentBase, LV2HtmlComponentBase, LabelC, SpanC } from "SengenUI/index";







import { EnumOption } from "../EnumInput/types";
import { multiselect_container, multiselect_checkbox_group, multiselect_checkbox_group_horizontal, multiselect_checkbox_item, multiselect_checkbox_item_checked, multiselect_checkbox, multiselect_label, multiselect_icon, multiselect_button_group, multiselect_button_group_horizontal, multiselect_button, multiselect_button_selected, multiselect_selected_count } from "./style.css";

/**
 * MultiSelectInputのオプション
 */
export interface MultiSelectInputOptions<T extends string | number> {
    /**
     * 選択肢の配列
     */
    options: EnumOption<T>[];

    /**
     * 初期選択値
     */
    initialSelected?: T[];

    /**
     * 表示バリアント（デフォルト: 'checkbox'）
     */
    variant?: 'checkbox' | 'button';

    /**
     * 配置方向（デフォルト: 'vertical'）
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * 選択数カウントを表示するか（デフォルト: true）
     */
    showCount?: boolean;

    /**
     * 値が変更された時のコールバック
     */
    onChange?: (selected: T[]) => void;
}

/**
 * MultiSelectInput - 複数選択入力コンポーネント
 * 
 * 固定の選択肢から複数項目を選択できるコンポーネント。
 * チェックボックスまたはボタングループで表示。
 */
export class MultiSelectInput<T extends string | number> extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private _options: Required<MultiSelectInputOptions<T>>;
    private _selectedValues: Set<T>;
    private _countDisplay?: DivC;
    private _itemElements: Map<T, { element: DivC | ButtonC; checkbox?: CheckboxInputC }> = new Map();

    public constructor(options: MultiSelectInputOptions<T>) {
        super();
        this._options = {
            initialSelected: [],
            variant: 'checkbox',
            direction: 'vertical',
            showCount: true,
            onChange: () => { },
            ...options
        };
        this._selectedValues = new Set(this._options.initialSelected);
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        if (this._options.variant === 'checkbox') {
            return this.createCheckboxVariant();
        } else {
            return this.createButtonVariant();
        }
    }

    /**
     * チェックボックスバリアントを作成
     */
    private createCheckboxVariant(): HtmlComponentBase {
        const groupClass = this._options.direction === 'horizontal'
            ? multiselect_checkbox_group_horizontal
            : multiselect_checkbox_group;

        const items = this._options.options.map((option) => {
            const isChecked = this._selectedValues.has(option.value);
            const checkbox = new CheckboxInputC();
            checkbox.setChecked(isChecked);

            const itemElement = new DivC({
                class: isChecked ? multiselect_checkbox_item_checked : multiselect_checkbox_item
            }).childs([
                checkbox.addClass(multiselect_checkbox),
                ...(option.icon ? [new SpanC({ text: option.icon }).addClass(multiselect_icon)] : []),
                new SpanC({ text: option.label }).addClass(multiselect_label)
            ]).addTypedEventListener("click", (event) => {
                event.preventDefault();
                this.toggleSelection(option.value);
            });

            this._itemElements.set(option.value, { element: itemElement, checkbox });
            return itemElement;
        });

        const container = new DivC({ class: multiselect_container }).childs([
            new DivC({ class: groupClass }).childs(items),
            ...(this._options.showCount ? [
                new DivC({ class: multiselect_selected_count })
                    .bind((div) => {
                        this._countDisplay = div;
                        this.updateCountDisplay();
                    })
            ] : [])
        ]);

        return container;
    }

    /**
     * ボタンバリアントを作成
     */
    private createButtonVariant(): HtmlComponentBase {
        const groupClass = this._options.direction === 'horizontal'
            ? multiselect_button_group_horizontal
            : multiselect_button_group;

        const items = this._options.options.map((option) => {
            const isSelected = this._selectedValues.has(option.value);
            const buttonClass = isSelected ? multiselect_button_selected : multiselect_button;

            const button = new ButtonC({ class: buttonClass }).childs([
                ...(option.icon ? [new SpanC({ text: option.icon })] : []),
                new SpanC({ text: option.label })
            ]).addTypedEventListener("click", (event) => {
                event.preventDefault();
                this.toggleSelection(option.value);
            });

            this._itemElements.set(option.value, { element: button });
            return button;
        });

        const container = new DivC({ class: multiselect_container }).childs([
            new DivC({ class: groupClass }).childs(items),
            ...(this._options.showCount ? [
                new DivC({ class: multiselect_selected_count })
                    .bind((div) => {
                        this._countDisplay = div;
                        this.updateCountDisplay();
                    })
            ] : [])
        ]);

        return container;
    }

    /**
     * 選択をトグルする
     */
    private toggleSelection(value: T): void {
        if (this._selectedValues.has(value)) {
            this._selectedValues.delete(value);
        } else {
            this._selectedValues.add(value);
        }

        this.updateItemUI(value);
        this.updateCountDisplay();
        this.notifyChange();
    }

    /**
     * 項目のUIを更新
     */
    private updateItemUI(value: T): void {
        const item = this._itemElements.get(value);
        if (!item) return;

        const isSelected = this._selectedValues.has(value);

        if (this._options.variant === 'checkbox') {
            // チェックボックスバリアント
            if (item.checkbox) {
                item.checkbox.setChecked(isSelected);
            }

            // DivCのクラスを更新
            const divElement = item.element as DivC;
            divElement.dom.removeCSSClass(multiselect_checkbox_item);
            divElement.dom.removeCSSClass(multiselect_checkbox_item_checked);
            divElement.addClass(isSelected ? multiselect_checkbox_item_checked : multiselect_checkbox_item);
        } else {
            // ボタンバリアント
            const buttonElement = item.element as ButtonC;
            buttonElement.dom.removeCSSClass(multiselect_button);
            buttonElement.dom.removeCSSClass(multiselect_button_selected);
            buttonElement.addClass(isSelected ? multiselect_button_selected : multiselect_button);
        }
    }

    /**
     * カウント表示を更新
     */
    private updateCountDisplay(): void {
        if (!this._countDisplay) return;

        const count = this._selectedValues.size;
        const total = this._options.options.length;
        this._countDisplay.dom.element.textContent = `選択: ${count} / ${total}`;
    }

    /**
     * 変更を通知
     */
    private notifyChange(): void {
        const selected = this.getValue();
        this._options.onChange(selected);
    }

    /**
     * 現在選択されている値を取得
     */
    public getValue(): T[] {
        return Array.from(this._selectedValues);
    }

    /**
     * 選択値を設定
     */
    public setValue(values: T[]): void {
        this._selectedValues.clear();
        values.forEach(value => {
            if (this._options.options.some(opt => opt.value === value)) {
                this._selectedValues.add(value);
            }
        });

        // すべての項目のUIを更新
        this._options.options.forEach(option => {
            this.updateItemUI(option.value);
        });

        this.updateCountDisplay();
    }

    /**
     * すべて選択
     */
    public selectAll(): void {
        this._options.options.forEach(option => {
            this._selectedValues.add(option.value);
            this.updateItemUI(option.value);
        });
        this.updateCountDisplay();
        this.notifyChange();
    }

    /**
     * すべて解除
     */
    public clearAll(): void {
        this._selectedValues.clear();
        this._options.options.forEach(option => {
            this.updateItemUI(option.value);
        });
        this.updateCountDisplay();
        this.notifyChange();
    }

    /**
     * onChangeコールバックを登録
     */
    public onChange(callback: (selected: T[]) => void): this {
        this._options.onChange = callback;
        return this;
    }

    public delete(): void {
        this._itemElements.clear();
        this._selectedValues.clear();
        super.delete();
    }
}
