import { DivC, HtmlComponentBase, LV2HtmlComponentBase, SpanC } from "SengenUI/index";




import { IInputComponent, IObjectInput } from "../Interfaces/IInputComponent";
import { ValidationRule, IValidationRulesStatic, ValidationRules } from "../Interfaces/Validation";
import { ListEditorInput } from "../ListInput/ListEditorInput";
import { ObjectInputStateDisplay } from "./ObjectInputStateDisplay";
import {
    object_input_container,
    object_input_field_row,
    object_input_label,
    object_input_required_mark,
    object_input_field_wrapper,
    object_input_error_message,
    object_input_layout,
    object_input_nested,
    object_input_section_title,
    object_input_main_container,
    object_input_field_row_full,
    object_input_input_container,
    object_input_field_wrapper_full,
    object_input_nested_full,
    object_input_error_message_full,
    object_input_help_text,
    object_input_error_message_visible,
    object_input_error_message_hidden
} from "./style.css";

/**
 * 条件付き表示管理のインターフェース
 */
interface IConditionalDisplayManager<T> {
    addCondition(field: keyof T, condition: (value: T) => boolean, element: HtmlComponentBase): void;
    updateVisibility(value: T): void;
}

/**
 * 条件付き表示の管理クラス
 */
class ConditionalDisplayManager<T> implements IConditionalDisplayManager<T> {
    private conditions: Map<keyof T, (value: T) => boolean> = new Map();
    private elements: Map<keyof T, HtmlComponentBase> = new Map();

    public addCondition(field: keyof T, condition: (value: T) => boolean, element: HtmlComponentBase): void {
        this.conditions.set(field, condition);
        this.elements.set(field, element);
    }

    public updateVisibility(value: T): void {
        for (const [field, condition] of this.conditions) {
            const element = this.elements.get(field);
            if (element) {
                const shouldShow = condition(value);
                element.setStyleCSS({
                    display: shouldShow ? 'block' : 'none'
                });
            }
        }
    }
}

/**
 * バリデーションルール定義
 */


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
 * 条件付き表示設定
 */
export interface ConditionalDisplay<TObj> {
    dependsOn: keyof TObj;
    condition: (value: any) => boolean;
    hideWhen?: boolean;
}

/**
 * クロスフィールドバリデーション
 */
export interface CrossFieldValidation<T> {
    fields: (keyof T)[];
    validator: (values: Partial<T>) => boolean | string;
    message?: string;
}

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
    // 新機能: UI拡張オプション
    placeholder?: string;
    helpText?: string;
    tooltip?: string;
    disabled?: boolean;
    readonly?: boolean;
    // エラー表示設定
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
    // 新機能: UI拡張オプション
    placeholder?: string;
    helpText?: string;
    tooltip?: string;
    disabled?: boolean;
    readonly?: boolean;
    // エラー表示設定
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

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }
}

/**
 * ListProperty - リスト用プロパティ
 */
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

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }

    public withOptions(options: PropertyOptions<TObj, TField[]>): this {
        this.options = options;
        return this;
    }
}

/**
 * Property - PropertyTypeとPropertyOptionsの組み合わせ
 */
export interface IProperty<TObj extends Record<string, any>, TField> {
    propertyType: PropertyType<TObj, TField>;
    options: PropertyOptions<TObj, TField>;
    bind(func: (self: IProperty<TObj, TField>) => void): IProperty<TObj, TField>;
}

/**
 * ObjectProperty インターフェース
 */
export interface IObjectProperty<TObj extends Record<string, any>, TField extends Record<string, any>> {
    key: keyof TObj;
    label?: string;
    objectInput2: ObjectInput<TField>;
    bind(func: (self: IObjectProperty<TObj, TField>) => void): IObjectProperty<TObj, TField>;
}

/**
 * ListProperty インターフェース
 */
export interface IListProperty<TObj extends Record<string, any>, TField> {
    key: keyof TObj;
    label?: string;
    listConfig: ListFieldConfig<TField>;
    options?: PropertyOptions<TObj, TField[]>;
    bind(func: (self: IListProperty<TObj, TField>) => void): IListProperty<TObj, TField>;
    withOptions(options: PropertyOptions<TObj, TField[]>): IListProperty<TObj, TField>;
}

export class Property<TObj extends Record<string, any>, TField = any> implements IProperty<TObj, TField> {
    propertyType: PropertyType<TObj, TField>;
    options: PropertyOptions<TObj, TField>;

