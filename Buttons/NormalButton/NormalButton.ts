import { ButtonC, HaveHtmlElementProxy, HtmlComponentBase, HtmlElementProxy, LV2HtmlComponentBase } from "SengenUI/index";

import { ReactiveProperty } from "../../../BaseClasses/EventDrivenCode/observer";
import { IButton } from "../IButton";
import { VanillaExtractClassName } from "TypeScriptBenriKakuchou/VanilaExtractExtend.ts/VanillaExtractClassName";








export class NormalButton extends LV2HtmlComponentBase implements HaveHtmlElementProxy, IButton {
    private _title: string;
    private _view: ReactiveProperty<VanillaExtractClassName>;
    private _onClick: (() => void)[] = [];
    
    constructor(title: string, defaultView: VanillaExtractClassName) {
        super();
        this._title = title;
        this._view = new ReactiveProperty(defaultView);
        this._componentRoot = this.createComponentRoot();
        this.initialize();
        return this;
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new ButtonC({text: this._title}).addTypedEventListener("click", () => {this.onClick();});
    }

    protected createDomProxy(): HtmlElementProxy {
        return this._componentRoot.dom;
    }

    public onClick():void {
        this._onClick.forEach(f => {
            f();
        });
    }

    private initialize() {
        this._view.addMethod((newView) => {
            this.dom.setCSSClass(newView); //cssクラスの何を削除するか指定するのを考えると一般化は不可能に見えたのでここでは対応しない
        });
        this._view.set(this._view.get());
    }

    //cssクラスを完全に上書きする。ボタンの状態はボタンを持つクラスで管理する。
    public setView(view: VanillaExtractClassName): NormalButton {
        this._view.set(view);
        return this;
    }

    public setText(text: string): NormalButton {
        this._title = text;
        this.dom.element.textContent = this._title;
        return this;
    }

    public addOnClickEvent(f: (() => void)): NormalButton {
        this._onClick.push(f);
        return this;
    }

    public delete(): void {
        this.dom.delete();
    }
}
