import { ButtonC, DivC, HtmlComponentBase, LV2HtmlComponentBase, SelectC, SpanC } from "SengenUI/index";





import { IInputComponent } from '../Interfaces/IInputComponent';
import { ITypeSelectableInput, TypeOption, DynamicValue, convertDynamicValue, getDefaultValueForType } from './DynamicTypes';
import { 
    dynamic_list_container, 
    dynamic_list_item, 
    dynamic_list_item_content,
    dynamic_type_selector,
    dynamic_delete_button,
    dynamic_add_button,
    dynamic_nested_container,
    dynamic_depth_indicator
} from './style.css';


/**
 * DynamicListInputのオプション
 */
export interface DynamicListInputOptions {
    /** 利用可能な型オプション */
    availableTypes?: TypeOption[];
    /** 初期項目 */
    initialItems?: DynamicValue[];
    /** ラベル */
    label?: string;
    /** 最大ネスト深度（再帰的な入れ子を防ぐ） */
    maxDepth?: number;
    /** 現在のネスト深度 */
    currentDepth?: number;
}

/**
 * リスト項目を表すクラス
 * LV2的な責務を持ち、自身で子コンポーネントの参照を管理する
 */
class DynamicListItem {
    public container: DivC;
    public typeSelector: SelectC;
    public valueComponent: LV2HtmlComponentBase & IInputComponent<any>;
    private _contentDiv: DivC; // 子要素の参照を自身で管理
    private _typeOptions: TypeOption[];
    private _onTypeChange: (index: number, newType: string) => void;
    private _onDelete: (index: number) => void;
    private _onMoveUp: (index: number) => void;
    private _onMoveDown: (index: number) => void;
    private _index: number;
    private _maxDepth: number;
    private _currentDepth: number;

    constructor(
        index: number,
        initialValue: DynamicValue,
        typeOptions: TypeOption[],
        maxDepth: number,
        currentDepth: number,
        onTypeChange: (index: number, newType: string) => void,
        onDelete: (index: number) => void,
        onMoveUp: (index: number) => void,
        onMoveDown: (index: number) => void
    ) {
        this._index = index;
        this._typeOptions = typeOptions;
        this._maxDepth = maxDepth;
        this._currentDepth = currentDepth;
        this._onTypeChange = onTypeChange;
        this._onDelete = onDelete;
        this._onMoveUp = onMoveUp;
        this._onMoveDown = onMoveDown;

        // 型セレクター作成
        const selectOptions = typeOptions
            .filter(opt => {
                // 最大深度に達している場合はrecordとlistを除外
                if (currentDepth >= maxDepth && (opt.type === 'record' || opt.type === 'list')) {
                    return false;
                }
                return true;
            })
            .map(opt => ({
                value: opt.type,
                text: opt.label,
                selected: opt.type === initialValue.type
            }));

        this.typeSelector = new SelectC({ options: selectOptions, class: dynamic_type_selector })
            .addSelectEventListener('change', () => {
                const newType = (this.typeSelector.dom.element as HTMLSelectElement).value;
                this._onTypeChange(this._index, newType);
            });

        // 値コンポーネント作成
        this.valueComponent = this.createValueComponent(initialValue);

        // コンテナ作成（宣言的に、かつ子要素の参照を保持）
        this.container = new DivC({ class: dynamic_list_item }).childs([
            new DivC({ class: dynamic_list_item_content }).childs([
                this.typeSelector,
                this.valueComponent
            ]).bind((div) => { this._contentDiv = div; }), // 参照を保持
            new DivC().childs([
                new ButtonC({ text: '↑' }).addTypedEventListener('click', () => this._onMoveUp(this._index)),
                new ButtonC({ text: '↓' }).addTypedEventListener('click', () => this._onMoveDown(this._index))
            ]),
            new ButtonC({ text: '削除', class: dynamic_delete_button }).addTypedEventListener('click', () => this._onDelete(this._index))
        ]);
    }

