import { IInputComponent } from "../Interfaces/IInputComponent";
import { ValidationRule } from "../Interfaces/Validation";

/**
 * RecordEntryOptions - エントリの装飾とバリデーション
 * ObjectInputのPropertyOptionsに相当する役割
 */
export interface RecordEntryOptions<K extends string | number, V> {
    // ラベル
    keyLabel?: string;
    valueLabel?: string;
 
    // バリデーション
    keyValidator?: ValidationRule<K>;
    valueValidator?: ValidationRule<V>;
    uniqueKeys?: boolean;
 
    // UI設定
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    keyDisabled?: boolean;
    valueDisabled?: boolean;
 
    // 表示制御
    showKeyInline?: boolean;
    compactMode?: boolean;
 
    // デフォルト値
    defaultKey?: K;
    defaultValue?: V;
}

/**
 * RecordEntryTemplate - キーと値のInputコンポーネントを結びつける
 * ObjectInputのPropertyTypeに相当する役割
 */
export class RecordEntryTemplate<K extends string | number, V> {
    public readonly keyInputFactory: () => IInputComponent<K>;
    public readonly valueInputFactory: () => IInputComponent<V>;
    private _options?: RecordEntryOptions<K, V>;

    constructor(
        keyInputFactory: (() => IInputComponent<K>) | IInputComponent<K>,
        valueInputFactory: (() => IInputComponent<V>) | IInputComponent<V>
    ) {
        // ファクトリー関数または直接インスタンスを受け取る
        if (typeof keyInputFactory === 'function') {
            this.keyInputFactory = keyInputFactory;
        } else {
            const keyInputCtor = keyInputFactory.constructor as any;
            this.keyInputFactory = () => new keyInputCtor() as IInputComponent<K>;
        }

        if (typeof valueInputFactory === 'function') {
            this.valueInputFactory = valueInputFactory;
        } else {
            const valueInputCtor = valueInputFactory.constructor as any;
            this.valueInputFactory = () => new valueInputCtor() as IInputComponent<V>;
        }
    }

    /**
     * オプション設定（メソッドチェーン）
     */
    public withOptions(options: RecordEntryOptions<K, V>): this {
        this._options = options;
        return this;
    }

    public getOptions(): RecordEntryOptions<K, V> | undefined {
        return this._options;
    }

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }
}
