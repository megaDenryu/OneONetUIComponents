import { ButtonC, ButtonOptions, LV2HtmlComponentBase } from "SengenUI/index";



export interface ISelectableButtonSeed {
    stateTrue: ButtonOptions
    stateFalse: ButtonOptions
    TrueToFalse?: () => void;
    FalseToTrue?: () => void;
}


/**
 * 選択可能なボタンコンポーネント。いわゆるTrueとFalseのトグルボタンです。
 * コードでボタンの状態を切り替えるときは、見た目とイベント発火の関数は独立で責任をもって呼び出すことで、まとめて呼び出すバグを防止する狙いがあります。
 */
export interface ISelectableButton {
    get isSelected(): boolean;
    setSeed(seed: ISelectableButtonSeed): void;
    select(isSelected: boolean): this;              //見た目のみ変更する
    invokeByStartState(startState: boolean): this;  // イベントを発火させる
    invokeByEndState(endState: boolean): this;      // イベントを発火させる
    toggle(): this;
}


export class SelectableButton extends LV2HtmlComponentBase implements ISelectableButton {
    private _seed: ISelectableButtonSeed|null;
    private _isSelected: boolean = false;
    protected _componentRoot: ButtonC;
    public get isSelected(): boolean { return this._isSelected; }

    constructor(seed:ISelectableButtonSeed|null){
        super();
        this._seed = seed;
        this._componentRoot = this.createComponentRoot();
        this.select(false); // 初期状態はfalse
    }

    public setSeed(seed: ISelectableButtonSeed): void {
        this._seed = seed;
    }

    protected createComponentRoot(): ButtonC {
        return new ButtonC().addTypedEventListener("click", (event) => {
            event.stopPropagation(); // イベントの伝搬を停止
            this.toggle();
        });
    }

    protected createDomProxy() {
        return this._componentRoot.dom;
    }

    private setSelectedTrue(): void {
        this._isSelected = true;
        this._componentRoot.removeClass(this._seed?.stateFalse?.class || []);
        this._componentRoot.addClass(this._seed?.stateTrue?.class || []);
        this._componentRoot.setTextContent(this._seed?.stateTrue?.text || "");
    }

    private invokeTrueToFalse(): void {
        this._seed?.TrueToFalse?.();
    }

    public setSelectedFalse(): void {
        this._isSelected = false;
        this._componentRoot.removeClass(this._seed?.stateTrue?.class || []);
        this._componentRoot.addClass(this._seed?.stateFalse?.class || []);
        this._componentRoot.setTextContent(this._seed?.stateFalse?.text || "");
    }

    private invokeFalseToTrue(): void {
        this._seed?.FalseToTrue?.();
    }

    //見た目のみ変更する
    public select(isSelected: boolean): this {
        if (isSelected) {
            this.setSelectedTrue();
        } else {
            this.setSelectedFalse();
        }
        return this;
    }

    // イベントを発火させる
    public invokeByStartState(startState: boolean): this {
        if (startState) {
            this.invokeTrueToFalse();
        } else {
            this.invokeFalseToTrue();
        }
        return this;
    }

    // イベントを発火させる
    public invokeByEndState(endState: boolean): this {
        if (endState) {
            this.invokeFalseToTrue();
        } else {
            this.invokeTrueToFalse();
        }
        return this;
    }

    public toggle(): this {
        const startState = this._isSelected;
        this._isSelected = !this._isSelected;
        this.invokeByStartState(startState);
        this.select(this._isSelected);
        return this;
    }





}
