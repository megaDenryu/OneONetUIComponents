import { ObjectInput } from "./ObjectInput";

/**
 * ObjectProperty インターフェース
 */
export interface IObjectProperty<TObj extends Record<string, any>, TField extends Record<string, any>> {
    key: keyof TObj;
    label?: string;
    objectInput2: ObjectInput<TField>;
    tap(func: (self: IObjectProperty<TObj, TField>) => void): IObjectProperty<TObj, TField>;
}

/**
 * ObjectProperty - ネストしたオブジェクト用プロパティ
 */
export class ObjectProperty<TObj extends Record<string, any>, TField extends Record<string, any>> implements IObjectProperty<TObj, TField> {
    key: keyof TObj;
    label?: string;
    objectInput2: ObjectInput<TField>;

    constructor(key: keyof TObj, objectInput2: ObjectInput<TField>, label?: string) {
        this.key = key;
        this.objectInput2 = objectInput2;
        this.label = label;
    }

    public tap(func: (self: this) => void): this {
        func(this);
        return this;
    }
}