    constructor(propertyType: PropertyType<TObj, TField>, options: PropertyOptions<TObj, any>) {
        this.propertyType = propertyType;
        this.options = options;
    }

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }
}

/**
 * ObjectInputのオプション
 */
export interface ObjectInputOptions<T extends Record<string, any>> {
    layout?: "vertical" | "horizontal" | "grid";
    sectionTitle?: string;
    initialValue?: Partial<T>;
    globalValidations?: CrossFieldValidation<T>[];
    onChange?: (value: T) => void;
    onValidationError?: (errors: Record<string, string>) => void;
}

export interface IObjectInputExtended<T extends Record<string, any>> extends IObjectInput<T> {
    // プロパティ設定メソッド
    properties(...propertyLists: ((Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>)[] | Iterable<Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>>)[]): this;
    property(prop: Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>): this;

    // オプション設定メソッド
    withOptions(options: ObjectInputOptions<T>): this;

    // 新機能: 条件付き表示
    addConditionalDisplay(field: keyof T, condition: (value: T) => boolean): this;

    // 新機能: リアルタイム値表示連携
    withStateDisplay(stateDisplay: ObjectInputStateDisplay): this;

    // 新機能: パフォーマンス最適化
    setPerformanceMode(enabled: boolean): this;

    // UIComponentBase継承
    bind(func: (self: this) => void): this;
}

/**
 * 宣言的ObjectInput
 */
export class ObjectInput<T extends Record<string, any>> extends LV2HtmlComponentBase implements IObjectInputExtended<T> {
    private _properties: (Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>)[] = [];
    private _options: ObjectInputOptions<T>;
    protected _componentRoot: HtmlComponentBase;
    private _currentValue: T;
    private _fieldComponents: Map<keyof T, IInputComponent<any>> = new Map();
    // 新機能: エラー状態管理
    private _fieldErrors: Map<keyof T, string[]> = new Map();
    private _errorElements: Map<keyof T, HtmlComponentBase> = new Map();
    private _isPerformanceMode: boolean = false;
    // 新機能: 条件付き表示管理
    private _conditionalDisplay: ConditionalDisplayManager<T> = new ConditionalDisplayManager<T>();
    // 新機能: パフォーマンス最適化
    private _fieldComponentCache: Map<string, HtmlComponentBase> = new Map();
    private _validationDebounceMap: Map<keyof T, number> = new Map();
    // リアルタイム値表示
    private _stateDisplay?: ObjectInputStateDisplay;

    constructor(options: ObjectInputOptions<T> = {}) {
        super();
        this._options = options;
        this._currentValue = {} as T;
        this._componentRoot = this.createComponentRoot();
    }

    /**
     * プロパティを配列で一括設定（childs()パターン）
     */
    public properties(...propertyLists: ((Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>)[] | Iterable<Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>>)[]): this {
        for (const properties of propertyLists) {
            for (const property of properties) {
                this._properties.push(property);
            }
        }
        this._componentRoot = this.createComponentRoot();
        return this;
    }

    /**
     * 単一プロパティ追加
     */
    public property(prop: Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>): this {
        this._properties.push(prop);
        this._componentRoot = this.createComponentRoot();
        return this;
    }

    /**
     * オプション設定
     */
    public withOptions(options: ObjectInputOptions<T>): this {
        this._options = { ...this._options, ...options };
        this._componentRoot = this.createComponentRoot();
        return this;
    }

    public bind(func: (self: this) => void): this {
        func(this);
        return this;
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({ class: [object_input_container, object_input_main_container] }).childIfs([
            {
                If: Boolean(this._options.sectionTitle),
                True: new DivC({ text: this._options.sectionTitle, class: object_input_section_title }),
            },
            this._properties.map(property =>
                this.createFieldElement(property)
            )
        ])
            .addClass(this._options.layout ?
                object_input_layout[this._options.layout] || object_input_layout.vertical :
                null
            );


    }

    private createFieldElement(property: Property<T, any> | ObjectProperty<T, any> | ListProperty<T, any>): HtmlComponentBase | undefined {
        if (property instanceof Property) {
            return this.createBasicField(property);
        } else if (property instanceof ObjectProperty) {
            return this.createObjectField(property);
        } else if (property instanceof ListProperty) {
            return this.createListField(property);
        }
        return undefined;
    }

