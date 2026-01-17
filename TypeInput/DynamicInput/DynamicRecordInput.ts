import { ButtonC, DivC, HtmlComponentBase, InputC, LV2HtmlComponentBase, SelectC, SpanC } from "SengenUI/index";

import { IInputComponent } from "../Interfaces/IInputComponent";
import { 
    DynamicValue, 
    TypeOption, 
    ITypeSelectableInput, 
    convertDynamicValue, 
    getDefaultValueForType 
} from "./DynamicTypes";
import {
    dynamic_record_container,
    dynamic_entry_row,
    dynamic_entry_header,
    dynamic_entry_key,
    dynamic_type_selector,
    dynamic_delete_button,
    dynamic_entry_value_wrapper,
    dynamic_nested_container,
    dynamic_add_button,
    dynamic_empty_message,
    dynamic_section_title,
    dynamic_depth_indicator,
    dynamic_collapse_button
} from "./style.css";

/**
 * DynamicRecordInputのオプション
 */
export interface DynamicRecordInputOptions {
    sectionTitle?: string;
    allowKeyEdit?: boolean;
    uniqueKeys?: boolean;
    minEntries?: number;
    maxEntries?: number;
    showAddButton?: boolean;
    addButtonText?: string;
    emptyMessage?: string;
    maxDepth?: number;
    onChange?: (value: Record<string, DynamicValue>) => void;
}

/**
 * 内部オプション（Required型）
 */
interface InternalDynamicRecordInputOptions {
    sectionTitle?: string;
    allowKeyEdit: boolean;
    uniqueKeys: boolean;
    minEntries: number;
    maxEntries: number;
    showAddButton: boolean;
    addButtonText: string;
    emptyMessage: string;
    maxDepth: number;
    onChange: (value: Record<string, DynamicValue>) => void;
}

/**
 * DynamicEntry - 1つのキー・値ペアを表現する内部クラス
 */
class DynamicEntry {
    public readonly id: number;
    public keyInput: InputC;
    public typeSelector: SelectC;
    public valueComponent: HtmlComponentBase;
    public rowElement: DivC;
    public collapsed: boolean = false;
    
    private _currentKey: string;
    private _currentType: string;
    private _currentValue: DynamicValue;
    private _valueInput: IInputComponent<any>;

    constructor(
        id: number,
        initialKey: string,
        initialValue: DynamicValue,
        typeOptions: Map<string, TypeOption>
    ) {
        this.id = id;
        this._currentKey = initialKey;
        this._currentType = initialValue.type;
        this._currentValue = initialValue;
        
        // キー入力
        this.keyInput = new InputC({ 
            value: initialKey, 
            class: dynamic_entry_key 
        });
        
        // 型セレクター
        const options: { value: string; text: string; selected?: boolean }[] = [];
        for (const [type, opt] of typeOptions) {
            options.push({ 
                value: type, 
                text: `${opt.icon || ''} ${opt.label}`,
                selected: type === initialValue.type
            });
        }
        this.typeSelector = new SelectC({
            options,
            class: dynamic_type_selector
        });
        
        // 値コンポーネントは後で設定
        this._valueInput = null as any;
        this.valueComponent = new DivC();
    }

    public getCurrentKey(): string {
        return this._currentKey;
    }

    public updateKey(newKey: string): void {
        this._currentKey = newKey;
    }

    public getCurrentType(): string {
        return this._currentType;
    }

    public getCurrentValue(): DynamicValue {
        return this._currentValue;
    }

    public setValueInput(input: IInputComponent<any>): void {
        this._valueInput = input;
        this.valueComponent = input as unknown as HtmlComponentBase;
    }

    public getValueInput(): IInputComponent<any> {
        return this._valueInput;
    }

    public updateType(newType: string): void {
        this._currentType = newType;
    }

    public updateValue(newValue: DynamicValue): void {
        this._currentValue = newValue;
    }
}

/**
 * DynamicRecordInput - 動的型選択可能なRecord入力コンポーネント
 * 
 * 【使用例】
 * ```typescript
 * const input = new DynamicRecordInput()
 *     .availableTypes([
 *         { type: "string", label: "文字列", factory: () => new TextInput() },
 *         { type: "number", label: "数値", factory: () => new NumberSliderInput() }
 *     ])
 *     .initialEntries({
 *         "name": { type: "string", value: "太郎" },
 *         "age": { type: "number", value: 25 }
 *     });
 * ```
 */
