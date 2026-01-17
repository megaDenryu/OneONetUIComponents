import { DivC, HtmlComponentBase, LV2HtmlComponentBase, SpanC } from "SengenUI/index";





export interface InputStateDisplayOptions {
    label: string;
    initialValue?: string;
}

/**
 * 入力コンポーネントの状態を表示する汎用コンポーネント。
 */
export class InputStateDisplay extends LV2HtmlComponentBase {
    protected _componentRoot: HtmlComponentBase;
    private readonly options: InputStateDisplayOptions;
    private valueSpan!: SpanC;

    public constructor(options: InputStateDisplayOptions) {
        super();
        this.options = options;
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC()
                .setStyleCSS({
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    padding: "4px 8px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontFamily: "monospace"
                })
                .childs([
                    new SpanC({ text: this.options.label }).setStyleCSS({
                        fontWeight: "600",
                        color: "#666"
                    }),
                    new SpanC({ text: this.options.initialValue ?? "" }).setStyleCSS({
                        color: "#2196F3",
                        fontWeight: "500"
                    }).bind((span) => {this.valueSpan = span;})
                ]);
    }

    /**
     * 表示する値を更新する。
     */
    public updateValue(value: string | number | boolean): this {
        this.valueSpan.setTextContent(String(value));
        return this;
    }
}

