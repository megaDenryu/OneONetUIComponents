import { ButtonC, DivC, H2C, H3C, LV2HtmlComponentBase } from "SengenUI/index";


import { ITestPage } from "../../../Examples/ITestPage";
import { DynamicRecordInput } from "./DynamicRecordInput";
import { TypeOption, DynamicValue } from "./DynamicTypes";
import { TextInput } from "../TextInput/TextInput";
import { IntTextInput } from "../NumberInput/IntTextInput";
import { BoolToggleSwitchInput } from "../BoolInput/BoolToggleSwitchInput";

/**
 * DynamicRecordInputのテストページ
 */
export class DynamicRecordInputTestPage extends LV2HtmlComponentBase implements ITestPage {
    constructor() {
        super();
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): DivC {
        return new DivC().childs([
            new H2C({ text: "Dynamic Record Input Test Page" }),
            
            // Section 1: 基本的な使い方
            this.createSection1(),
            
            // Section 2: 型変換のデモ
            this.createSection2(),
            
            // Section 3: 再帰的なRecord
            this.createSection3()
        ]);
    }

    /**
     * Section 1: 基本的な使い方
     */
    private createSection1(): DivC {
        const typeOptions: TypeOption[] = [
            { type: "string", label: "文字列", factory: () => new TextInput() },
            { type: "number", label: "数値", factory: () => new IntTextInput() },
            { type: "boolean", label: "真偽値", factory: () => new BoolToggleSwitchInput() }
        ];

        const initialData: Record<string, DynamicValue> = {
            "name": { type: "string", value: "太郎" },
            "age": { type: "number", value: 25 },
            "isStudent": { type: "boolean", value: true }
        };

        const recordInput = new DynamicRecordInput()
            .availableTypes(typeOptions)
            .initialEntries(initialData);

        const outputDiv = new DivC({ text: JSON.stringify(initialData, null, 2) }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd"
        });

        return new DivC().childs([
            new H3C({ text: "Section 1: 基本的な使い方" }),
            recordInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = recordInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 1 値:", value);
            }),
            outputDiv
        ]);
    }

    /**
     * Section 2: 型変換のデモ
     */
    private createSection2(): DivC {
        const typeOptions: TypeOption[] = [
            { type: "string", label: "文字列", factory: () => new TextInput() },
            { type: "number", label: "数値", factory: () => new IntTextInput() },
            { type: "boolean", label: "真偽値", factory: () => new BoolToggleSwitchInput() }
        ];

        const initialData: Record<string, DynamicValue> = {
            "value1": { type: "number", value: 42 },
            "value2": { type: "string", value: "Hello" }
        };

        const recordInput = new DynamicRecordInput()
            .availableTypes(typeOptions)
            .initialEntries(initialData);

        const outputDiv = new DivC({ text: "型を変更して値を取得してください" }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd"
        });

        return new DivC().childs([
            new H3C({ text: "Section 2: 型変換のデモ (number↔string↔boolean)" }),
            recordInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = recordInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 2 値:", value);
            }),
            outputDiv
        ]);
    }

    /**
     * Section 3: 再帰的なRecord (最大深度=3)
     */
    private createSection3(): DivC {
        const MAX_DEPTH = 3;

        // 再帰的に型オプションを生成する関数
        const createTypeOptions = (depth: number): TypeOption[] => {
            const options: TypeOption[] = [
                { type: "string", label: "文字列", factory: () => new TextInput() },
                { type: "number", label: "数値", factory: () => new IntTextInput() }
            ];
            
            // 深度が最大深度未満であればrecordも追加
            if (depth < MAX_DEPTH) {
                options.push({
                    type: "record",
                    label: "レコード",
                    factory: () => {
                        const nestedInput = new DynamicRecordInput({ maxDepth: MAX_DEPTH }, depth + 1);
                        // ネストされたRecordInputにも型オプションを設定
                        nestedInput.availableTypes(createTypeOptions(depth + 1));
                        return nestedInput;
                    }
                });
            }
            
            return options;
        };

        const initialData: Record<string, DynamicValue> = {
            "name": { type: "string", value: "太郎" },
            "config": {
                type: "record",
                value: {
                    "setting1": { type: "number", value: 100 },
                    "nested": {
                        type: "record",
                        value: {
                            "deepValue": { type: "string", value: "deep!" }
                        }
                    }
                }
            }
        };

        const recordInput = new DynamicRecordInput({ maxDepth: MAX_DEPTH }, 0)
            .availableTypes(createTypeOptions(0))
            .initialEntries(initialData);

        const outputDiv = new DivC({ text: JSON.stringify(initialData, null, 2) }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd"
        });

        return new DivC().childs([
            new H3C({ text: "Section 3: 再帰的なRecord (最大深度=3)" }),
            recordInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = recordInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 3 値:", value);
            }),
            outputDiv
        ]);
    }

    public getRoot(): DivC {
        return this._componentRoot as DivC;
    }

    public destroy(): void {
        this.delete();
    }

    public delete(): void {
        super.delete();
    }
}