export class DynamicRecordInput extends LV2HtmlComponentBase 
    implements ITypeSelectableInput<Record<string, DynamicValue>> {
    
    protected _componentRoot: HtmlComponentBase;
    private _options: InternalDynamicRecordInputOptions;
    private _typeOptions: Map<string, TypeOption> = new Map();
    private _entries: Map<string, DynamicEntry> = new Map();
    private _entriesContainer: DivC;
    private _addButton?: ButtonC;
    private _emptyMessage?: SpanC;
    private _changeCallbacks: ((value: Record<string, DynamicValue>) => void)[] = [];
    private _nextId: number = 0;
    private _currentDepth: number;

    constructor(options: DynamicRecordInputOptions = {}, depth: number = 0) {
        super();
        this._currentDepth = depth;
        this._options = {
            sectionTitle: options.sectionTitle,
            allowKeyEdit: options.allowKeyEdit !== undefined ? options.allowKeyEdit : true,
            uniqueKeys: options.uniqueKeys !== undefined ? options.uniqueKeys : true,
            minEntries: options.minEntries || 0,
            maxEntries: options.maxEntries || Infinity,
            showAddButton: options.showAddButton !== undefined ? options.showAddButton : true,
            addButtonText: options.addButtonText || "➕ エントリを追加",
            emptyMessage: options.emptyMessage || "エントリがありません",
            maxDepth: options.maxDepth || 10,
            onChange: options.onChange || (() => {})
        };
        this._componentRoot = this.createComponentRoot();
    }

    /**
     * 使用可能な型を設定（宣言的メソッド）
     */
    public availableTypes(types: TypeOption[]): this {
        this._typeOptions.clear();
        for (const opt of types) {
            this._typeOptions.set(opt.type, opt);
        }
        return this;
    }

    /**
     * 初期エントリを設定（宣言的メソッド）
     */
    public initialEntries(entries: Record<string, DynamicValue>): this {
        for (const [key, value] of Object.entries(entries)) {
            this.addEntryInternal(key, value);
        }
        this.renderDOM();
        this.notifyChange();
        return this;
    }

    protected createComponentRoot(): HtmlComponentBase {
        const children: (HtmlComponentBase | null)[] = [];

        // セクションタイトル
        if (this._options.sectionTitle) {
            children.push(new SpanC({ text: this._options.sectionTitle, class: dynamic_section_title }));
        }

        // エントリコンテナ
        this._entriesContainer = new DivC({ class: dynamic_record_container });
        children.push(this._entriesContainer);

        // 空メッセージ
        this._emptyMessage = new SpanC({
            text: this._options.emptyMessage,
            class: dynamic_empty_message
        }).setStyleCSS({ display: 'block' });
        children.push(this._emptyMessage);

        // 追加ボタン
        if (this._options.showAddButton) {
            this._addButton = new ButtonC({ 
                class: dynamic_add_button, 
                text: this._options.addButtonText 
            }).addTypedEventListener("click", () => this.addNewEntry());
            children.push(this._addButton);
        }

        const container = new DivC();
        if (this._currentDepth > 0) {
            container.addClass(dynamic_depth_indicator);
        }
        
        return container.childs(
            children.filter(c => c !== null) as HtmlComponentBase[]
        );
    }

    /**
     * 新しいエントリを追加
     */
    private addNewEntry(): void {
        if (this._typeOptions.size === 0) {
            console.warn("DynamicRecordInput: availableTypes が設定されていません");
            return;
        }

        // デフォルトで最初の型を使用
        const firstType = Array.from(this._typeOptions.keys())[0];
        const defaultValue = getDefaultValueForType(firstType);
        
        const newKey = this.generateUniqueKey("key");
        this.addEntry(newKey, defaultValue);
    }

    /**
     * ユニークなキーを生成
     */
    private generateUniqueKey(baseKey: string = "key"): string {
        let counter = 1;
        let newKey = baseKey;
        
        while (this._entries.has(newKey)) {
            newKey = `${baseKey}_${counter}`;
            counter++;
        }
        
        return newKey;
    }

    /**
     * エントリを追加（公開API）
     */
    public addEntry(key: string, value: DynamicValue): this {
        if (this._entries.size >= this._options.maxEntries) {
            console.warn(`DynamicRecordInput: 最大エントリ数(${this._options.maxEntries})に達しています`);
            return this;
        }

        if (this._options.uniqueKeys && this._entries.has(key)) {
            console.warn(`DynamicRecordInput: キー "${key}" は既に存在します`);
            return this;
        }

        this.addEntryInternal(key, value);
        this.renderDOM();
        this.notifyChange();
        return this;
    }

    /**
     * 内部的にエントリを追加
     */
    private addEntryInternal(key: string, value: DynamicValue): void {
        const entry = new DynamicEntry(
            this._nextId++,
            key,
            value,
            this._typeOptions
        );

        // 値Inputコンポーネントを生成
        const valueInput = this.createValueInput(value);
        entry.setValueInput(valueInput);

        // キー変更イベント
        entry.keyInput.addInputEventListener("change", () => {
            const newKey = (entry.keyInput.dom.element as HTMLInputElement).value;
            if (this._options.uniqueKeys && newKey !== entry.getCurrentKey()) {
                if (this._entries.has(newKey)) {
                    console.warn(`キー "${newKey}" は既に存在します`);
                    (entry.keyInput.dom.element as HTMLInputElement).value = entry.getCurrentKey();
                    return;
                }
            }
            
            const oldKey = entry.getCurrentKey();
            this._entries.delete(oldKey);
            entry.updateKey(newKey);
            this._entries.set(newKey, entry);
            this.notifyChange();
        });

        // 型変更イベント
        entry.typeSelector.addSelectEventListener("change", () => {
            const newType = (entry.typeSelector.dom.element as HTMLSelectElement).value;
            this.changeEntryType(entry, newType);
        });

        // 値変更イベント
        valueInput.onChange(() => {
            this.updateEntryValue(entry);
            this.notifyChange();
        });

        this._entries.set(key, entry);
    }

    /**
     * エントリの型を変更
     */
    private changeEntryType(entry: DynamicEntry, newType: string): void {
        const oldValue = entry.getCurrentValue();
        const newValue = convertDynamicValue(oldValue, newType);
        
        // 古いコンポーネントを削除
        const oldInput = entry.getValueInput() as any;
        if (oldInput && typeof oldInput.delete === 'function') {
            oldInput.delete();
        }
        
        // 新しいコンポーネントを生成
        const newValueInput = this.createValueInput(newValue);
        entry.setValueInput(newValueInput);
        entry.updateType(newType);
        entry.updateValue(newValue);
        
        // 値変更イベントを再登録
        newValueInput.onChange(() => {
            this.updateEntryValue(entry);
            this.notifyChange();
        });
        
        // DOM再レンダリング
        this.renderDOM();
        this.notifyChange();
    }

    /**
     * エントリの値を更新
     */
    private updateEntryValue(entry: DynamicEntry): void {
        const valueInput = entry.getValueInput();
        const rawValue = valueInput.getValue();
        
        const dynamicValue: DynamicValue = {
            type: entry.getCurrentType(),
            value: rawValue
        } as DynamicValue;
        
        entry.updateValue(dynamicValue);
    }

    /**
     * 値Inputコンポーネントを生成
     */
    private createValueInput(value: DynamicValue): IInputComponent<any> {
        const typeOption = this._typeOptions.get(value.type);
        
        if (!typeOption) {
            console.warn(`型 "${value.type}" の設定が見つかりません`);
            const firstOption = this._typeOptions.values().next().value;
            return firstOption ? firstOption.factory() : { getValue: () => null, setValue: () => {}, onChange: () => {} } as any;
        }

        // 再帰的な生成（record, list）
        if (value.type === "record" && this._currentDepth < this._options.maxDepth) {
            const recordInput = typeOption.factory() as unknown as DynamicRecordInput;
            // factory()で既にavailableTypesが設定されている前提で、値を設定
            if (value.value && typeof value.value === 'object') {
                recordInput.setValue(value.value as Record<string, DynamicValue>);
            }
            return recordInput as unknown as IInputComponent<any>;
        }

        if (value.type === "list" && this._currentDepth < this._options.maxDepth) {
            const listInput = typeOption.factory() as unknown as IInputComponent<DynamicValue[]>;
            if (Array.isArray(value.value)) {
                listInput.setValue(value.value as DynamicValue[]);
            }
            return listInput;
        }

        // 通常の型
        const input = typeOption.factory();
        if (value.value !== undefined && value.value !== null) {
            input.setValue(value.value);
        }
        return input;
    }

    /**
     * エントリを削除
     */
    public removeEntry(key: string): this {
        if (this._entries.size <= this._options.minEntries) {
            console.warn(`DynamicRecordInput: 最小エントリ数(${this._options.minEntries})を下回ります`);
            return this;
        }

        const entry = this._entries.get(key);
        if (entry) {
            const valueInput = entry.getValueInput() as any;
            if (valueInput && typeof valueInput.delete === 'function') {
                valueInput.delete();
            }
            this._entries.delete(key);
            this.renderDOM();
            this.notifyChange();
        }
        return this;
    }

    /**
     * DOM再レンダリング
     */
    private renderDOM(): void {
        this._entriesContainer.clearChildren();

        if (this._entries.size === 0) {
            this._emptyMessage?.setStyleCSS({ display: 'block' });
            return;
        }

        this._emptyMessage?.setStyleCSS({ display: 'none' });

        const rows: DivC[] = [];
        for (const [key, entry] of this._entries.entries()) {
            const row = new DivC({ class: dynamic_entry_row }).childs([
                new DivC({ class: dynamic_entry_header }).childs([
                    entry.keyInput.setStyleCSS({ flex: '1' }),
                    entry.typeSelector,
                    new ButtonC({ class: dynamic_delete_button, text: "🗑️" })
                        .addTypedEventListener("click", () => this.removeEntry(key))
                ]),
                new DivC({ class: dynamic_entry_value_wrapper }).childs([
                    entry.valueComponent
                ])
            ]);

            entry.rowElement = row;
            rows.push(row);
        }
        
        this._entriesContainer.childs(rows);
        this.updateAddButtonState();
    }

    /**
     * 追加ボタンの状態を更新
     */
    private updateAddButtonState(): void {
        if (this._addButton) {
            const disabled = this._entries.size >= this._options.maxEntries;
            if (disabled) {
                this._addButton.dom.element.setAttribute('disabled', 'true');
            } else {
                this._addButton.dom.element.removeAttribute('disabled');
            }
        }
    }

    /**
     * 変更を通知
     */
    private notifyChange(): void {
        const value = this.getValue();
        this._options.onChange(value);
        this._changeCallbacks.forEach(callback => callback(value));
    }

    // ========================================
    // IInputComponent 実装
    // ========================================

    public getValue(): Record<string, DynamicValue> {
        const result: Record<string, DynamicValue> = {};
        for (const [key, entry] of this._entries.entries()) {
            result[key] = entry.getCurrentValue();
        }
        return result;
    }

    public setValue(value: Record<string, DynamicValue>): this {
        this._entries.clear();
        for (const [key, val] of Object.entries(value)) {
            this.addEntryInternal(key, val);
        }
        this.renderDOM();
        return this;
    }

    public onChange(callback: (value: Record<string, DynamicValue>) => void): this {
        this._changeCallbacks.push(callback);
        return this;
    }

    public getSelectedType(key: string): string {
        const entry = this._entries.get(key);
        return entry ? entry.getCurrentType() : "";
    }

    public changeType(key: string, newType: string): this {
        const entry = this._entries.get(key);
        if (entry) {
            this.changeEntryType(entry, newType);
        }
        return this;
    }

    public delete(): void {
        for (const entry of this._entries.values()) {
            const valueInput = entry.getValueInput() as any;
            if (valueInput && typeof valueInput.delete === 'function') {
                valueInput.delete();
            }
        }
        this._entries.clear();
        this._changeCallbacks = [];
        super.delete();
    }
}

