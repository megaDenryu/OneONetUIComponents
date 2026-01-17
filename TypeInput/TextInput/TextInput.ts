import { DivC, HaveHtmlElementProxy, HtmlComponentBase, HtmlElementProxy, InputC, LV2HtmlComponentBase } from "SengenUI/index";





import { ITextInput } from "../Interfaces/IInputComponent";
import { text_input_container, text_input_field, text_input_disabled, text_input_container_width, text_input_height } from "./style.css";

export interface TextInputProps {
    /** 入力フィールドのプレースホルダーテキスト */
    placeholder?: string;
    
    /** 
     * 入力フィールドの幅を指定
     * - "default": 標準幅（通常の入力用）
     * - "small": 小さい幅（短いテキスト用）
     * - "medium": 中程度の幅（中程度のテキスト用）
     * - "large": 大きい幅（長いテキスト用）
     * - string: カスタムCSS値（例: "300px", "50%", "20rem"など）
     * 
     * 注意: stringで指定した場合、定義済みのCSS幅クラスは適用されず、
     * インラインスタイルやカスタムクラスでの制御が必要
     */
    width?: "default" | "small" | "medium" | "large" | string;
    
    /** 
     * 入力フィールドの高さを指定
     * - "small": 小さい高さ（コンパクトなレイアウト用）
     * - "default": 標準高さ（通常の入力用）
     * - "large": 大きい高さ（視認性を重視する場合）
     * - string: カスタムCSS値（例: "40px", "3rem"など）
     * 
     * 注意: stringで指定した場合、定義済みのCSS高さクラスは適用されず、
     * インラインスタイルやカスタムクラスでの制御が必要
     */
    height?: "small" | "default" | "large" | string;
    
    /** 入力フィールドの初期値 */
    value?: string;
    
    /** 入力可能な最大文字数 */
    maxLength?: number;
    
    /** 入力フィールドを無効化するかどうか */
    disabled?: boolean;
    
    /** 値が変更された時のコールバック関数 */
    onChange?: (value: string) => void;
}

/**
 * TextInput - テキスト入力コンポーネント
 * 
 * 【公開API】
 * - getValue(): string - 現在の値を取得
 * - setValue(value: string): this - 値を設定
 * - onChange(callback): this - 変更コールバックを登録
 * - focus(): this - フォーカスを設定
 * - blur(): this - フォーカスを解除
 * - setDisabled(disabled: boolean): this - 無効状態を設定
 * - clear(): this - 値をクリア
 * - setPlaceholder(placeholder: string): this - プレースホルダーを設定
 * 
 * 【使用例】
 * ```typescript
 * // 定義済みサイズを使用
 * const input1 = new TextInput({
 *     width: "large",        // vanilla extractの定義済みクラスを使用
 *     height: "small",       // vanilla extractの定義済みクラスを使用
 *     placeholder: "名前を入力"
 * });
 * 
 * // カスタムサイズを使用（外部でのスタイル制御が必要）
 * const input2 = new TextInput({
 *     width: "300px",        // カスタム値：外部でsetStyleCSS()等で制御
 *     height: "2.5rem",      // カスタム値：外部でsetStyleCSS()等で制御
 *     placeholder: "カスタムサイズ"
 * }).setStyleCSS({
 *     width: "300px",        // カスタム幅を実際に適用
 *     height: "2.5rem"       // カスタム高さを実際に適用
 * });
 * ```
 */
export class TextInput extends LV2HtmlComponentBase implements ITextInput {
    private _input: InputC;
    private _props: TextInputProps;

    constructor(props: TextInputProps = {}) {
        super();
        this._props = props;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        // 幅のクラスを決定
        // 1. this._props.widthが存在する
        // 2. かつ、それがstring型である
        // 3. かつ、text_input_container_widthオブジェクトにそのキーが存在する
        // この3つの条件を満たす場合（つまり"default"|"small"|"medium"|"large"のいずれか）は
        // 対応するvanilla extractクラスを使用。
        // そうでない場合（undefinedまたはカスタム文字列）はdefaultクラスを使用
        const widthClass = this._props.width && 
                          typeof this._props.width === "string" && 
                          this._props.width in text_input_container_width
                          ? text_input_container_width[this._props.width as keyof typeof text_input_container_width]
                          : text_input_container_width.default;

        return new DivC({ class: [text_input_container, widthClass] })
            .child(
                new InputC({
                    type: "text",
                    placeholder: this._props.placeholder || "",
                    value: this._props.value || "",
                    class: this._getInputClasses(),
                    disabled: this._props.disabled
                }).bind(input => {
                    this._input = input;
                    
                    if (this._props.maxLength) {
                        (input.dom.element as HTMLInputElement).maxLength = this._props.maxLength;
                    }

                    // イベントリスナーの設定
                    input.onInput((e) => {
                        const target = e.target as HTMLInputElement;
                        this._props.onChange?.(target.value);
                    });
                })
            );
    }

    private _getInputClasses(): string[] {
        const classes = [text_input_field];
        
        // 高さクラスの追加
        // widthと同様に、heightが定義済みの値（"small"|"default"|"large"）の場合のみ
        // 対応するvanilla extractクラスを追加。
        // カスタム文字列（例："40px"）が指定された場合はここでは何もせず、
        // 外部でsetStyleCSS()などを使って制御する想定
        if (this._props.height && 
            typeof this._props.height === "string" && 
            this._props.height in text_input_height) {
            classes.push(text_input_height[this._props.height as keyof typeof text_input_height]);
        }
        
        // 無効状態クラスの追加
        if (this._props.disabled) {
            classes.push(text_input_disabled);
        }
        
        return classes;
    }
    
    // ========================================
    // 公開API (ITextInputインターフェース実装)
    // ========================================
    
    public getValue(): string {
        return this._input.getValue();
    }

    public setValue(value: string): this {
        this._input.setValue(value);
        return this;
    }

    public onChange(callback: (value: string) => void): this {
        this._props.onChange = callback;
        return this;
    }

    public focus(): void {
        this._input.focus();
    }

    public blur(): void {
        (this._input.dom.element as HTMLInputElement).blur();
    }

    public setDisabled(disabled: boolean): this {
        this._input.setDisabled(disabled);
        if (disabled) {
            this._input.addClass(text_input_disabled);
        } else {
            this._input.removeClass(text_input_disabled);
        }
        return this;
    }

    // ========================================
    // 追加の便利メソッド
    // ========================================
    
    public setPlaceholder(placeholder: string): this {
        this._input.setPlaceholder(placeholder);
        return this;
    }

    public clear(): this {
        this._input.setValue("");
        return this;
    }

    /** @deprecated onChange()を使用してください */
    public addOnChangeEvent(callback: (value: string) => void): this {
        return this.onChange(callback);
    }
}

