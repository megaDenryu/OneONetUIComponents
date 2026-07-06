import { ValidationRule } from "../Interfaces/Validation";

/**
 * 条件付き表示設定
 */
export interface ConditionalDisplay<TObj> {
    dependsOn: keyof TObj;
    condition: (value: any) => boolean;
    hideWhen?: boolean;
}

/**
 * PropertyOptions - UI装飾とオプション設定
 */
export interface IPropertyOptions<TObj, TField> {
    label?: string;
    required?: boolean;
    defaultValue?: TField;
    description?: string;
    validations?: ValidationRule<TField | undefined>[];
    conditional?: ConditionalDisplay<TObj>;
    placeholder?: string;
    helpText?: string;
    tooltip?: string;
    disabled?: boolean;
    readonly?: boolean;
    showErrorInline?: boolean;
    errorDisplayMode?: "tooltip" | "inline" | "none";
}

export class PropertyOptions<TObj extends Record<string, any>, TField = any> implements IPropertyOptions<TObj, TField> {
    label?: string;
    required?: boolean;
    defaultValue?: TField;
    description?: string;
    validations?: ValidationRule<TField | undefined>[];
    conditional?: ConditionalDisplay<TObj>;
    placeholder?: string;
    helpText?: string;
    tooltip?: string;
    disabled?: boolean;
    readonly?: boolean;
    showErrorInline?: boolean;
    errorDisplayMode?: "tooltip" | "inline" | "none";

    constructor(options: IPropertyOptions<TObj, TField>) {
        Object.assign(this, options);
    }

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }
}
