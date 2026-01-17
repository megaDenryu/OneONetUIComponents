import { DivC, HaveHtmlElementProxy, LV2HtmlComponentBase } from "SengenUI/index";



import { NormalButton } from "../../Buttons/NormalButton/NormalButton";
import { closeButton } from "../../Buttons/NormalButton/style.css";
import { NormalText } from "../Text/NormalText";
import { sentence_display_container, sentence_display_header, sentence_display_title, sentence_display_content } from "./style.css";

export interface ISentenceDisplayInput {
    title: string;
    sentence: string;
    width: string|null;
    height: string|null;
}

export class SentenceDisplay extends LV2HtmlComponentBase {
    public readonly title: string;
    protected _componentRoot: DivC;
    private _closeButton: NormalButton;
    private _sentence: string;
    private _sentenceDisplay: NormalText;
    private _width: string|null;
    private _height: string|null;

    public constructor(input: ISentenceDisplayInput) {
        super();
        this.title = input.title;
        this._sentence = input.sentence;
        this._width = input.width;
        this._height = input.height;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): DivC {
        return new DivC({class: sentence_display_container}).childs([
                    new DivC({class: sentence_display_header}).childs([
                        new DivC({class: sentence_display_title, text: this.title}),
                        new NormalButton("閉じる", closeButton)
                            .bind((button) => {this._closeButton = button;})
                            .addOnClickEvent(() => {this.close();})
                    ]),
                    new DivC({class: sentence_display_content}).childs([
                        new NormalText(this._sentence)
                            .bind((text) => {this._sentenceDisplay = text;})
                    ])
                ]).setStyleCSS({
                    width: this._width ?? '400px',
                    height: this._height ?? '300px'
                });
    }

    public delete(): void {
        this.dom.delete();
    }

    public isOpenned(): boolean {
        return this.dom.isShow;
    }

    public open(): SentenceDisplay {
        this.dom.show();
        return this;
    }

    public close(): SentenceDisplay {
        this.dom.hide();
        return this;
    }

    public changeSentence(sentence: string): SentenceDisplay {
        this._sentence = sentence;
        this._sentenceDisplay.changeText(sentence);
        return this;
    }

    public transform(x: number, y: number): SentenceDisplay {
        this._componentRoot.setStyleCSS({
            transform: `translate(${x}px, ${y}px)`
        });
        return this;
    }  
}
