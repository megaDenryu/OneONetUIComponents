import { ButtonC, Css長さ単位, DivC, HtmlComponentBase, LV2HtmlComponentBase, Px長さ, SpanC } from "SengenUI/index";

import { IInputComponent, IRecordInput } from "../Interfaces/IInputComponent";
import {
    record_input_container,
    record_section_title,
    record_entries_container,
    record_entry_row,
    record_entry_row_table,
    record_entry_key_wrapper,
    record_entry_value_wrapper,
    record_entry_label,
    record_entry_actions,
    record_delete_button,
    record_add_button,
    record_empty_message,
    record_table_header,
} from "./style.css";

import { RecordEntryTemplate, RecordEntryOptions } from "./RecordEntryTemplate";
import { RecordEntry } from "./RecordEntry";

// 外部インポートの互換性のために再エクスポート
export { RecordEntryTemplate };
export type { RecordEntryOptions };

/**
 * RecordInputのオプション
 */
export interface RecordInputOptions {
    layout?: "vertical" | "table";
    sectionTitle?: string;
    allowKeyEdit?: boolean;
    uniqueKeys?: boolean;
    minEntries?: number;
    maxEntries?: number;
    showAddButton?: boolean;
    showDeleteButton?: boolean;
    addButtonText?: string;
    emptyMessage?: string;
    keyColumnWidth?: Css長さ単位<any>;
    onChange?: (value: Record<string, any>) => void;
}

/**
 * RecordInputの内部オプション（Required型）
 */
interface InternalRecordInputOptions {
    layout: "vertical" | "table";
    sectionTitle?: string;
    allowKeyEdit: boolean;
    uniqueKeys: boolean;
    minEntries: number;
    maxEntries: number;
    showAddButton: boolean;
    showDeleteButton: boolean;
    addButtonText: string;
    emptyMessage: string;
    keyColumnWidth: Css長さ単位<any>;
    onChange: (value: Record<string, any>) => void;
}

/**
 * RecordInput - 宣言的Record型入力コンポーネント
 * 
 * 【使用例】
 * ```typescript
 * const input = new RecordInput<string>({
 *     layout: "table",
 *     sectionTitle: "環境変数設定"
 * }).entryTemplate(
 *     new RecordEntryTemplate(
 *         new TextInput({ placeholder: "キー" }),
 *         new TextInput({ placeholder: "値" })
 *     ).withOptions({
 *         keyLabel: "変数名",
 *         valueLabel: "設定値"
 *     })
 * ).initialEntries({ "API_KEY": "secret", "PORT": "3000" });
 * ```
 */
export class RecordInput<V> extends LV2HtmlComponentBase implements IRecordInput<string, V> {
    protected _componentRoot: HtmlComponentBase;
    private _options: InternalRecordInputOptions;
    private _entryTemplate?: RecordEntryTemplate<string, V>;
    private _entries: Map<string, RecordEntry<string, V>> = new Map();
    private _entriesContainer: DivC;
    private _addButton?: ButtonC;
    private _emptyMessage?: SpanC;
    private _tableHeader?: DivC;
    private _changeCallbacks: ((value: Record<string, V>) => void)[] = [];
    private _nextId: number = 0;

    constructor(options: RecordInputOptions = {}) {
        super();
        this._options = {
            layout: options.layout || "vertical",
            sectionTitle: options.sectionTitle,
            allowKeyEdit: options.allowKeyEdit !== undefined ? options.allowKeyEdit : true,
            uniqueKeys: options.uniqueKeys !== undefined ? options.uniqueKeys : true,
            minEntries: options.minEntries || 0,
            maxEntries: options.maxEntries || Infinity,
            showAddButton: options.showAddButton !== undefined ? options.showAddButton : true,
            showDeleteButton: options.showDeleteButton !== undefined ? options.showDeleteButton : true,
            addButtonText: options.addButtonText || "➕ エントリを追加",
            emptyMessage: options.emptyMessage || "エントリがありません",
            keyColumnWidth: options.keyColumnWidth || new Px長さ(80),
            onChange: options.onChange || (() => { })
        };
        this._componentRoot = this.createComponentRoot();
    }

