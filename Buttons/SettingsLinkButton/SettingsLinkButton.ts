import { HaveHtmlElementProxy, HtmlElementProxy, LV2HtmlComponentBase, SpanC } from "SengenUI/index";


import { NormalButton } from "../NormalButton/NormalButton";

import { TTSSoftware } from "../../../ValueObject/Character";
import { SettingsRouter } from "../../../AppPage/Settings/SettingsRouter";
import { settings_link_button, settings_link_button_secondary, settings_link_button_warning, settings_link_button_danger, settings_link_icon } from "./style.css";

export interface SettingsLinkButtonProps {
    targetTTS: TTSSoftware;
    buttonText?: string;
    buttonType?: "primary" | "secondary" | "warning" | "danger";
    showIcon?: boolean;
    iconText?: string;
    disabled?: boolean;
    onBeforeOpen?: () => void;
    onAfterOpen?: () => void;
}

export class SettingsLinkButton extends LV2HtmlComponentBase implements HaveHtmlElementProxy {
    private _props: SettingsLinkButtonProps;
    private _button: NormalButton;

    constructor(props: SettingsLinkButtonProps) {
        super();
        this._props = props;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot() {
        const buttonText = this._props.buttonText || `${this._getTTSDisplayName()}を設定`;
        
        this._button = new NormalButton(buttonText, `settings-link-${this._props.targetTTS}`)
            .bind(button => {
                // ボタンタイプに応じたCSSクラスを適用
                const styleClass = this._getStyleClass();
                button.addClass(styleClass);
                
                // アイコンがある場合は追加
                if (this._props.showIcon) {
                    const icon = new SpanC({ text: settings_link_icon })
                        .bind(span => {
                            span.setTextContent(this._props.iconText || "⚙️");
                        });
                    button.child(icon);
                }
                
                // クリックイベントを設定
                button.addOnClickEvent(() => this._openSettings());
                
                // 無効状態の設定
                if (this._props.disabled) {
                    (button.dom.element as HTMLButtonElement).disabled = true;
                }
            });

        return this._button;
    }

    private _getStyleClass(): string {
        switch (this._props.buttonType) {
            case "secondary": return settings_link_button_secondary;
            case "warning": return settings_link_button_warning;
            case "danger": return settings_link_button_danger;
            default: return settings_link_button;
        }
    }

    private _getTTSDisplayName(): string {
        switch (this._props.targetTTS) {
            case "VoiceVox": return "VoiceVox";
            case "Coeiroink": return "Coeiroink";
            case "AIVoice": return "A.I.VOICE";
            case "CevioAI": return "CeVIO AI";
            default: return this._props.targetTTS;
        }
    }

    private _openSettings(): void {
        // 開く前のコールバック
        if (this._props.onBeforeOpen) {
            this._props.onBeforeOpen();
        }

        // 設定画面を開く
        const settingsRouter = SettingsRouter.getInstance();
        settingsRouter.openTTSPathSettings(this._props.targetTTS);

        // 開いた後のコールバック
        if (this._props.onAfterOpen) {
            this._props.onAfterOpen();
        }
    }

    public setDisabled(disabled: boolean): void {
        (this._button.dom.element as HTMLButtonElement).disabled = disabled;
    }

    public updateButtonText(newText: string): void {
        this._button.setText(newText);
    }

    public updateTargetTTS(newTTS: TTSSoftware): void {
        this._props.targetTTS = newTTS;
        if (!this._props.buttonText) {
            this.updateButtonText(`${this._getTTSDisplayName()}を設定`);
        }
    }
}