    private createBasicField(property: Property<T, any>): HtmlComponentBase {
        const { propertyType, options } = property;
        const { key, inputComponent } = propertyType;
        const {
            label,
            required,
            defaultValue,
            placeholder,
            helpText,
            tooltip,
            disabled,
            readonly,
            showErrorInline,
            errorDisplayMode
        } = options;

        // 変更イベント設定（パフォーマンス最適化付き）
        inputComponent.bind((inputComponent) => {
            // デフォルト値設定
            if (defaultValue !== undefined) {
                inputComponent.setValue(defaultValue);
                (this._currentValue as any)[key] = defaultValue;
            }

            if (placeholder) { inputComponent.setPlaceholder?.(placeholder); }// 新機能: placeholder設定
            if (disabled) { inputComponent.setDisabled?.(true); }// 新機能: disabled/readonly設定
            if (readonly) { inputComponent.setReadonly?.(true); }
        }).onChange((value) => {
            (this._currentValue as any)[key] = value;
            this._options.onChange?.(this._currentValue);

            // 新機能: 条件付き表示の更新
            this._conditionalDisplay.updateVisibility(this._currentValue);

            // 新機能: リアルタイムバリデーション
            if (options.validations && options.validations.length > 0) {
                this.validateFieldWithDebounce(key, value);
            }

            // 新機能: リアルタイム値表示の更新
            if (this._stateDisplay) {
                this._stateDisplay.updateValue(this._currentValue);
            }
        });

        this._fieldComponents.set(key, inputComponent);

        // フィールドラッパーを作成（vanilla extractクラスを使用）
        return new DivC({ class: [object_input_field_row, object_input_field_row_full] }).childIf({
            If: Boolean(label),
            True: new SpanC({ text: label, class: object_input_label }).childIf({
                If: Boolean(required),
                True: new SpanC({ text: " *", class: object_input_required_mark }).setTooltip(tooltip)
            })
        }).child( // 入力フィールドラッパー
            new DivC({ class: [object_input_field_wrapper, object_input_field_wrapper_full] }).childIfs([
                new DivC({ class: object_input_input_container }).child(inputComponent as unknown as HtmlComponentBase),
                {
                    If: Boolean(helpText),
                    True: new SpanC({ text: helpText, class: object_input_help_text })// 新機能: helpText表示
                },
                {
                    If: showErrorInline !== false, // エラー表示エリア。デフォルトはインライン表示。
                    True: new DivC({ class: [object_input_error_message, object_input_error_message_full] }).bind(
                        (self) => { this._errorElements.set(key, self); }
                    )
                }
            ])
        )
    }

    private createObjectField(property: ObjectProperty<T, any>): HtmlComponentBase {
        const { key, objectInput2, label } = property;
        // 宣言的にフィールドを構築
        return new DivC({ class: [object_input_field_row, object_input_field_row_full] }).childIfs([
            {
                If: Boolean(label),
                True: new SpanC({ text: label, class: object_input_label })
            },
            new DivC({ class: [object_input_nested, object_input_nested_full] }).child(
                objectInput2.bind((objectInput) => {// ネストしたオブジェクトの値変更イベント設定とフィールド登録
                    this._fieldComponents.set(key, objectInput as unknown as IInputComponent<any>);
                }).onChange((value) => {
                    (this._currentValue as any)[key] = value;
                    this._options.onChange?.(this._currentValue);
                })
            )
        ]);
    }

    private createListField(property: ListProperty<T, any>): HtmlComponentBase {
        const { key, listConfig, label, options } = property;

        // ListEditorInputを作成し、イベント設定とフィールド登録を宣言的に行う
        const listEditor = new ListEditorInput({
            itemFactory: listConfig.itemFactory,
            extractValue: listConfig.extractValue,
            initialValues: listConfig.initialValues || [],
            minItems: listConfig.minItems || 0,
            maxItems: listConfig.maxItems || Infinity,
            allowReorder: listConfig.allowReorder ?? true
        }).bind((editor) => {
            this._fieldComponents.set(key, editor as any);
        }).onChange((value) => {
            (this._currentValue as any)[key] = value;
            this._options.onChange?.(this._currentValue);
        });

        // 宣言的にフィールドを構築
        return new DivC({ class: [object_input_field_row, object_input_field_row_full] }).childIfs([
            {
                If: Boolean(label),
                True: new SpanC({ text: label, class: object_input_label })
            },
            new DivC({ class: [object_input_field_wrapper, object_input_field_wrapper_full] }).child(listEditor)
        ]);
    }