    /**
     * エントリテンプレートを設定（宣言的メソッド）
     */
    public entryTemplate(template: RecordEntryTemplate<string, V>): this {
        this._entryTemplate = template;
        return this;
    }

    /**
     * 初期エントリを設定（宣言的メソッド）
     */
    public initialEntries(entries: Record<string, V>): this {
        for (const [key, value] of Object.entries(entries)) {
            this.addEntryInternal(key, value as V);
        }
        this.renderDOM();
        this.notifyChange();
        return this;
    }

    protected createComponentRoot(): HtmlComponentBase {
        const children: (HtmlComponentBase | null)[] = [
            this._options.sectionTitle ?
                new SpanC({ text: this._options.sectionTitle, class: record_section_title }) :
                null
        ];

        // テーブルレイアウトの場合はヘッダーを追加
        if (this._options.layout === "table") {
            const opts = this._entryTemplate?.getOptions();
            this._tableHeader = new DivC({ class: record_table_header })
                .setStyleCSS({
                    gridTemplateColumns: `${this._options.keyColumnWidth.toCssValue()} 1fr auto`
                })
                .childs([
                    new SpanC({ text: opts?.keyLabel || "キー" }),
                    new SpanC({ text: opts?.valueLabel || "値" }),
                    new SpanC({ text: "操作" })
                ]);
            children.push(this._tableHeader);
        }

        // エントリコンテナ
        this._entriesContainer = new DivC({ class: record_entries_container });
        children.push(this._entriesContainer);

        // 空メッセージ
        this._emptyMessage = new SpanC({
            text: this._options.emptyMessage,
            class: record_empty_message
        }).setStyleCSS({ display: 'block' });
        children.push(this._emptyMessage);

        // 追加ボタン
        if (this._options.showAddButton) {
            this._addButton = new ButtonC({
                class: record_add_button,
                text: this._options.addButtonText
            }).addTypedEventListener("click", () => this.addNewEntry());
            children.push(this._addButton);
        }

        return new DivC({ class: record_input_container }).childs(
            children.filter(c => c !== null) as HtmlComponentBase[]
        );
    }

    /**
     * 新しいエントリを追加
     */
    private addNewEntry(): void {
        if (!this._entryTemplate) {
            console.warn("RecordInput: entryTemplate が設定されていません");
            return;
        }

        const opts = this._entryTemplate.getOptions();
        let defaultKey = opts?.defaultKey || "" as string;
        const defaultValue = opts?.defaultValue as V;

        // uniqueKeysが有効で、キーが空または既に存在する場合は自動生成
        if (this._options.uniqueKeys && (defaultKey === "" || this._entries.has(defaultKey))) {
            defaultKey = this.generateUniqueKey(defaultKey);
        }

        this.addEntry(defaultKey, defaultValue);
    }

    /**
     * ユニークなキーを生成
     */
    private generateUniqueKey(baseKey: string = ""): string {
        if (baseKey === "") {
            baseKey = "key";
        }

        let counter = 1;
        let newKey = baseKey;

        // 既存のキーと重複しない番号を見つける
        while (this._entries.has(newKey)) {
            newKey = `${baseKey}_${counter}`;
            counter++;
        }

        return newKey;
    }

