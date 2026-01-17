import { DivC, HtmlComponentBase, LV2HtmlComponentBase, SpanC } from "SengenUI/index";





/**
 * ObjectInputStateDisplayのオプション
 */
export interface ObjectInputStateDisplayOptions {
    /**
     * 表示ラベル（例: "現在の値:"）
     */
    label?: string;
    
    /**
     * 初期値
     */
    initialValue?: any;
    
    /**
     * JSON表示のインデント（デフォルト: 2）
     */
    jsonIndent?: number;
    
    /**
     * 最大表示行数（デフォルト: 制限なし）
     */
    maxLines?: number;
}

/**
 * ObjectInputStateDisplay - オブジェクト型の入力状態をリアルタイム表示
 * 
 * InputStateDisplayのオブジェクト版。
 * JSONフォーマットで整形して表示し、入力値の変化をリアルタイムで確認できる。
 * 
 * 【使用例】
 * ```typescript
 * const display = new ObjectInputStateDisplay({ label: "現在の値:" });
 * 
 * const personInput = new ObjectInput<Person>({
 *     fields: [...],
 *     onChange: (value) => {
 *         display.updateValue(value);
 *     }
 * });
 * ```
 */
export class ObjectInputStateDisplay extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private _options: Required<ObjectInputStateDisplayOptions>;
    private _valueDisplay: DivC;
    private _currentValue: any = null;

    public constructor(options: ObjectInputStateDisplayOptions = {}) {
        super();
        this._options = {
            label: options.label ?? "現在の値:",
            initialValue: options.initialValue ?? null,
            jsonIndent: options.jsonIndent ?? 2,
            maxLines: options.maxLines ?? 20
        };
        this._componentRoot = this.createComponentRoot();
        
        if (this._options.initialValue !== null) {
            this.updateValue(this._options.initialValue);
        }
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6",
                    marginTop: "12px",
                    fontFamily: "monospace",
                    fontSize: "13px"
                }).childs([
                    new SpanC({ text: this._options.label }).setStyleCSS({
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                        color: "#495057",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontSize: "14px"
                    }),
                    new DivC().setStyleCSS({
                        backgroundColor: "#ffffff",
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #e9ecef",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        overflowY: "auto",
                        maxHeight: `${this._options.maxLines * 20}px`,
                        color: "#212529"
                    }).bind((div) => {
                        this._valueDisplay = div;
                        this.renderValue(this._options.initialValue);
                    })
                ]);
    }

    /**
     * 値を更新して表示を更新
     */
    public updateValue(value: any): void {
        this._currentValue = value;
        this.renderValue(value);
    }

    /**
     * 値を表示（JSONフォーマット）
     */
    private renderValue(value: any): void {
        if (value === null || value === undefined) {
            this._valueDisplay.dom.element.textContent = "null";
            this._valueDisplay.setStyleCSS({ color: "#6c757d", fontStyle: "italic" });
            return;
        }

        try {
            const jsonString = JSON.stringify(value, null, this._options.jsonIndent);
            this._valueDisplay.dom.element.textContent = jsonString;
            this._valueDisplay.setStyleCSS({ color: "#212529", fontStyle: "normal" });
        } catch (error) {
            this._valueDisplay.dom.element.textContent = `Error: ${error}`;
            this._valueDisplay.setStyleCSS({ color: "#dc3545", fontStyle: "italic" });
        }
    }

    /**
     * 現在の値を取得
     */
    public getValue(): any {
        return this._currentValue;
    }

    /**
     * 表示をクリア
     */
    public clear(): void {
        this.updateValue(null);
    }
}

