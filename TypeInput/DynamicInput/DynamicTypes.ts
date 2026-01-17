import { HtmlComponentBase, HtmlComponentChild, LV2HtmlComponentBase } from "SengenUI/index";

import { IInputComponent } from "../Interfaces/IInputComponent";

/**
 * 動的な値の型定義
 * 再帰的にRecord/Listをサポート
 */
export type DynamicValue = 
    | { type: "string", value: string }
    | { type: "number", value: number }
    | { type: "boolean", value: boolean }
    | { type: "record", value: Record<string, DynamicValue> }
    | { type: "list", value: DynamicValue[] };

/**
 * 型オプション定義
 */
export interface TypeOption {
    type: string;
    label: string;
    icon?: string;
    factory: () => IInputComponent<any> & LV2HtmlComponentBase;
    validator?: (value: any) => boolean;
    defaultValue?: () => any;
}

/**
 * 型選択可能なInput共通インターフェース
 */
export interface ITypeSelectableInput<T> extends IInputComponent<T> {
    availableTypes(types: TypeOption[]): this;
    getSelectedType?(key: string | number): string;
    changeType?(key: string | number, newType: string): this;
}

/**
 * DynamicValueから実際の値を取得
 */
export function extractValue(dynamicValue: DynamicValue): any {
    return dynamicValue.value;
}

/**
 * 通常の値からDynamicValueを生成
 */
export function toDynamicValue(value: any, inferType: boolean = true): DynamicValue {
    if (inferType) {
        if (typeof value === "string") {
            return { type: "string", value };
        }
        if (typeof value === "number") {
            return { type: "number", value };
        }
        if (typeof value === "boolean") {
            return { type: "boolean", value };
        }
        if (Array.isArray(value)) {
            return { type: "list", value: value.map(v => toDynamicValue(v, true)) };
        }
        if (typeof value === "object" && value !== null) {
            const record: Record<string, DynamicValue> = {};
            for (const [k, v] of Object.entries(value)) {
                record[k] = toDynamicValue(v, true);
            }
            return { type: "record", value: record };
        }
    }
    // デフォルト
    return { type: "string", value: String(value) };
}

/**
 * 型変換ヘルパー
 */
export function convertDynamicValue(oldValue: DynamicValue, newType: string): DynamicValue {
    // 同じ型ならそのまま
    if (oldValue.type === newType) {
        return oldValue;
    }

    const oldVal = oldValue.value;

    // number → string
    if (oldValue.type === "number" && newType === "string") {
        return { type: "string", value: oldVal.toString() };
    }
    
    // string → number
    if (oldValue.type === "string" && newType === "number") {
        const num = parseFloat(oldVal as string);
        return { type: "number", value: isNaN(num) ? 0 : num };
    }
    
    // boolean → string
    if (oldValue.type === "boolean" && newType === "string") {
        return { type: "string", value: oldVal ? "true" : "false" };
    }
    
    // string → boolean
    if (oldValue.type === "string" && newType === "boolean") {
        return { type: "boolean", value: oldVal === "true" || oldVal === "1" };
    }

    // デフォルト値を返す
    return getDefaultValueForType(newType);
}

/**
 * 型のデフォルト値を取得
 */
export function getDefaultValueForType(type: string): DynamicValue {
    switch (type) {
        case "string":
            return { type: "string", value: "" };
        case "number":
            return { type: "number", value: 0 };
        case "boolean":
            return { type: "boolean", value: false };
        case "record":
            return { type: "record", value: {} };
        case "list":
            return { type: "list", value: [] };
        default:
            return { type: "string", value: "" };
    }
}

