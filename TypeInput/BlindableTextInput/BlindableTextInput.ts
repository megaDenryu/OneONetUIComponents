import { ButtonC, DivC, HtmlComponentBase, InputC, LV2HtmlComponentBase, SpanC } from "SengenUI/index";
import { eyeIcon, lockIcon } from "../../../OneONetSvg/Icons";
import { ITextInput } from "../Interfaces/IInputComponent";
import {
    blindable_input_container,
    blindable_input_field,
    blindable_input_toggle_button,
    blindable_input_disabled,
    blindable_input_container_width,
    blindable_input_height
} from "./style.css";

export interface BlindableTextInputProps {
    /** 入力フィールドのプレースホルダーテキスト */
    placeholder?: string;
    
    /** 
     * 入力フィールドの幅を指定
     * - "default": 200px
     * - "small": 150px
     * - "medium": 300px
     * - "large": 400px
     * - "full": 100%
     * - string: カスタムCSS値
     */
    width?: "default" | "small" | "medium" | "large" | "full" | string;
    
    /** 
     * 入力フィールドの高さを指定
     * - "small": 28px
     * - "default": 32px
     * - "large": 40px
     * - string: カスタムCSS値
     */
    height?: "small" | "default" | "large" | string;
    
    /** 入力フィールドの初期値 */
    value?: string;
    
    /** 入力可能な最大文字数 */
    maxLength?: number;
    
    /** 入力フィールドを無効化するかどうか */
    disabled?: boolean;
    
    /** 初期状態で隠すかどうか (デフォルト: true) */
    initiallyHidden?: boolean;

    /** 値が変更された時のコールバック関数 */
    onChange?: (value: string) => void;
}

/**
 * BlindableTextInput - 表示/非表示切り替え可能なテキスト入力コンポーネント
 * パスワードやAPIキーなどの入力に適しています。
 */
export class BlindableTextInput extends LV2HtmlComponentBase implements ITextInput {
    private _input: InputC;
    private _toggleButton: ButtonC;
    private _props: BlindableTextInputProps;
    private _isHidden: boolean;

    constructor(props: BlindableTextInputProps = {}) {
        super();
        this._props = props;
        this._isHidden = props.initiallyHidden !== false; // デフォルトは隠す
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        // 幅のクラス決定 logic same as TextInput
        const widthClass = this._props.width && 
                          typeof this._props.width === "string" && 
                          this._props.width in blindable_input_container_width
                          ? blindable_input_container_width[this._props.width as keyof typeof blindable_input_container_width]
                          : blindable_input_container_width.default;
        
        // カスタム幅の場合はインラインスタイルで適用するために保持
        const customWidth = (this._props.width && typeof this._props.width === "string" && !(this._props.width in blindable_input_container_width)) 
                            ? this._props.width 
                            : undefined;

        return new DivC({ class: [blindable_input_container, widthClass] })
            .setStyleCSS(customWidth ? { width: customWidth } : {})
            .childs([
                new InputC({
                    type: this._isHidden ? "password" : "text",
                    placeholder: this._props.placeholder || "",
                    value: this._props.value || "",
                    class: this._getInputClasses(),
                    disabled: this._props.disabled
                }).bind(input => {
                    this._input = input;
                    if (this._props.maxLength) {
                        input.setMaxLength(this._props.maxLength);
                    }
                    input.onInput((e) => {
                        const target = e.target as HTMLInputElement;
                        this._props.onChange?.(target.value);
                    });
                }),
                new ButtonC({
                    class: blindable_input_toggle_button
                }).bind(btn => {
                    this._toggleButton = btn;
                    // SVGアイコンをボタンに追加
                    const iconComponent = this._isHidden ? eyeIcon(18, 'currentColor') : lockIcon(18, 'currentColor');
                    btn.dom.element.appendChild(iconComponent.dom.element);
                    btn.addTypedEventListener("click", (e) => {
                        e.preventDefault();
                        this.toggleVisibility();
                    });
                })
            ]);
    }

    private _getInputClasses(): string[] {
        const classes = [blindable_input_field];
        
        if (this._props.height && 
            typeof this._props.height === "string" && 
            this._props.height in blindable_input_height) {
            classes.push(blindable_input_height[this._props.height as keyof typeof blindable_input_height]);
        }
        
        if (this._props.disabled) {
            classes.push(blindable_input_disabled);
        }
        
        return classes;
    }

    public toggleVisibility(): void {
        this._isHidden = !this._isHidden;
        
        // Inputのtypeを変更
        this._input.setType(this._isHidden ? "password" : "text");
        
        // ボタンのアイコンを変更
        // 隠れている時(password) -> ボタンは「表示」機能(目のアイコン)
        // 表示されている時(text) -> ボタンは「隠す」機能(鍵のアイコン)
        // 前のSVGアイコンを削除
        const buttonElement = this._toggleButton.dom.element as HTMLButtonElement;
        while (buttonElement.firstChild) {
            buttonElement.removeChild(buttonElement.firstChild);
        }
        
        // 新しいSVGアイコンを追加
        const newIconComponent = this._isHidden ? eyeIcon(18, 'currentColor') : lockIcon(18, 'currentColor');
        buttonElement.appendChild(newIconComponent.dom.element);
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
            this._input.addClass(blindable_input_disabled);
            this._toggleButton.setAttribute("disabled", "true");
        } else {
            this._input.removeClass(blindable_input_disabled);
            this._toggleButton.dom.element.removeAttribute("disabled");
        }
        return this;
    }

    public setPlaceholder(placeholder: string): this {
        this._input.setPlaceholder(placeholder);
        return this;
    }
}
