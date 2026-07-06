import { IInputComponent } from "../Interfaces/IInputComponent";

/**
 * PropertyType - 型を示すコア部分（key + inputComponent）
 */
export interface IPropertyType<TObj, TField> {
    key: keyof TObj;
    inputComponent: IInputComponent<TField>;
}

export class PropertyType<TObj extends Record<string, any>, TField> implements IPropertyType<TObj, TField> {
    key: keyof TObj;
    inputComponent: IInputComponent<TField>;

    constructor(key: keyof TObj, inputComponent: IInputComponent<TField>) {
        this.key = key;
        this.inputComponent = inputComponent;
    }

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }
}
