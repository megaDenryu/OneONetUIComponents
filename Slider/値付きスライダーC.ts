import { DivC, InputC, LV2HtmlComponentBase } from "SengenUI/index";



import { 値付きスライダー, 値付きスライダー__input, 値付きスライダー__value } from "./style.css";

export class 値付きスライダーC extends LV2HtmlComponentBase {
    private _value: number;
    private _min: number;
    private _max: number;
    private _step: number;
    private _slider: InputC;
    private _valueDisplay: DivC;
    private _onValueChangedFunc: ((value: number) => void)[] = [];

    constructor(seed:スライダseed) {
        super();
        this._value = seed.init_value;
        this._min = seed.min;
        this._max = seed.max;
        this._step = seed.step;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): DivC {
        return new DivC({ class: 値付きスライダー }).childs([
                    new InputC({class: 値付きスライダー__input, type: 'range',}).bind((self)=>{this._slider = self;}).addInputEventListener('input', (event) => {this.onValueChanged(event);}).setRangeParam({
                        min: this._min,
                        max: this._max,
                        step: this._step
                    }).setValue(String(this._value)),
                    new DivC({  class: 値付きスライダー__value, text: String(this._value) }).bind((self)=>{this._valueDisplay = self;})
                ]);
    }

    private setValue(value: number): this {
        this._value = value;
        if (this._slider) {
            this._slider.setValue(String(value));
        }
        if (this._valueDisplay) {
            this._valueDisplay.setTextContent(String(value));
        }
        return this;
    }

    private onValueChanged(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.setValue(parseFloat(value));
        for (const func of this._onValueChangedFunc) {
            func(this._value);
        }
    }

    public addOnValueChangedListener(func: (value: number) => void): this {
        this._onValueChangedFunc.push(func);
        return this;
    }
}

export interface スライダseed {
    init_value: number;
    min: number;
    max: number;
    step: number;
}