    /**
     * 値コンポーネントを作成
     */
    private createValueComponent(value: DynamicValue): LV2HtmlComponentBase & IInputComponent<any> {
        const typeOption = this._typeOptions.find(opt => opt.type === value.type);
        if (!typeOption) {
            throw new Error(`Type ${value.type} not found in available types`);
        }

        const component = typeOption.factory();
        
        // 再帰的コンポーネントの場合は深度情報を渡す
        if ('availableTypes' in component) {
            const typeSelectable = component as ITypeSelectableInput<any>;
            typeSelectable.availableTypes(this._typeOptions);
        }
        
        // 値を設定
        component.setValue(value.value);

        return component;
    }

    /**
     * 現在の型を取得
     */
    public getCurrentType(): string {
        return (this.typeSelector.dom.element as HTMLSelectElement).value;
    }

    /**
     * 現在の値を取得
     */
    public getCurrentValue(): DynamicValue {
        const currentType = this.getCurrentType();
        
        // IInputComponentの場合
        if ('getValue' in this.valueComponent) {
            const inputComponent = this.valueComponent;
            const rawValue = inputComponent.getValue();
            
            return {
                type: currentType,
                value: rawValue
            } as DynamicValue;
        }

        // デフォルト値
        return getDefaultValueForType(currentType);
    }

    /**
     * 型を変更
     */
    public changeType(newType: string): void {
        const oldValue = this.getCurrentValue();
        const newValue = convertDynamicValue(oldValue, newType);

        // 古いコンポーネントを削除（宣言的）
        if (typeof this.valueComponent.delete === 'function') {
            this.valueComponent.delete();
        }
        this._contentDiv.removeChild(this.valueComponent);

        // 新しいコンポーネントを作成して追加（宣言的）
        this.valueComponent = this.createValueComponent(newValue);
        this._contentDiv.child(this.valueComponent);
    }

    /**
     * インデックスを更新
     */
    public updateIndex(newIndex: number): void {
        this._index = newIndex;
    }
}

/**
 * 動的型選択可能なリスト入力コンポーネント
 * 
 * @example
 * ```typescript
 * const listInput = new DynamicListInput()
 *     .availableTypes([
 *         { type: "string", label: "文字列", factory: () => new TextInput() },
 *         { type: "number", label: "数値", factory: () => new NumberInput() },
 *         { type: "boolean", label: "真偽値", factory: () => new CheckboxInput() }
 *     ])
 *     .initialItems([
 *         { type: "string", value: "Hello" },
 *         { type: "number", value: 42 }
 *     ]);
 * 
 * // 値取得
 * const items = listInput.getValue(); // DynamicValue[]
 * ```
 */
export class DynamicListInput extends LV2HtmlComponentBase implements ITypeSelectableInput<DynamicValue[]> {
    protected _componentRoot: DivC;
    private _typeOptions: TypeOption[] = [];
    private _items: DynamicListItem[] = [];
    private _itemsContainer!: DivC;
    private _maxDepth: number = 10;
    private _currentDepth: number = 0;
    private _label: string = '';

    constructor(options: DynamicListInputOptions = {}) {
        super();
        
        if (options.availableTypes) {
            this._typeOptions = options.availableTypes;
        }
        if (options.maxDepth !== undefined) {
            this._maxDepth = options.maxDepth;
        }
        if (options.currentDepth !== undefined) {
            this._currentDepth = options.currentDepth;
        }
        if (options.label) {
            this._label = options.label;
        }

        this._componentRoot = this.createComponentRoot();

        // 初期項目があれば設定
        if (options.initialItems) {
            this.initialItems(options.initialItems);
        }
    }

    protected createComponentRoot(): DivC {
        const depthIndicator = this._currentDepth > 0 
            ? new DivC({ class: dynamic_depth_indicator, text: `深度: ${this._currentDepth}` })
            : null;

        this._itemsContainer = new DivC({ class: dynamic_nested_container });

        const children: HtmlComponentBase[] = [];
        if (depthIndicator) children.push(depthIndicator);
        children.push(this._itemsContainer);
        children.push(
            new ButtonC({ text: '項目を追加', class: dynamic_add_button })
                .onClick((e) => this.addItem())
        );

        return new DivC({ class: dynamic_list_container }).childs(children);
    }

