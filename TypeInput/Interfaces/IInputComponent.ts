/**
 * すべてのInputコンポーネントが実装すべき基本インターフェース
 * 
 * このインターフェースにより、異なる型のInputコンポーネントを
 * 統一的に扱うことができ、オブジェクト型インプットなどの
 * 複合コンポーネントを構築しやすくなる。
 */
export interface IInputComponent<T> {
    bind(func:(component: this) => void): this
    /**
     * 現在の値を取得する
     * @returns 現在の値
     */
    getValue(): T;
    
    /**
     * 値を設定する
     * @param value 設定する値
     * @returns this (メソッドチェーン用)
     */
    setValue(value: T): this;
    
    /**
     * 値変更時のコールバックを登録する
     * @param callback 値が変更された時に呼ばれる関数
     * @returns this (メソッドチェーン用)
     */
    onChange(callback: (value: T) => void): this;
    
    /**
     * プレースホルダーを設定する（オプショナル）
     * @param placeholder プレースホルダーテキスト
     * @returns this (メソッドチェーン用)
     */
    setPlaceholder?(placeholder: string): this;
    
    /**
     * 無効化状態を設定する（オプショナル）
     * @param disabled 無効化するかどうか
     * @returns this (メソッドチェーン用)
     */
    setDisabled?(disabled: boolean): this;
    
    /**
     * 読み取り専用状態を設定する（オプショナル）
     * @param readonly 読み取り専用にするかどうか
     * @returns this (メソッドチェーン用)
     */
    setReadonly?(readonly: boolean): this;
}

/**
 * テキスト入力系コンポーネントの公開API
 */
export interface ITextInput extends IInputComponent<string> {
    getValue(): string;
    setValue(value: string): this;
    onChange(callback: (value: string) => void): this;
    focus(): void;
    blur(): void;
    setDisabled?(disabled: boolean): this;
}

/**
 * 数値入力系コンポーネントの公開API
 */
export interface INumberInput extends IInputComponent<number> {
    getValue(): number;
    setValue(value: number): this;
    onChange(callback: (value: number) => void): this;
    setDisabled?(disabled: boolean): this;
    setMin?(min: number): this;
    setMax?(max: number): this;
}

/**
 * 整数入力系コンポーネントの公開API（null許容）
 */
export interface IIntInput extends IInputComponent<number | null> {
    getValue(): number | null;
    setValue(value: number | null): this;
    onValueCommit(callback: (value: number | null) => void): this;
    setDisabled?(disabled: boolean): this;
}

/**
 * Bool入力系コンポーネントの公開API
 */
export interface IBoolInput extends IInputComponent<boolean> {
    getValue(): boolean;
    setValue(value: boolean): this;
    onChange(callback: (value: boolean) => void): this;
    toggle?(): this;
    setDisabled?(disabled: boolean): this;
}

/**
 * Enum入力系コンポーネントの公開API
 */
export interface IEnumInput<T extends string | number> extends IInputComponent<T | undefined> {
    getValue(): T | undefined;
    setValue(value: T): this;
    onChange(callback: (value: T) => void): this;
    setDisabled?(disabled: boolean): this;
    focus?(): void;
}

/**
 * List入力系コンポーネントの公開API
 */
export interface IListInput<T> extends IInputComponent<T[]> {
    getValue(): T[];
    setValue(values: T[]): this;
    onChange(callback: (values: T[]) => void): this;
}

/**
 * MultiSelect入力系コンポーネントの公開API
 */
export interface IMultiSelectInput<T extends string | number> extends IInputComponent<T[]> {
    getValue(): T[];
    setValue(values: T[]): this;
    onChange(callback: (selected: T[]) => void): this;
    selectAll?(): void;
    clearAll?(): void;
}

/**
 * オブジェクト型入力コンポーネントのフィールド定義
 */
export interface ObjectFieldDefinition<T = any> {
    key: string;
    label: string;
    inputComponent: IInputComponent<T>;
    required?: boolean;
    defaultValue?: T;
}

/**
 * オブジェクト型入力コンポーネントの公開API
 */
export interface IObjectInput<T extends Record<string, any>> extends IInputComponent<T> {
    getValue(): T;
    setValue(value: Partial<T>): this;
    onChange(callback: (value: T) => void): this;
    validate?(): boolean;
    getErrors?(): Record<string, string>;
}

/**
 * Record型入力コンポーネントの公開API
 */
export interface IRecordInput<K extends string | number, V> extends IInputComponent<Record<K, V>> {
    getValue(): Record<K, V>;
    setValue(value: Record<K, V>): this;
    onChange(callback: (value: Record<K, V>) => void): this;
    
    // Record特有のメソッド
    addEntry?(key: K, value: V): this;
    removeEntry?(key: K): this;
    hasKey?(key: K): boolean;
    getKeys?(): K[];
    getEntryCount?(): number;
    clearAll?(): this;
}