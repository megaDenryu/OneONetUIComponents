import { PropertyType } from "./PropertyType";
import { PropertyOptions } from "./PropertyOptions";

/**
 * Property - PropertyTypeとPropertyOptionsの組み合わせ
 */
export interface IProperty<TObj extends Record<string, any>, TField> {
    propertyType: PropertyType<TObj, TField>;
    options: PropertyOptions<TObj, TField>;
    tap(func: (self: IProperty<TObj, TField>) => void): IProperty<TObj, TField>;
}

export class Property<TObj extends Record<string, any>, TField = any> implements IProperty<TObj, TField> {
    propertyType: PropertyType<TObj, TField>;
    options: PropertyOptions<TObj, TField>;

    constructor(propertyType: PropertyType<TObj, TField>, options: PropertyOptions<TObj, any>) {
        this.propertyType = propertyType;
        this.options = options;
    }

    public tap(func: (self: this) => void): this {
        func(this);
        return this;
    }
}
