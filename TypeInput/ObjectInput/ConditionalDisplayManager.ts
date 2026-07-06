import { HtmlComponentBase } from "SengenUI/index";

/**
 * 条件付き表示管理のインターフェース
 */
export interface IConditionalDisplayManager<T> {
    addCondition(field: keyof T, condition: (value: T) => boolean, element: HtmlComponentBase): void;
    updateVisibility(value: T): void;
}

/**
 * 条件付き表示の管理クラス
 */
export class ConditionalDisplayManager<T> implements IConditionalDisplayManager<T> {
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
