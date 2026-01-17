/**
 * Enum選択肢のオプション
 */
export interface EnumOption<T extends string | number> {
    value: T;
    label: string;
    disabled?: boolean;
    icon?: string;
}
