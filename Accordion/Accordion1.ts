import { DivC, DivOptions, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";
import { hidden, visible } from "./style.css";




export enum アコーディオン状態 {
    展開 = "展開",
    折りたたみ = "折りたたみ"
}



export interface アコーディオンSeed {
    options?: DivOptions;
    アコーディオン状態: アコーディオン状態;
    items: HtmlComponentBase[];
}

export class Accordion1 extends LV2HtmlComponentBase {
    protected _componentRoot: DivC;
    private _seed: アコーディオンSeed;

    constructor(seed: アコーディオンSeed) {
        super();
        this._seed = seed;
        this._componentRoot = this.createComponentRoot();
        this.setState(this._seed.アコーディオン状態);
    }

    protected createComponentRoot(): DivC {
        return new DivC().childs(this._seed.items);
    }

    public 展開(): this {
        this._seed.アコーディオン状態 = アコーディオン状態.展開;
        this._componentRoot.addClass(visible);
        this._componentRoot.removeClass(hidden);
        return this;
    }

    public 折りたたむ(): this {
        this._seed.アコーディオン状態 = アコーディオン状態.折りたたみ;
        this._componentRoot.addClass(hidden);
        this._componentRoot.removeClass(visible);
        return this;
    }

    public setState(状態: アコーディオン状態): this {
        if (状態 === アコーディオン状態.展開) {
            this.展開();
        } else if (状態 === アコーディオン状態.折りたたみ) {
            this.折りたたむ();
        }
        else {
            throw new Error("不正なアコーディオン状態です");
        }
        return this;
    }

    public toggle(): this {
        if (this._seed.アコーディオン状態 === アコーディオン状態.展開) {
            this.折りたたむ();
        } else {
            this.展開();
        }
        return this;
    }

    public addItems(items: Iterable<HtmlComponentBase>): this {
        this._componentRoot.childs(items);
        this._seed.items.push(...items);
        return this;
    }





}
