import { DivC, HtmlComponentBase, LV2HtmlComponentBase, SpanC, TextAreaC } from "SengenUI/index";





import { IInputComponent, ITextInput } from "../Interfaces/IInputComponent";

export interface MultilineTextInputProps {
    placeholder?: string; 
    rows?: number; 
    value?: string; 
    onChange?: (value: string) => void;
    label?: string;
    minHeight?: number;
    maxHeight?: number;
}

/**
 * MultilineTextInput - 複数行テキスト入力コンポーネント（自動リサイズ機能付き）
 * 
 * 古いMultiStringInputComponentの使い心地を再現したLV2コンポーネント
 * 
 * 【主要機能】
 * - テキスト入力に応じた自動高さ調整
 * - minHeight/maxHeightによる高さ制限
 * - ホバー・フォーカス時の視覚フィードバック
 * - スムーズなトランジション効果
 * 
 * 【公開API】
 * - getValue(): string - 現在の値を取得
 * - setValue(value: string): this - 値を設定
 * - onChange(callback): this - 変更コールバックを登録
 * - focus(): this - フォーカスを設定
 * - setDisabled(disabled: boolean): this - 無効状態を設定
 * - clear(): this - 値をクリア
 */
export class MultilineTextInput extends LV2HtmlComponentBase implements ITextInput {
    private _textArea: TextAreaC;
    private _containerDiv: DivC;
    private _labelSpan: SpanC;
    private _props: MultilineTextInputProps;
    private _changeCallback?: (value: string) => void;

    constructor(props: MultilineTextInputProps = {}) {
        super();
        this._props = props;
        this._changeCallback = props.onChange;
        this._componentRoot = this.createComponentRoot();
        
        // 初期化後に高さを調整
        requestAnimationFrame(() => {
            this.adjustTextareaHeight();
        });
    }

    protected createComponentRoot(): HtmlComponentBase {
        this._containerDiv = new DivC().setStyleCSS({
            display: "flex",
            flexDirection: "column"
        });

        // ラベルがある場合は追加
        if (this._props.label) {
            this._labelSpan = new SpanC({ text: this._props.label }).setStyleCSS({
                marginBottom: "4px",
                fontSize: "0.9em",
                color: "#333",
                fontWeight: "500"
            });
            this._containerDiv.child(this._labelSpan);
        }

        // TextArea本体の作成
        this._textArea = new TextAreaC({
            placeholder: this._props.placeholder,
            rows: this._props.rows || 1,
            value: this._props.value
        }).setStyleCSS({
            resize: "none",
            overflowY: "hidden",
            boxSizing: "border-box",
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "inherit",
            fontSize: "1em",
            lineHeight: "1.5",
            backgroundColor: "#d8d8d8",
            minHeight: `${this._props.minHeight || 40}px`,
            maxHeight: this._props.maxHeight ? `${this._props.maxHeight}px` : "200px",
            transition: "background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease"
        })
        .addTypedEventListener("input", (event) => {
            const value = this._textArea.getValue();
            if (this._changeCallback) {
                this._changeCallback(value);
            }
            this.adjustTextareaHeight();
        })
        .addTypedEventListener("focus", () => {
            this._textArea.setStyleCSS({
                outline: "none",
                borderColor: "#007bff",
                boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
                backgroundColor: "#fffefe"
            });
        })
        .addTypedEventListener("blur", () => {
            this._textArea.setStyleCSS({
                borderColor: "#ccc",
                boxShadow: "none",
                backgroundColor: "#d8d8d8"
            });
        })
        .addTypedEventListener("mouseover", () => {
            if (this._textArea.dom.element !== document.activeElement) {
                this._textArea.setStyleCSS({
                    backgroundColor: "#f0f0f0"
                });
            }
        })
        .addTypedEventListener("mouseout", () => {
            if (this._textArea.dom.element !== document.activeElement) {
                this._textArea.setStyleCSS({
                    backgroundColor: "#d8d8d8"
                });
            }
        });

        this._containerDiv.child(this._textArea);
        return this._containerDiv;
    }

    /**
     * TextAreaの高さを内容に応じて自動調整する
     * 古いMultiStringInputComponentと同じアルゴリズムを使用
     */
    private adjustTextareaHeight(): void {
        const textAreaElement = this._textArea.dom.element as HTMLTextAreaElement;
        if (!textAreaElement) return;

        // 一旦高さを自動に戻す
        textAreaElement.style.height = 'auto';
        const scrollHeight = textAreaElement.scrollHeight;

        // min-height / max-height の考慮
        const computedStyle = getComputedStyle(textAreaElement);
        const minHeight = parseFloat(computedStyle.minHeight) || (this._props.minHeight || 40);
        const maxHeight = parseFloat(computedStyle.maxHeight) || (this._props.maxHeight || 200);

        let newHeight = Math.max(minHeight, scrollHeight);
        newHeight = Math.min(maxHeight, newHeight);
        
        textAreaElement.style.height = `${newHeight}px`;

        if (newHeight >= maxHeight && maxHeight !== Infinity) {
            textAreaElement.style.overflowY = 'auto';
        } else {
            textAreaElement.style.overflowY = 'hidden';
        }
    }

    // ========================================
    // 公開API (IInputComponentインターフェース実装)
    // ========================================

    public getValue(): string {
        return this._textArea.getValue();
    }

    public setValue(value: string): this {
        this._textArea.setValue(value);
        // 値設定後にも高さを調整
        requestAnimationFrame(() => {
            this.adjustTextareaHeight();
        });
        return this;
    }

    public onChange(callback: (value: string) => void): this {
        this._changeCallback = callback;
        return this;
    }

    // ========================================
    // 追加の便利メソッド
    // ========================================
    
    public setDisabled(disabled: boolean): this {
        this._textArea.setDisabled(disabled);
        return this;
    }

    public clear(): this {
        this._textArea.setValue("");
        this.adjustTextareaHeight();
        return this;
    }

    public focus(): void {
        (this._textArea.dom.element as HTMLTextAreaElement).focus();
    }

    public blur(): void {
        (this._textArea.dom.element as HTMLTextAreaElement).blur();
    }

    public setLabel(label: string): this {
        if (this._labelSpan) {
            this._labelSpan.dom.element.textContent = label;
        } else if (label) {
            // ラベルが存在しない場合は新規作成
            this._labelSpan = new SpanC({ text: label }).setStyleCSS({
                marginBottom: "4px",
                fontSize: "0.9em",
                color: "#333",
                fontWeight: "500"
            });
            this._containerDiv.dom.element.insertBefore(this._labelSpan.dom.element, this._textArea.dom.element);
        }
        this._props.label = label;
        return this;
    }

    public setPlaceholder(placeholder: string): this {
        this._textArea.setPlaceholder(placeholder);
        this._props.placeholder = placeholder;
        return this;
    }

    public setMinHeight(minHeight: number): this {
        this._props.minHeight = minHeight;
        this._textArea.setStyleCSS({
            minHeight: `${minHeight}px`
        });
        this.adjustTextareaHeight();
        return this;
    }

    public setMaxHeight(maxHeight: number): this {
        this._props.maxHeight = maxHeight;
        this._textArea.setStyleCSS({
            maxHeight: `${maxHeight}px`
        });
        this.adjustTextareaHeight();
        return this;
    }
}
