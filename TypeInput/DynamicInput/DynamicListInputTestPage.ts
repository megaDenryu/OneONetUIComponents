import { ButtonC, DivC, H2C, H3C, LV2HtmlComponentBase } from "SengenUI/index";




import { ITestPage } from "../../../Examples/ITestPage";
import { DynamicListInput } from "./DynamicListInput";
import { DynamicRecordInput } from "./DynamicRecordInput";
import { TypeOption, DynamicValue } from "./DynamicTypes";
import { TextInput } from "../TextInput/TextInput";
import { IntTextInput } from "../NumberInput/IntTextInput";
import { BoolToggleSwitchInput } from "../BoolInput/BoolToggleSwitchInput";

/**
 * DynamicListInputのテストページ
 */
export class DynamicListInputTestPage extends LV2HtmlComponentBase implements ITestPage {
    constructor() {
        super();
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): DivC {
        return new DivC().childs([
            new H2C({ text: "Dynamic List Input Test Page" }),
            
            // Section 1: 基本的な使い方
            this.createSection1(),
            
            // Section 2: 型変換のデモ
            this.createSection2(),
            
            // Section 3: 再帰的なリスト（リストの中にリスト）
            this.createSection3(),
            
            // Section 4: リストの中にレコード
            this.createSection4()
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

        const initialData: DynamicValue[] = [
            { type: "string", value: "りんご" },
            { type: "string", value: "バナナ" },
            { type: "number", value: 42 },
            { type: "boolean", value: true }
        ];

        const listInput = new DynamicListInput({ 
            availableTypes: typeOptions,
            initialItems: initialData
        });

        const outputDiv = new DivC({ text: JSON.stringify(initialData, null, 2) }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd",
            marginTop: "10px"
        });

        return new DivC().childs([
            new H3C({ text: "Section 1: 基本的な使い方" }),
            new DivC({ text: "項目の追加、削除、並び替えができます" }).setStyleCSS({ marginBottom: "10px" }),
            listInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = listInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 1 値:", value);
            }).setStyleCSS({ marginTop: "10px" }),
            outputDiv
        ]).setStyleCSS({ marginBottom: "30px" });
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

        const initialData: DynamicValue[] = [
            { type: "number", value: 100 },
            { type: "string", value: "Hello" },
            { type: "boolean", value: false }
        ];

        const listInput = new DynamicListInput({ 
            availableTypes: typeOptions,
            initialItems: initialData
        });

