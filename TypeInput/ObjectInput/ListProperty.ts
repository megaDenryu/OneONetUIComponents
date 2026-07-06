import { HtmlComponentBase } from "SengenUI/index";
import { PropertyOptions } from "./PropertyOptions";

/**
 * リストフィールド設定
 */
export interface ListFieldConfig<T> {
    itemFactory: (value?: T, index?: number) => HtmlComponentBase;
    extractValue: (component: HtmlComponentBase, index: number) => T;
    initialValues?: T[];
    minItems?: number;
    maxItems?: number;
    allowReorder?: boolean;
    addButtonText?: string;
}

/**
 * ListProperty インターフェース
 */
export interface IListProperty<TObj extends Record<string, any>, TField> {
    key: keyof TObj;
    label?: string;
    listConfig: ListFieldConfig<TField>;
    options?: PropertyOptions<TObj, TField[]>;
    tap(func: (self: IListProperty<TObj, TField>) => void): IListProperty<TObj, TField>;
    withOptions(options: PropertyOptions<TObj, TField[]>): IListProperty<TObj, TField>;
}

export class ListProperty<TObj extends Record<string, any>, TField> implements IListProperty<TObj, TField> {
    key: keyof TObj;
    label?: string;
    listConfig: ListFieldConfig<TField>;
    options?: PropertyOptions<TObj, TField[]>;

    constructor(key: keyof TObj, listConfig: ListFieldConfig<TField>, label?: string) {
        this.key = key;
        this.listConfig = listConfig;
        this.label = label;
    }

    public tap(func: (self: this) => void): this {
        func(this);
        return this;
    }

    public withOptions(options: PropertyOptions<TObj, TField[]>): this {
        this.options = options;
        return this;
    }
}
