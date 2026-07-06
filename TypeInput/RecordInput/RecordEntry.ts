import { DivC, HtmlComponentBase } from "SengenUI/index";
import { IInputComponent } from "../Interfaces/IInputComponent";

/**
 * RecordEntry - 1つのキー・値ペアを表現する内部クラス
 */
export class RecordEntry<K extends string | number, V> {
    public readonly id: number;
    public keyComponent: HtmlComponentBase;
    public valueComponent: HtmlComponentBase;
    public rowElement: DivC;
    private _currentKey: K;
    private _keyInput: IInputComponent<K>;
    private _valueInput: IInputComponent<V>;

    constructor(
        id: number,
        keyInput: IInputComponent<K>,
        valueInput: IInputComponent<V>,
        initialKey: K,
        initialValue: V
    ) {
        this.id = id;
        this._keyInput = keyInput;
        this._valueInput = valueInput;
        this._currentKey = initialKey;

        // 初期値設定
        this._keyInput.setValue(initialKey);
        this._valueInput.setValue(initialValue);

        // UIComponentBaseとして保持
        this.keyComponent = keyInput as unknown as HtmlComponentBase;
        this.valueComponent = valueInput as unknown as HtmlComponentBase;
    }

    public getCurrentKey(): K {
        return this._currentKey;
    }

    public updateKey(newKey: K): void {
        this._currentKey = newKey;
    }

    public getKeyInput(): IInputComponent<K> {
        return this._keyInput;
    }

    public getValueInput(): IInputComponent<V> {
        return this._valueInput;
    }

    public getValue(): V {
        return this._valueInput.getValue();
    }
}