    /**
     * エントリを追加（公開API）
     */
    public addEntry(key: string, value: V): this {
        if (this._entries.size >= this._options.maxEntries) {
            console.warn(`RecordInput: 最大エントリ数(${this._options.maxEntries})に達しています`);
            return this;
        }

        if (this._options.uniqueKeys && this._entries.has(key)) {
            console.warn(`RecordInput: キー "${key}" は既に存在します`);
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
    private addEntryInternal(key: string, value: V): void {
        if (!this._entryTemplate) {
            return;
        }

        // ファクトリー関数から新しいInputコンポーネントのインスタンスを生成
        const keyInput = this._entryTemplate.keyInputFactory();
        const valueInput = this._entryTemplate.valueInputFactory();

        const entry = new RecordEntry(
            this._nextId++,
            keyInput,
            valueInput,
            key,
            value
        );

        // キー変更時の処理
        keyInput.onChange((newKey) => {
            if (this._options.uniqueKeys && newKey !== entry.getCurrentKey()) {
                if (this._entries.has(newKey)) {
                    console.warn(`RecordInput: キー "${newKey}" は既に存在します`);
                    return;
                }
            }

            // 古いキーのエントリを削除して新しいキーで再登録
            const oldKey = entry.getCurrentKey();
            this._entries.delete(oldKey);
            entry.updateKey(newKey);
            this._entries.set(newKey, entry);
            this.notifyChange();
        });

        // 値変更時の処理
        valueInput.onChange(() => {
            this.notifyChange();
        });

        this._entries.set(key, entry);
    }

    /**
     * エントリを削除
     */
    public removeEntry(key: string): this {
        if (this._entries.size <= this._options.minEntries) {
            console.warn(`RecordInput: 最小エントリ数(${this._options.minEntries})を下回ります`);
            return this;
        }

        const entry = this._entries.get(key);
        if (entry) {
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
        // コンテナをクリア
        this._entriesContainer.clearChildren();

        const opts = this._entryTemplate?.getOptions();
        const isTable = this._options.layout === "table";

        // エントリが空の場合
        if (this._entries.size === 0) {
            this._emptyMessage?.setStyleCSS({ display: 'block' });
            if (this._tableHeader) {
                this._tableHeader.setStyleCSS({ display: 'none' });
            }
            return;
        }

        this._emptyMessage?.setStyleCSS({ display: 'none' });
        if (this._tableHeader) {
            this._tableHeader.setStyleCSS({ display: 'grid' });
        }

        // エントリを描画
        for (const [key, entry] of this._entries.entries()) {
            const rowClass = isTable ? record_entry_row_table : record_entry_row;

            const row = new DivC({ class: rowClass })
                .tap((div) => {
                    // テーブルレイアウトの場合は動的にグリッドカラムを設定
                    if (isTable) {
                        div.setStyleCSS({
                            gridTemplateColumns: `${this._options.keyColumnWidth.toCssValue()} 1fr auto`
                        });
                    }
                })
                .childs([
                    new DivC({ class: record_entry_key_wrapper }).childs([
                        !isTable && opts?.keyLabel ?
                            new SpanC({ text: opts.keyLabel, class: record_entry_label }) :
                            null,
                        entry.keyComponent
                    ].filter(c => c !== null) as HtmlComponentBase[]),
                    new DivC({ class: record_entry_value_wrapper }).childs([
                        !isTable && opts?.valueLabel ?
                            new SpanC({ text: opts.valueLabel, class: record_entry_label }) :
                            null,
                        entry.valueComponent
                    ].filter(c => c !== null) as HtmlComponentBase[]),
                    this._options.showDeleteButton ?
                        new DivC({ class: record_entry_actions }).childs([
                            new ButtonC({ class: record_delete_button, text: "🗑️ 削除" })
                                .addTypedEventListener("click", () => this.removeEntry(key))
                        ]) :
                        null
                ].filter(c => c !== null) as HtmlComponentBase[]);

            entry.rowElement = row;
            this._entriesContainer.childs([row]);
        }

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
    // IRecordInput 実装
    // ========================================

    public getValue(): Record<string, V> {
        const result: Record<string, V> = {};
        for (const [key, entry] of this._entries.entries()) {
            result[key] = entry.getValue();
        }
        return result;
    }

    public setValue(value: Record<string, V>): this {
        this._entries.clear();
        for (const [key, val] of Object.entries(value)) {
            this.addEntryInternal(key, val as V);
        }
        this.renderDOM();
        return this;
    }

    public onChange(callback: (value: Record<string, V>) => void): this {
        this._changeCallbacks.push(callback);
        return this;
    }

    public hasKey(key: string): boolean {
        return this._entries.has(key);
    }

    public getKeys(): string[] {
        return Array.from(this._entries.keys());
    }

    public getEntryCount(): number {
        return this._entries.size;
    }

    public clearAll(): this {
        this._entries.clear();
        this.renderDOM();
        this.notifyChange();
        return this;
    }

    public delete(): void {
        this._entries.clear();
        this._changeCallbacks = [];
        super.delete();
    }
}
