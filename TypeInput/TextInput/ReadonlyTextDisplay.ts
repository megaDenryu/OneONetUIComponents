import { DivC, HtmlComponentBase, LV2HtmlComponentBase, Px長さ, SpanC } from "SengenUI/index";




import { IInputComponent } from "../Interfaces/IInputComponent";
import { readonly_text_display, readonly_text_display_width } from "./style.css";


/**
 * 読み取り専用テキスト表示コンポーネント
 * IInputComponent<string>を実装し、RecordInputのキー表示などに使用できる
 */
export interface ReadonlyTextDisplayOptions {
    text?: string;
    width?: Px長さ | "small" | "default" | "medium" | "large" | "auto";
}

export class ReadonlyTextDisplay extends LV2HtmlComponentBase implements IInputComponent<string> {
    protected _componentRoot: HtmlComponentBase;
    private _textElement: SpanC;
    private _currentValue: string = "";
    private _changeCallbacks: ((value: string) => void)[] = [];
    private _width: Px長さ | "small" | "default" | "medium" | "large" | "auto";
    private _containerDiv: DivC;

    constructor(options: ReadonlyTextDisplayOptions = {}) {
        super();
        this._currentValue = options.text || "";
        this._width = options.width ?? "auto";
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const container = new DivC({ class: readonly_text_display }).childs([
                                new SpanC({ text: this._currentValue }).bind((span) => { this._textElement = span; })
                            ])
                            .bind((div) => { this._containerDiv = div; });
        
        // 幅の設定
        if (this._width instanceof Px長さ) {
            // Px長さ型の場合はそのtoCssValue()を使用
            container.setStyleCSS({ width: this._width.toCssValue() });
        } else if (this._width !== "auto") {
            // プリセット名の場合はCSSクラスを適用
            container.addClass(readonly_text_display_width[this._width]);
        }
        // "auto"の場合は何もしない（デフォルトで幅自動）
        
        return container;
    }

    public getValue(): string {
        return this._currentValue;
    }

    public setValue(value: string): this {
        this._currentValue = value;
        this._textElement.dom.element.textContent = value;
        return this;
    }

    public onChange(callback: (value: string) => void): this {
        this._changeCallbacks.push(callback);
        return this;
    }

    public bind(func: (component: this) => void): this {
        func(this);
        return this;
    }

    public setPlaceholder(placeholder: string): this {
        // 読み取り専用なのでプレースホルダーは使用しないが、インターフェース実装のため定義
        return this;
    }

    public setDisabled(disabled: boolean): this {
        // 読み取り専用なので無効化も特に意味はないが、インターフェース実装のため定義
        return this;
    }

    public setReadonly(readonly: boolean): this {
        // 常に読み取り専用
        return this;
    }
}

