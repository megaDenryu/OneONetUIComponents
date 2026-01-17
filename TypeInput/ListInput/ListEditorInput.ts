import { ButtonC, DivC, HtmlComponentBase, LV2HtmlComponentBase, SpanC } from "SengenUI/index";





import { IListInput } from "../Interfaces/IInputComponent";
import { list_editor_container, list_items_container, list_item_row, list_item_drag_handle, list_item_input_wrapper, list_item_actions, list_action_button, list_delete_button, list_add_button, list_empty_message } from "./style.css";

/**
 * ListEditorInputのオプション
 */
export interface ListEditorInputOptions<T> {
    /**
     * 各項目の入力コンポーネントを生成するファクトリー関数
     */
    itemFactory: (value?: T, index?: number) => HtmlComponentBase;
    
    /**
     * コンポーネントから値を抽出する関数
     */
    extractValue: (component: HtmlComponentBase, index: number) => T;
    
    /**
     * 初期値の配列
     */
    initialValues?: T[];
    
    /**
     * 最小項目数（デフォルト: 0）
     */
    minItems?: number;
    
    /**
     * 最大項目数（デフォルト: 制限なし）
     */
    maxItems?: number;
    
    /**
     * 並び替えを許可するか（デフォルト: true）
     */
    allowReorder?: boolean;
    
    /**
     * 値が変更された時のコールバック
     */
    onChange?: (values: T[]) => void;
}

/**
 * リスト項目の内部表現
 */
interface ListItem<T> {
    id: number;
    component: HtmlComponentBase;
    rowElement: DivC;
}

/**
 * ListEditorInput - 汎用リストエディタコンポーネント
 * 
 * 任意の型Tのリストを編集できる汎用コンポーネント。
 * 項目の追加・削除・並び替えが可能。
 * 
 * 【設計方針】
 * - 不変データ指向: 状態変更時は新しい配列を生成
 * - 状態とUIの分離: _items が真の状態、DOMは常に状態から再構築
 * - 単方向データフロー: 状態変更 → renderDOM → UI更新
 */
export class ListEditorInput<T> extends LV2HtmlComponentBase implements IListInput<T> {
    protected _componentRoot: HtmlComponentBase;
    private _options: Required<ListEditorInputOptions<T>>;
    private _items: ReadonlyArray<Readonly<ListItem<T>>> = [];  // 不変配列として扱う
    private _itemsContainer: DivC;
    private _addButton: ButtonC;
    private _nextId: number = 0;

    public constructor(options: ListEditorInputOptions<T>) {
        super();
        this._options = {
            initialValues: [],
            minItems: 0,
            maxItems: Infinity,
            allowReorder: true,
            onChange: () => {},
            ...options
        };
        this._componentRoot = this.createComponentRoot();
        
        // 初期値を追加
        if (this._options.initialValues && this._options.initialValues.length > 0) {
            const newItems: ListItem<T>[] = [];
            this._options.initialValues.forEach((value) => {
                const item = this.createItem(value);
                newItems.push(item);
            });
            this._items = newItems;
            this.renderDOM();
        }
        
        this.updateUI();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({class: list_editor_container}).childs([
            new DivC({class: list_items_container}).bind((container) => {
                this._itemsContainer = container;
            }),
            new ButtonC({text: "+ 項目を追加", class: list_add_button})
                .addTypedEventListener("click", () => {this.onAddButtonClick();})
                .bind((button) => {this._addButton = button;})
        ]);
    }

    /**
     * 項目オブジェクトを作成（状態のみ、DOMには追加しない）
     */
    private createItem(initialValue?: T): ListItem<T> {
        const id = this._nextId++;
        const index = this._items.length;
        
        // 項目コンポーネントを生成
        const itemComponent = this._options.itemFactory(initialValue, index);
        
        // 行要素を作成（イベントリスナー付き）
        const rowElement = this.createRowElement(id, itemComponent);
        
        return { id, component: itemComponent, rowElement };
    }

    /**
     * 行要素を作成（UIコンポーネント）
     */
    private createRowElement(id: number, itemComponent: HtmlComponentBase): DivC {
        return new DivC({class: list_item_row}).childs([
            // ドラッグハンドル（並び替えが有効な場合のみ）
            ...(this._options.allowReorder ? [
                new SpanC({ text: "⋮⋮" }).addClass(list_item_drag_handle)
            ] : []),
            // 入力コンポーネント
            new DivC({class: list_item_input_wrapper}).childs([itemComponent]),
            // アクションボタン
            new DivC({class: list_item_actions}).childs([
                ...(this._options.allowReorder ? [
                    new ButtonC({text: "↑", class: list_action_button})
                        .addTypedEventListener("click", () => {this.moveItemUp(id);}),
                    new ButtonC({text: "↓", class: list_action_button})
                        .addTypedEventListener("click", () => {this.moveItemDown(id);})
                ] : []),
                new ButtonC({text: "✕", class: list_delete_button})
                    .addTypedEventListener("click", () => {this.removeItem(id);})
            ])
        ]);
    }