        const outputDiv = new DivC({ text: "型を変更して値を取得してください" }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd",
            marginTop: "10px"
        });

        return new DivC().childs([
            new H3C({ text: "Section 2: 型変換のデモ (number↔string↔boolean)" }),
            new DivC({ text: "型セレクターで型を変更すると、値が自動的に変換されます" }).setStyleCSS({ marginBottom: "10px" }),
            listInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = listInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 2 値:", value);
            }).setStyleCSS({ marginTop: "10px" }),
            outputDiv
        ]).setStyleCSS({ marginBottom: "30px" });
    }

    /**
     * Section 3: 再帰的なリスト（リストの中にリスト）
     */
    private createSection3(): DivC {
        const MAX_DEPTH = 3;

        // 再帰的に型オプションを生成する関数
        const createTypeOptions = (depth: number): TypeOption[] => {
            const options: TypeOption[] = [
                { type: "string", label: "文字列", factory: () => new TextInput() },
                { type: "number", label: "数値", factory: () => new IntTextInput() }
            ];
            
            // 深度が最大深度未満であればlistも追加
            if (depth < MAX_DEPTH) {
                options.push({
                    type: "list",
                    label: "リスト",
                    factory: () => {
                        const nestedInput = new DynamicListInput({ 
                            maxDepth: MAX_DEPTH,
                            currentDepth: depth + 1
                        });
                        // ネストされたListInputにも型オプションを設定
                        nestedInput.availableTypes(createTypeOptions(depth + 1));
                        return nestedInput;
                    }
                });
            }
            
            return options;
        };

        const initialData: DynamicValue[] = [
            { type: "string", value: "トップレベル" },
            {
                type: "list",
                value: [
                    { type: "string", value: "ネストレベル1-1" },
                    { type: "number", value: 100 },
                    {
                        type: "list",
                        value: [
                            { type: "string", value: "ネストレベル2-1" },
                            { type: "number", value: 200 }
                        ]
                    }
                ]
            },
            { type: "number", value: 999 }
        ];

        const listInput = new DynamicListInput({ 
            maxDepth: MAX_DEPTH,
            currentDepth: 0,
            initialItems: initialData,
            availableTypes: createTypeOptions(0)
        });

        const outputDiv = new DivC({ text: JSON.stringify(initialData, null, 2) }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd",
            marginTop: "10px",
            maxHeight: "300px",
            overflow: "auto"
        });

        return new DivC().childs([
            new H3C({ text: "Section 3: 再帰的なリスト (最大深度=3)" }),
            new DivC({ text: "リストの中にリストを入れることができます。深度インジケーターで現在の階層が表示されます" }).setStyleCSS({ marginBottom: "10px" }),
            listInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = listInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 3 値:", value);
            }).setStyleCSS({ marginTop: "10px" }),
            outputDiv
        ]).setStyleCSS({ marginBottom: "30px" });
    }

    /**
     * Section 4: リストの中にレコード
     */
    private createSection4(): DivC {
        const MAX_DEPTH = 3;

        // 型オプションを生成（listとrecordの両方をサポート）
        const createTypeOptions = (depth: number): TypeOption[] => {
            const options: TypeOption[] = [
                { type: "string", label: "文字列", factory: () => new TextInput() },
                { type: "number", label: "数値", factory: () => new IntTextInput() }
            ];
            
            // 深度が最大深度未満であればrecordとlistも追加
            if (depth < MAX_DEPTH) {
                options.push({
                    type: "record",
                    label: "レコード",
                    factory: () => {
                        const nestedInput = new DynamicRecordInput({ maxDepth: MAX_DEPTH }, depth + 1);
                        nestedInput.availableTypes(createTypeOptions(depth + 1));
                        return nestedInput;
                    }
                });
                options.push({
                    type: "list",
                    label: "リスト",
                    factory: () => {
                        const nestedInput = new DynamicListInput({ 
                            maxDepth: MAX_DEPTH,
                            currentDepth: depth + 1
                        });
                        nestedInput.availableTypes(createTypeOptions(depth + 1));
                        return nestedInput;
                    }
                });
            }
            
            return options;
        };

        const initialData: DynamicValue[] = [
            {
                type: "record",
                value: {
                    "name": { type: "string", value: "太郎" },
                    "age": { type: "number", value: 25 }
                }
            },
            {
                type: "record",
                value: {
                    "name": { type: "string", value: "花子" },
                    "age": { type: "number", value: 22 }
                }
            }
        ];

        const listInput = new DynamicListInput({ 
            maxDepth: MAX_DEPTH,
            currentDepth: 0,
            initialItems: initialData,
            availableTypes: createTypeOptions(0)
        });

        const outputDiv = new DivC({ text: JSON.stringify(initialData, null, 2) }).setStyleCSS({
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            border: "1px solid #ddd",
            marginTop: "10px",
            maxHeight: "300px",
            overflow: "auto"
        });

        return new DivC().childs([
            new H3C({ text: "Section 4: リストの中にレコード" }),
            new DivC({ text: "リストの各項目をレコード型にすることで、構造化されたデータのリストを作成できます" }).setStyleCSS({ marginBottom: "10px" }),
            listInput,
            new ButtonC({ text: "値を取得" }).addTypedEventListener('click', () => {
                const value = listInput.getValue();
                outputDiv.dom.element.textContent = JSON.stringify(value, null, 2);
                console.log("Section 4 値:", value);
            }).setStyleCSS({ marginTop: "10px" }),
            outputDiv
        ]).setStyleCSS({ marginBottom: "30px" });
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

