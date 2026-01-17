import { DivC, HtmlComponentBase, HtmlElementProxy, LV2HtmlComponentBase, SpanC } from "SengenUI/index";
import { z, ZodEnum } from "zod";
import { ReactiveProperty } from "TypeScriptBenriKakuchou/BaseClasses/observer";




import { IToggleFormatStateDisplay } from "../IToggleFormatStateDisplay";

import { blue_display, green_display, red_display } from "./style.css";


export const ColorEnum = z.enum(["red", "green", "blue"]);
export type ColorType = z.infer<typeof ColorEnum>;

function convertColorCss(color: ColorType): string {
    switch (color) {
        case "red":
            return red_display;
        case "green":
            return green_display;
        case "blue":
            return blue_display;
        default:
            throw new Error("Unknown color");
    }
}

export class ToggleFormatStateDisplay<T extends ZodEnum<any>> extends LV2HtmlComponentBase implements IToggleFormatStateDisplay<T> {
    private _title: string;
    private _state: ReactiveProperty<z.infer<T>>;
    private _color: ReactiveProperty<z.infer<typeof ColorEnum>>;

    // 内部で使用するLV1コンポーネント
    private stateTextElement!: SpanC; // buildComponentStructureで初期化

    constructor(title: string, defaultState: z.infer<T>, defaultColor: z.infer<typeof ColorEnum>) {
        // LV2UIComponentBaseのコンストラクタ(super())より先に、
        // createDomProxyやbuildComponentStructureで参照されるプロパティを初期化
        super();
        this._title = title;
        this._state = new ReactiveProperty(defaultState);
        this._color = new ReactiveProperty(defaultColor);
        this._componentRoot = this.createComponentRoot(); // createComponentRootを呼び出して初期化

        this.initializeReactiveSubscriptions();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const rootDiv = (new DivC({class:["toggle-format-state-display", convertColorCss(this._color.get())]})).childs([
                            (new SpanC({ text: this._state.get(), class: "state" })).bind((span) => {this.stateTextElement = span;})
                        ]);
        return rootDiv;
    }

    protected createDomProxy(): HtmlElementProxy {
        return this._componentRoot.dom;
    }

    private initializeReactiveSubscriptions() {
        this._state.addMethod((newState) => {
            if (this.stateTextElement) {
                this.stateTextElement.setTextContent(newState);
            }
        });

        this._color.addMethod((newColor) => {
            // this.dom はルートDivのDomProxyを指す
            this.dom.removeCSSClass([red_display, green_display, blue_display]);
            this.dom.addCSSClass(convertColorCss(newColor));
        });
    }

    public setState(newState: z.infer<T>) {
        this._state.set(newState);
    }

    public getState(): z.infer<T> {
        return this._state.get();
    }

    public setColor(newColor: z.infer<typeof ColorEnum>) {
        this._color.set(newColor);
    }

    public getColor(): z.infer<typeof ColorEnum> {
        return this._color.get();
    }
}

export function ToggleFormatStateDisplayの使い方() {
    const StateEnum = z.enum(["未保存", "保存済み"]);
    const stateDisplay = new ToggleFormatStateDisplay<typeof StateEnum>("状態表示", "未保存", "red");

    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.onclick = () => {
        stateDisplay.setState("保存済み");
        stateDisplay.setColor("green");
    };

    const unsaveButton = document.createElement("button");
    unsaveButton.textContent = "未保存";
    unsaveButton.onclick = () => {
        stateDisplay.setState("未保存");
        stateDisplay.setColor("red");
    };

    document.body.appendChild(stateDisplay.dom.element); // UIComponentBaseのgetElement()を使用
    document.body.appendChild(saveButton);
    document.body.appendChild(unsaveButton);
}