    /**
     * DOMを状態から完全再構築する（不変データ指向の核心）
     */
    private renderDOM(): void {
        // DOMをクリア
        this._itemsContainer.dom.element.innerHTML = '';
        
        // 状態の順序通りにDOMを再構築
        this._items.forEach((item) => {
            this._itemsContainer.dom.element.appendChild(item.rowElement.dom.element);
        });
    }

    /**
     * 項目を追加する（不変データ操作）
     */
    private addItem(initialValue?: T): void {
        const newItem = this.createItem(initialValue);
        
        // 新しい配列を生成（不変操作）
        this._items = [...this._items, newItem];
        
        // DOMを再構築
        this.renderDOM();
        
        this.updateUI();
        this.notifyChange();
    }

    /**
     * 項目を削除する（不変データ操作）
     */
    private removeItem(id: number): void {
        const index = this._items.findIndex(item => item.id === id);
        if (index === -1) return;
        
        // 最小項目数チェック
        if (this._items.length <= this._options.minItems) {
            return;
        }
        
        const itemToRemove = this._items[index];
        
        // 新しい配列を生成（対象を除外）
        this._items = this._items.filter(item => item.id !== id);
        
        // コンポーネントを削除
        itemToRemove.component.delete();
        itemToRemove.rowElement.delete();
        
        // DOMを再構築
        this.renderDOM();
        
        this.updateUI();
        this.notifyChange();
    }

    /**
     * 項目を上に移動（不変データ操作）
     */
    private moveItemUp(id: number): void {
        const index = this._items.findIndex(item => item.id === id);
        if (index <= 0) return;
        
        // 新しい配列を生成（要素を入れ替え）
        const newItems = [...this._items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        this._items = newItems;
        
        // DOMを再構築
        this.renderDOM();
        
        this.updateUI();
        this.notifyChange();
    }

    /**
     * 項目を下に移動（不変データ操作）
     */
    private moveItemDown(id: number): void {
        const index = this._items.findIndex(item => item.id === id);
        if (index === -1 || index >= this._items.length - 1) return;
        
        // 新しい配列を生成（要素を入れ替え）
        const newItems = [...this._items];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        this._items = newItems;
        
        // DOMを再構築
        this.renderDOM();
        
        this.updateUI();
        this.notifyChange();
    }

    /**
     * 追加ボタンクリック
     */
    private onAddButtonClick(): void {
        if (this._items.length >= this._options.maxItems) {
            return;
        }
        
        this.addItem();
    }

    /**
     * UIを更新（ボタンの有効/無効など）
     */
    private updateUI(): void {
        // 追加ボタンの有効/無効
        const addButtonElement = this._addButton.dom.element as HTMLButtonElement;
        addButtonElement.disabled = this._items.length >= this._options.maxItems;
        
        // 空メッセージの表示/非表示
        if (this._items.length === 0) {
            if (!this._itemsContainer.dom.element.querySelector('[data-empty-message]')) {
                const emptyMessage = new DivC({
                    text: "項目がありません。「+ 項目を追加」ボタンで追加してください。",
                    class: list_empty_message
                });
                (emptyMessage.dom.element as HTMLElement).setAttribute('data-empty-message', 'true');
                this._itemsContainer.dom.element.appendChild(emptyMessage.dom.element);
            }
        } else {
            const emptyMessage = this._itemsContainer.dom.element.querySelector('[data-empty-message]');
            if (emptyMessage) {
                this._itemsContainer.dom.element.removeChild(emptyMessage);
            }
        }
        
        // 各項目のボタンの有効/無効
        this._items.forEach((item, index) => {
            const buttons = item.rowElement.dom.element.querySelectorAll('button');
            buttons.forEach((button) => {
                const text = button.textContent;
                if (text === "↑") {
                    (button as HTMLButtonElement).disabled = index === 0;
                } else if (text === "↓") {
                    (button as HTMLButtonElement).disabled = index === this._items.length - 1;
                } else if (text === "✕") {
                    (button as HTMLButtonElement).disabled = this._items.length <= this._options.minItems;
                }
            });
        });
    }

    /**
     * 変更を通知
     */
    private notifyChange(): void {
        const values = this.getValue();
        this._options.onChange(values);
    }

    /**
     * 現在の値を取得
     */
    public getValue(): T[] {
        return this._items.map((item, index) => {
            return this._options.extractValue(item.component, index);
        });
    }

    /**
     * 値を設定（不変データ操作）
     */
    public setValue(values: T[]): this {
        // 既存の項目をすべて削除
        this._items.forEach(item => {
            item.component.delete();
            item.rowElement.delete();
        });
        
        // 新しい項目を生成
        const newItems: ListItem<T>[] = values.map((value) => {
            return this.createItem(value);
        });
        
        this._items = newItems;
        
        // DOMを再構築
        this.renderDOM();
        
        this.updateUI();
        
        return this;
    }

    /**
     * onChangeコールバックを登録
     */
    public onChange(callback: (values: T[]) => void): this {
        this._options.onChange = callback;
        return this;
    }

    public delete(): void {
        this._items.forEach(item => {
            item.component.delete();
            item.rowElement.delete();
        });
        this._items = [];
        super.delete();
    }
}
