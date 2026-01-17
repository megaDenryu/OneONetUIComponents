import { DirectoryInputC, DivC, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";



import { NormalButton } from "../NormalButton/NormalButton";

import { directory_select_container, disabled_button, enabled_button } from "./style.css";

export interface DirectorySelectButtonProps {
    buttonText?: string;
    acceptMultiple?: boolean; // 複数フォルダー選択（実験的機能）
    onDirectorySelected?: (directoryPath: string) => void;
    onDirectorySelectedWithFiles?: (details: { directoryPath: string; files: File[] }) => void;
    width?: string;
}

/**
 * フォルダー選択ボタンコンポーネント
 * DirectoryInputCをラップし、ボタンクリックでフォルダー選択ダイアログを開く
 * 
 * 使用例:
 * ```typescript
 * const dirButton = new DirectorySelectButton({
 *     buttonText: "フォルダーを選択",
 *     onDirectorySelected: (path) => {
 *         console.log("選択されたフォルダー:", path);
 *     }
 * });
 * ```
 */
export class DirectorySelectButton extends LV2HtmlComponentBase {
    private _props: DirectorySelectButtonProps;
    private _button: NormalButton;
    private _directoryInput: DirectoryInputC;
    private _container: DivC;

    constructor(props: DirectorySelectButtonProps = {}) {
        super();
        this._props = props;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({ class: directory_select_container })
            .bind(container => { this._container = container; })
            .childs([
                this.DirectoryInput(),
                this.Button()
            ]);
    }

    private DirectoryInput(): DirectoryInputC {
        const input = new DirectoryInputC({
            multiple: this._props.acceptMultiple
        })
            .bind(input => { this._directoryInput = input; })
            .setStyleCSS({ display: 'none' });

        // フォルダーパスのみを取得する場合
        if (this._props.onDirectorySelected) {
            input.onDirectoryPathSelected((directoryPath) => {
                this._props.onDirectorySelected?.(directoryPath);
            });
        }

        // フォルダーパスとファイルリストの両方を取得する場合
        if (this._props.onDirectorySelectedWithFiles) {
            input.onDirectorySelectedWithDetails((details) => {
                this._props.onDirectorySelectedWithFiles?.(details);
            });
        }

        return input;
    }

    private Button(): NormalButton {
        return new NormalButton(
            this._props.buttonText || "フォルダーを選択",
            "directory-select-button"
        )
            .bind(button => { this._button = button; })
            .addOnClickEvent(() => {
                this._directoryInput.click();
            });
    }

    public setButtonText(text: string): DirectorySelectButton {
        this._button.setText(text);
        return this;
    }

    public setDisabled(disabled: boolean): DirectorySelectButton {
        this._directoryInput.setDisabled(disabled);
        if (disabled) {
            this._button.addClass(disabled_button);
            this._button.removeClass(enabled_button);
        } else {
            this._button.addClass(enabled_button);
            this._button.removeClass(disabled_button);
        }
        return this;
    }

    public openDirectoryDialog(): void {
        this._directoryInput.click();
    }

    public addOnDirectorySelectedEvent(callback: (directoryPath: string) => void): DirectorySelectButton {
        this._props.onDirectorySelected = callback;
        return this;
    }

    public addOnDirectorySelectedWithFilesEvent(
        callback: (details: { directoryPath: string; files: File[] }) => void
    ): DirectorySelectButton {
        this._props.onDirectorySelectedWithFiles = callback;
        return this;
    }
}

