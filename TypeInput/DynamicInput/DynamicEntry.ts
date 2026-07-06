import { DivC, HtmlComponentBase, InputC, SelectC } from "SengenUI/index";
import { IInputComponent } from "../Interfaces/IInputComponent";
import { DynamicValue, TypeOption } from "./DynamicTypes";

import {
    dynamic_entry_key,
    dynamic_type_selector,
} from "./style.css";

/**
 * DynamicEntry - 1つのキー・値ペアを表現する内部クラス
 */
export class DynamicEntry {
    public readonly id: number;
    public keyInput: InputC;
    public typeSelector: SelectC;
    public valueComponent: HtmlComponentBase;
    public rowElement: DivC;
    public collapsed: boolean = false;
    
    private _currentKey: string;
    private _currentType: string;
    private _currentValue: DynamicValue;
    private _valueInput: IInputComponent<any>;

    constructor(
        id: number,
        initialKey: string,
        initialValue: DynamicValue,
        typeOptions: Map<string, TypeOption>
    ) {
        this.id = id;
        this._currentKey = initialKey;
        this._currentType = initialValue.type;
        this._currentValue = initialValue;
        
        // キー入力
        this.keyInput = new InputC({ 
            value: initialKey, 
            class: dynamic_entry_key 
        });
        
        // 型セレクター
        const options: { value: string; text: string; selected?: boolean }[] = [];
        for (const [type, opt] of typeOptions) {
            options.push({ 
                value: type, 
                text: `${opt.icon || ''} ${opt.label}`,
                selected: type === initialValue.type
            });
        }
        this.typeSelector = new SelectC({
            options,
            class: dynamic_type_selector
        });
        
        // 値コンポーネントは後で設定
        this._valueInput = null as any;
        this.valueComponent = new DivC();
    }

    public getCurrentKey(): string {
        return this._currentKey;
    }

    public updateKey(newKey: string): void {
        this._currentKey = newKey;
    }

    public getCurrentType(): string {
        return this._currentType;
    }

    public getCurrentValue(): DynamicValue {
        return this._currentValue;
    }

    public setValueInput(input: IInputComponent<any>): void {
        this._valueInput = input;
        this.valueComponent = input as unknown as HtmlComponentBase;
    }

    public getValueInput(): IInputComponent<any> {
        return this._valueInput;
    }

    public updateType(newType: string): void {
        this._currentType = newType;
    }

    public updateValue(newValue: DynamicValue): void {
        this._currentValue = newValue;
    }
}
