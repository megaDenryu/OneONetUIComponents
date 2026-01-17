import { DivC, HaveHtmlElementProxy, LV2HtmlComponentBase } from "SengenUI/index";



import { normal_text } from "./style.css";


export class NormalText extends LV2HtmlComponentBase implements HaveHtmlElementProxy {
    private _text: string;
    protected _componentRoot: DivC;

    public constructor(text: string) {
        super();
        this._text = text;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): DivC {
        return new DivC({class: normal_text, text:this._text});
    }

    public delete(): void {
        this.dom.delete();
    }

    changeText(text: string): void {
        this._text = text;
        this._componentRoot.setTextContent(text);
    }

    
}
