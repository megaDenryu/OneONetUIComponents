import { DivC, FileInputC, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";



import { NormalButton } from "../NormalButton/NormalButton";

import { file_select_container, disabled_button, enabled_button } from "./style.css";

export interface FileSelectButtonProps {
    buttonText?: string;
    fileFilter?: string; // ".exe", ".txt", etc.
    acceptMultiple?: boolean;
    onFileSelected?: (filePath: string) => void;
    onFilesSelected?: (filePaths: string[]) => void;
    width?: string;
}

export class FileSelectButton extends LV2HtmlComponentBase {
    private _props: FileSelectButtonProps;
    private _button: NormalButton;
    private _fileInput: FileInputC;
    private _container: DivC;

    constructor(props: FileSelectButtonProps = {}) {
        super();
        this._props = props;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({ class: file_select_container })
            .bind(container => { this._container = container; })
            .childs([
                this.FileInput(),
                this.Button()
            ]);
    }

    private FileInput(): FileInputC {
        const input = new FileInputC({
            accept: this._props.fileFilter,
            multiple: this._props.acceptMultiple
        })
            .bind(input => { this._fileInput = input; })
            .setStyleCSS({ display: 'none' });

        // 単一/複数ファイル選択に応じて型安全なメソッドを使用
        if (this._props.acceptMultiple) {
            input.onFilePathsSelected((filePaths) => {
                this._props.onFilesSelected?.(filePaths);
            });
        } else {
            input.onFilePathSelected((filePath) => {
                this._props.onFileSelected?.(filePath);
            });
        }

        return input;
    }

    private Button(): NormalButton {
        return new NormalButton(
            this._props.buttonText || "ファイルを選択",
            "file-select-button"
        )
            .bind(button => { this._button = button; })
            .addOnClickEvent(() => {
                this._fileInput.click();
            });
    }

    public setButtonText(text: string): FileSelectButton {
        this._button.setText(text);
        return this;
    }

    public setFileFilter(filter: string): FileSelectButton {
        this._fileInput.setAccept(filter);
        return this;
    }

    public setDisabled(disabled: boolean): FileSelectButton {
        this._fileInput.setDisabled(disabled);
        if (disabled) {
            this._button.addClass(disabled_button);
            this._button.removeClass(enabled_button);
        } else {
            this._button.addClass(enabled_button);
            this._button.removeClass(disabled_button);
        }
        return this;
    }

    public openFileDialog(): void {
        this._fileInput.click();
    }

    public addOnFileSelectedEvent(callback: (filePath: string) => void): FileSelectButton {
        this._props.onFileSelected = callback;
        return this;
    }

    public addOnFilesSelectedEvent(callback: (filePaths: string[]) => void): FileSelectButton {
        this._props.onFilesSelected = callback;
        return this;
    }
}