    /**
     * 利用可能な型を設定（宣言的API）
     */
    public availableTypes(types: TypeOption[]): this {
        this._typeOptions = types;
        return this;
    }

    /**
     * 初期項目を設定（宣言的API）
     */
    public initialItems(items: DynamicValue[]): this {
        // 既存項目をクリア（宣言的）
        this._items.forEach(item => {
            if (typeof item.valueComponent.delete === 'function') {
                item.valueComponent.delete();
            }
            this._itemsContainer.removeChild(item.container);
        });
        this._items = [];

        // 新しい項目を追加
        items.forEach((item, index) => {
            this.addItemInternal(index, item);
        });

        return this;
    }

    /**
     * 項目を追加（内部用）
     */
    private addItemInternal(index: number, value: DynamicValue): void {
        const item = new DynamicListItem(
            index,
            value,
            this._typeOptions,
            this._maxDepth,
            this._currentDepth + 1,
            (idx, newType) => this.changeItemType(idx, newType),
            (idx) => this.removeItem(idx),
            (idx) => this.moveItemUp(idx),
            (idx) => this.moveItemDown(idx)
        );

        this._items.push(item);
        
        // 宣言的に追加
        this._itemsContainer.child(item.container);
    }

    /**
     * 項目を追加（デフォルト値で）
     */
    public addItem(): this {
        if (this._typeOptions.length === 0) {
            console.warn('No type options available');
            return this;
        }

        const defaultType = this._typeOptions[0].type;
        const defaultValue = getDefaultValueForType(defaultType);

        this.addItemInternal(this._items.length, defaultValue);
        return this;
    }

    /**
     * 項目を削除
     */
    public removeItem(index: number): this {
        if (index < 0 || index >= this._items.length) return this;

        const item = this._items[index];
        
        // コンポーネント削除
        if (typeof item.valueComponent.delete === 'function') {
            item.valueComponent.delete();
        }

        // 宣言的に削除
        this._itemsContainer.removeChild(item.container);

        // 配列から削除
        this._items.splice(index, 1);

        // 残りの項目のインデックスを更新
        this._items.forEach((item, idx) => item.updateIndex(idx));

        return this;
    }

    /**
     * 項目の型を変更
     */
    public changeItemType(index: number, newType: string): this {
        if (index < 0 || index >= this._items.length) return this;

        const item = this._items[index];
        item.changeType(newType);

        return this;
    }

    /**
     * 項目を上に移動
     */
    public moveItemUp(index: number): this {
        if (index <= 0 || index >= this._items.length) return this;

        // 配列内で入れ替え
        [this._items[index - 1], this._items[index]] = [this._items[index], this._items[index - 1]];
        
        // インデックス更新
        this._items[index - 1].updateIndex(index - 1);
        this._items[index].updateIndex(index);

        // 宣言的にDOM更新: 上に移動する要素を新しい位置に移動
        this._itemsContainer.moveChildToIndex(this._items[index - 1].container, index - 1);

        return this;
    }

    /**
     * 項目を下に移動
     */
    public moveItemDown(index: number): this {
        if (index < 0 || index >= this._items.length - 1) return this;

        return this.moveItemUp(index + 1);
    }

    // IInputComponent実装
    public getValue(): DynamicValue[] {
        return this._items.map(item => item.getCurrentValue());
    }

    public setValue(value: DynamicValue[]): this {
        this.initialItems(value);
        return this;
    }

    private _onChangeCallback?: (value: DynamicValue[]) => void;

    public onChange(callback: (value: DynamicValue[]) => void): this {
        this._onChangeCallback = callback;
        return this;
    }

    /**
     * 値が変更されたことを通知
     */
    private notifyChange(): void {
        if (this._onChangeCallback) {
            this._onChangeCallback(this.getValue());
        }
    }

    public delete(): void {
        this._items.forEach(item => {
            if (typeof item.valueComponent.delete === 'function') {
                item.valueComponent.delete();
            }
        });
        this._items = [];
        super.delete();
    }
}