    // IInputComponent実装
    public getValue(): T {
        return this._currentValue;
    }

    public setValue(value: Partial<T>): this {
        this._currentValue = { ...this._currentValue, ...value };

        // 各フィールドに値を設定
        for (const [key, component] of this._fieldComponents) {
            if (value[key] !== undefined) {
                component.setValue(value[key]);
            }
        }

        // 新機能: 条件付き表示の更新
        this._conditionalDisplay.updateVisibility(this._currentValue);

        // 新機能: リアルタイム値表示の更新
        if (this._stateDisplay) {
            this._stateDisplay.updateValue(this._currentValue);
        }

        return this;
    }

    public onChange(callback: (value: T) => void): this {
        this._options.onChange = callback;
        return this;
    }

    public validate(): boolean {
        // 基本バリデーション実装
        let isValid = true;

        for (const property of this._properties) {
            if (property instanceof Property && property.options.validations) {
                const value = (this._currentValue as any)[property.propertyType.key];
                for (const validation of property.options.validations) {
                    const result = validation.validator(value);
                    if (result !== true) {
                        isValid = false;
                        // エラー表示処理
                    }
                }
            }
        }

        // グローバルバリデーション
        if (this._options.globalValidations) {
            for (const validation of this._options.globalValidations) {
                const result = validation.validator(this._currentValue);
                if (result !== true) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    // 新機能: エラー表示管理
    private showFieldError(field: keyof T, errors: string[]): void {
        this._fieldErrors.set(field, errors);

        if (errors.length === 0) {
            this.hideFieldError(field);
            return;
        }

        let errorElement = this._errorElements.get(field);
        if (!errorElement) {
            errorElement = new DivC({ class: object_input_error_message });
            this._errorElements.set(field, errorElement);
        }

        // エラーメッセージの更新（vanilla extractクラスを使用）
        if (errorElement instanceof DivC) {
            (errorElement as DivC).setTextContent(errors.join(', '));
        }
        errorElement.removeClass(object_input_error_message_hidden);
        errorElement.addClass(object_input_error_message_visible);
    }

    private hideFieldError(field: keyof T): void {
        const errorElement = this._errorElements.get(field);
        if (errorElement) {
            errorElement.removeClass(object_input_error_message_visible);
            errorElement.addClass(object_input_error_message_hidden);
        }
        this._fieldErrors.delete(field);
    }

    // 新機能: パフォーマンス最適化付きバリデーション
    private validateFieldWithDebounce(field: keyof T, value: any): void {
        // 既存のタイマーをクリア
        const existingTimer = this._validationDebounceMap.get(field);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // デバウンス処理
        const timer = window.setTimeout(() => {
            this.validateField(field, value);
            this._validationDebounceMap.delete(field);
        }, this._isPerformanceMode ? 500 : 100);

        this._validationDebounceMap.set(field, timer);
    }

    private validateField(field: keyof T, value: any): void {
        const property = this._properties.find(p => {
            if (p instanceof Property) {
                return p.propertyType.key === field;
            }
            return false;
        }) as Property<T, any> | undefined;

        if (!property || !property.options.validations) {
            return;
        }

        const errors: string[] = [];
        for (const validation of property.options.validations) {
            const result = validation.validator(value);
            if (result !== true) {
                errors.push(typeof result === 'string' ? result : validation.message || 'Invalid value');
            }
        }

        this.showFieldError(field, errors);
    }

    // 新機能: 条件付き表示の追加
    public addConditionalDisplay(field: keyof T, condition: (value: T) => boolean): this {
        const fieldElement = this._fieldComponents.get(field);
        if (fieldElement && fieldElement instanceof HtmlComponentBase) {
            this._conditionalDisplay.addCondition(field, condition, fieldElement as HtmlComponentBase);
        }
        return this;
    }

    // 新機能: リアルタイム値表示の設定
    public withStateDisplay(stateDisplay: ObjectInputStateDisplay): this {
        this._stateDisplay = stateDisplay;
        return this;
    }

    // 新機能: パフォーマンスモードの切り替え
    public setPerformanceMode(enabled: boolean): this {
        this._isPerformanceMode = enabled;
        return this;
    }
}


