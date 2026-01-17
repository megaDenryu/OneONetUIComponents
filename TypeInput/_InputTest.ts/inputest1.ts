import { DivC, H1C, H2C, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";





import { TextInput } from "../TextInput/TextInput";
import { IntTextInput } from "../NumberInput/IntTextInput";
import { NumberSliderInput } from "../NumberInput/NumberSliderInput";
import { NumberStepperInput } from "../NumberInput/NumberStepperInput";
import { BoolCheckboxInput } from "../BoolInput/BoolCheckboxInput";
import { BoolToggleSwitchInput } from "../BoolInput/BoolToggleSwitchInput";
import { BoolRadioGroupInput } from "../BoolInput/BoolRadioGroupInput";
import { BoolButtonToggleInput } from "../BoolInput/BoolButtonToggleInput";
import { EnumSelectInput } from "../EnumInput/EnumSelectInput";
import { EnumOption } from "../EnumInput/types";
import { EnumRadioGroupInput } from "../EnumInput/EnumRadioGroupInput";
import { EnumButtonGroupInput } from "../EnumInput/EnumButtonGroupInput";
import { ListEditorInput } from "../ListInput/ListEditorInput";
import { MultiSelectInput } from "../ListInput/MultiSelectInput";
import { InputStateDisplay } from "../ObjectInput/InputStateDisplay";
import { ITestPage } from "../../../Examples/ITestPage";

export class InputTest1Page extends LV2HtmlComponentBase implements ITestPage {
    protected _componentRoot: HtmlComponentBase;

    public constructor() {
        super();
        this._componentRoot = this.createComponentRoot();
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC()
            .setStyleCSS({
                padding: "32px",
                maxWidth: "1200px",
                margin: "0 auto",
                fontFamily: "system-ui, -apple-system, sans-serif"
            })
            .childs([
                new H1C({ text: "Input Components Test Page" }).setStyleCSS({
                    marginBottom: "32px",
                    color: "#333"
                }),
                this.TextInputSection(),
                this.NumberInputSection(),
                this.BoolInputSection(),
                this.EnumInputSection(),
                this.ListInputSection()
            ]);
    }

    /**
     * TextInput セクションを作成する。
     */
    private TextInputSection(): DivC {
        // InputStateDisplayは事前にコンストラクトする必要がある
        // 理由: イベントのバインド順序の都合上、InputコンポーネントのonChangeから参照できる必要があるため
        const state1 = new InputStateDisplay({ label: "値:", initialValue: "" });
        const state2 = new InputStateDisplay({ label: "値:", initialValue: "" });
        const state3 = new InputStateDisplay({ label: "値:", initialValue: "" });

        return new DivC()
            .setStyleCSS({ marginBottom: "48px" })
            .childs([
                new H2C({ text: "📝 TextInput" }).setStyleCSS({
                    marginBottom: "16px",
                    color: "#555"
                }),
                this.InputRow(
                    "標準テキスト入力:",
                    new TextInput({
                        placeholder: "テキストを入力",
                        width: "medium",
                        onChange: (value) => { state1.updateValue(value); }
                    }),
                    state1
                ),
                this.InputRow(
                    "最大長制限 (10文字):",
                    new TextInput({
                        placeholder: "10文字まで",
                        maxLength: 10,
                        width: "medium",
                        onChange: (value) => { state2.updateValue(value); }
                    }),
                    state2
                ),
                this.InputRow(
                    "無効状態:",
                    new TextInput({
                        value: "編集不可",
                        disabled: true,
                        width: "medium",
                        onChange: (value) => { state3.updateValue(value); }
                    }),
                    state3
                )
            ]);
    }

    /**
     * NumberInput セクションを作成する。
     */
    private NumberInputSection(): DivC {
        // InputStateDisplayは事前にコンストラクトする必要がある
        // 理由: イベントのバインド順序の都合上、InputコンポーネントのonChangeから参照できる必要があるため
        const intState = new InputStateDisplay({ label: "値:", initialValue: "0" });
        const sliderState = new InputStateDisplay({ label: "値:", initialValue: "50" });
        const stepperState = new InputStateDisplay({ label: "値:", initialValue: "10" });
        const stepperDecimalState = new InputStateDisplay({ label: "値:", initialValue: "0.5" });

        return new DivC()
            .setStyleCSS({ marginBottom: "48px" })
            .childs([
                new H2C({ text: "🔢 Number Inputs" }).setStyleCSS({
                    marginBottom: "16px",
                    color: "#555"
                }),
                this.InputRow(
                    "整数テキスト入力 (0-100):",
                    new IntTextInput({
                        placeholder: "整数を入力",
                        min: 0,
                        max: 100,
                        initialValue: 0
                    }).onValueCommit((value) => { intState.updateValue(value ?? "null"); }),
                    intState
                ),
                this.InputRow(
                    "スライダー入力 (0-100):",
                    new NumberSliderInput({
                        min: 0,
                        max: 100,
                        step: 1,
                        initialValue: 50
                    }).onValueInput((value) => { sliderState.updateValue(value); }),
                    sliderState
                ),
                this.InputRow(
                    "ステッパー入力 (0-20):",
                    new NumberStepperInput({
                        min: 0,
                        max: 20,
                        step: 1,
                        initialValue: 10
                    }).onValueInput((value) => { stepperState.updateValue(value); }),
                    stepperState
                ),
                this.InputRow(
                    "小数ステッパー (0-1, step:0.1):",
                    new NumberStepperInput({
                        min: 0,
                        max: 1,
                        step: 0.1,
                        initialValue: 0.5
                    }).onValueInput((value) => { stepperDecimalState.updateValue(value); }),
                    stepperDecimalState
                )
            ]);
    }

    /**
     * BoolInput セクションを作成する。
     */
    private BoolInputSection(): DivC {
        // InputStateDisplayは事前にコンストラクトする必要がある
        // 理由: イベントのバインド順序の都合上、InputコンポーネントのonChangeから参照できる必要があるため
        const checkboxState = new InputStateDisplay({ label: "値:", initialValue: "false" });
        const toggleState = new InputStateDisplay({ label: "値:", initialValue: "false" });
        const radioState = new InputStateDisplay({ label: "値:", initialValue: "false" });
        const buttonState = new InputStateDisplay({ label: "値:", initialValue: "false" });

        return new DivC()
            .setStyleCSS({ marginBottom: "48px" })
            .childs([
                new H2C({ text: "☑️ Bool Inputs" }).setStyleCSS({
                    marginBottom: "16px",
                    color: "#555"
                }),
                this.InputRow(
                    "チェックボックス:",
                    new BoolCheckboxInput({
                        label: "有効にする",
                        initialValue: false
                    }).onChange((value) => { checkboxState.updateValue(value); }),
                    checkboxState
                ),
                this.InputRow(
                    "トグルスイッチ:",
                    new BoolToggleSwitchInput({
                        label: "トグル",
                        initialValue: false
                    }).onChange((value) => { toggleState.updateValue(value); }),
                    toggleState
                ),
                this.InputRow(
                    "ラジオボタングループ:",
                    new BoolRadioGroupInput({
                        trueLabel: "はい",
                        falseLabel: "いいえ",
                        initialValue: false
                    }).onChange((value) => { radioState.updateValue(value); }),
                    radioState
                ),
                this.InputRow(
                    "ボタントグル:",
                    new BoolButtonToggleInput({
                        labelTrue: "有効",
                        labelFalse: "無効",
                        initialValue: false,
                        icon: { true: "✓", false: "✕" }
                    }).onChange((value) => { buttonState.updateValue(value); }),
                    buttonState
                )
            ]);
    }

    /**
     * EnumInput セクションを作成する。
     */
    private EnumInputSection(): DivC {
        // テスト用Enum
        enum Color {
            Red = "red",
            Green = "green",
            Blue = "blue",
            Yellow = "yellow"
        }

        // Union型のテスト
        type ポケモンタイプ = "ほのお" | "みず" | "くさ" | "でんき" | "エスパー" | "かくとう" | "どく" | "じめん" | "ひこう" | "むし" | "いわ" | "ゴースト" | "ドラゴン" | "あく" | "はがね" | "フェアリー";

        const colorOptions: EnumOption<Color>[] = [
            { value: Color.Red, label: "赤色", icon: "🔴" },
            { value: Color.Green, label: "緑色", icon: "🟢" },
            { value: Color.Blue, label: "青色", icon: "🔵" },
            { value: Color.Yellow, label: "黄色", icon: "🟡" }
        ];

        const pokemonTypeOptions: EnumOption<ポケモンタイプ>[] = [
            { value: "ほのお", label: "ほのおタイプ", icon: "🔥" },
            { value: "みず", label: "みずタイプ", icon: "💧" },
            { value: "くさ", label: "くさタイプ", icon: "🌿" },
            { value: "でんき", label: "でんきタイプ", icon: "⚡" },
            { value: "エスパー", label: "エスパータイプ", icon: "🔮" },
            { value: "かくとう", label: "かくとうタイプ", icon: "👊" }
        ];

        // InputStateDisplayは事前にコンストラクトする必要がある
        // 理由: イベントのバインド順序の都合上、InputコンポーネントのonChangeから参照できる必要があるため
        const selectState1 = new InputStateDisplay({ label: "値:", initialValue: String(Color.Red) });
        const radioState1 = new InputStateDisplay({ label: "値:", initialValue: String(Color.Green) });
        const buttonState1 = new InputStateDisplay({ label: "値:", initialValue: String(Color.Blue) });
        const selectState2 = new InputStateDisplay({ label: "値:", initialValue: "ほのお" });
        const radioState2 = new InputStateDisplay({ label: "値:", initialValue: "みず" });
        const buttonState2 = new InputStateDisplay({ label: "値:", initialValue: "くさ" });

        return new DivC()
            .setStyleCSS({ marginBottom: "48px" })
            .childs([
                new H2C({ text: "🎨 Enum Inputs" }).setStyleCSS({
                    marginBottom: "16px",
                    color: "#555"
                }),
                // Enum型のテスト
                this.InputRow(
                    "セレクトボックス (Enum):",
                    new EnumSelectInput({
                        options: colorOptions,
                        initialValue: Color.Red,
                        width: "medium"
                    }).onChange((value) => { selectState1.updateValue(value); }),
                    selectState1
                ),
                this.InputRow(
                    "ラジオボタン (Enum):",
                    new EnumRadioGroupInput({
                        options: colorOptions,
                        initialValue: Color.Green,
                        direction: "horizontal"
                    }).onChange((value) => { radioState1.updateValue(value); }),
                    radioState1
                ),
                this.InputRow(
                    "ボタングループ (Enum):",
                    new EnumButtonGroupInput({
                        options: colorOptions,
                        initialValue: Color.Blue
                    }).onChange((value) => { buttonState1.updateValue(value); }),
                    buttonState1
                ),
                // Union型のテスト
                this.InputRow(
                    "セレクトボックス (Union型):",
                    new EnumSelectInput({
                        options: pokemonTypeOptions,
                        initialValue: "ほのお",
                        width: "medium"
                    }).onChange((value) => { selectState2.updateValue(value); }),
                    selectState2
                ),
                this.InputRow(
                    "ラジオボタン (Union型):",
                    new EnumRadioGroupInput({
                        options: pokemonTypeOptions,
                        initialValue: "みず",
                        direction: "horizontal"
                    }).onChange((value) => { radioState2.updateValue(value); }),
                    radioState2
                ),
                this.InputRow(
                    "ボタングループ (Union型):",
                    new EnumButtonGroupInput({
                        options: pokemonTypeOptions,
                        initialValue: "くさ"
                    }).onChange((value) => { buttonState2.updateValue(value); }),
                    buttonState2
                )
            ]);
    }

    /**
     * ListInput セクションを作成する。
     */
    private ListInputSection(): DivC {
        // テスト用Union型
        type ポケモンタイプ = "ほのお" | "みず" | "くさ" | "でんき" | "エスパー" | "かくとう";

        enum Priority {
            Low = "low",
            Medium = "medium",
            High = "high"
        }

        const pokemonTypeOptions: EnumOption<ポケモンタイプ>[] = [
            { value: "ほのお", label: "ほのおタイプ", icon: "🔥" },
            { value: "みず", label: "みずタイプ", icon: "💧" },
            { value: "くさ", label: "くさタイプ", icon: "🌿" },
            { value: "でんき", label: "でんきタイプ", icon: "⚡" },
            { value: "エスパー", label: "エスパータイプ", icon: "🔮" },
            { value: "かくとう", label: "かくとうタイプ", icon: "👊" }
        ];

        const priorityOptions: EnumOption<Priority>[] = [
            { value: Priority.Low, label: "低", icon: "🟢" },
            { value: Priority.Medium, label: "中", icon: "🟡" },
            { value: Priority.High, label: "高", icon: "🔴" }
        ];

        // InputStateDisplayは事前にコンストラクトする必要がある
        // 理由: イベントのバインド順序の都合上、InputコンポーネントのonChangeから参照できる必要があるため
        const listEditorState1 = new InputStateDisplay({ label: "値:", initialValue: "[]" });
        const listEditorState2 = new InputStateDisplay({ label: "値:", initialValue: "[]" });
        const listEditorState3 = new InputStateDisplay({ label: "値:", initialValue: "[]" });
        const listEditorState4 = new InputStateDisplay({ label: "値:", initialValue: "[]" });
        const listEditorState5 = new InputStateDisplay({ label: "値:", initialValue: "[]" });
        const multiSelectState1 = new InputStateDisplay({ label: "値:", initialValue: "[]" });
        const multiSelectState2 = new InputStateDisplay({ label: "値:", initialValue: "[]" });

        return new DivC()
            .setStyleCSS({ marginBottom: "48px" })
            .childs([
                new H2C({ text: "📋 List Inputs" }).setStyleCSS({
                    marginBottom: "16px",
                    color: "#555"
                }),
                // ListEditorInput - 文字列リスト
                this.InputRow(
                    "リストエディタ (string):",
                    new ListEditorInput<string>({
                        itemFactory: () => new TextInput({
                            placeholder: "項目を入力",
                            width: "medium"
                        }),
                        extractValue: (component) => {
                            return (component as TextInput).getValue();
                        },
                        initialValues: ["項目1", "項目2"],
                        minItems: 1,
                        maxItems: 10,
                        allowReorder: true
                    }).onChange((values) => {
                        listEditorState1.updateValue(JSON.stringify(values));
                    }),
                    listEditorState1
                ),
                // ListEditorInput - 数値リスト
                this.InputRow(
                    "リストエディタ (number):",
                    new ListEditorInput<number>({
                        itemFactory: () => new IntTextInput({
                            placeholder: "数値",
                            min: 0,
                            max: 100,
                            initialValue: 0
                        }),
                        extractValue: (component) => {
                            return (component as IntTextInput).getValue() ?? 0;
                        },
                        initialValues: [10, 20, 30],
                        minItems: 0,
                        maxItems: 5,
                        allowReorder: true
                    }).onChange((values) => {
                        listEditorState2.updateValue(JSON.stringify(values));
                    }),
                    listEditorState2
                ),
                // ListEditorInput - スライダーリスト
                this.InputRow(
                    "リストエディタ (slider):",
                    new ListEditorInput<number>({
                        itemFactory: () => new NumberSliderInput({
                            min: 0,
                            max: 100,
                            step: 10,
                            initialValue: 50
                        }),
                        extractValue: (component) => {
                            return (component as NumberSliderInput).getValue();
                        },
                        initialValues: [30, 60, 90],
                        minItems: 0,
                        maxItems: 10,
                        allowReorder: true
                    }).onChange((values) => {
                        listEditorState3.updateValue(JSON.stringify(values));
                    }),
                    listEditorState3
                ),
                // ListEditorInput - Boolリスト
                this.InputRow(
                    "リストエディタ (bool):",
                    new ListEditorInput<boolean>({
                        itemFactory: () => new BoolToggleSwitchInput({
                            label: "有効",
                            initialValue: false
                        }),
                        extractValue: (component) => {
                            return (component as BoolToggleSwitchInput).getValue();
                        },
                        initialValues: [true, false, true],
                        minItems: 0,
                        maxItems: 8,
                        allowReorder: true
                    }).onChange((values) => {
                        listEditorState4.updateValue(JSON.stringify(values));
                    }),
                    listEditorState4
                ),
                // ListEditorInput - Enumリスト
                this.InputRow(
                    "リストエディタ (enum):",
                    new ListEditorInput<Priority>({
                        itemFactory: () => new EnumSelectInput<Priority>({
                            options: priorityOptions,
                            initialValue: Priority.Medium,
                            width: "small"
                        }),
                        extractValue: (component) => {
                            return (component as EnumSelectInput<Priority>).getValue() ?? Priority.Medium;
                        },
                        initialValues: [Priority.High, Priority.Low, Priority.Medium],
                        minItems: 0,
                        maxItems: 10,
                        allowReorder: true
                    }).onChange((values) => {
                        listEditorState5.updateValue(JSON.stringify(values));
                    }),
                    listEditorState5
                ),
                // MultiSelectInput - チェックボックス
                this.InputRow(
                    "複数選択 (checkbox):",
                    new MultiSelectInput<ポケモンタイプ>({
                        options: pokemonTypeOptions,
                        initialSelected: ["ほのお", "みず"],
                        variant: "checkbox",
                        direction: "vertical"
                    }).onChange((selected) => {
                        multiSelectState1.updateValue(JSON.stringify(selected));
                    }),
                    multiSelectState1
                ),
                // MultiSelectInput - ボタングループ
                this.InputRow(
                    "複数選択 (button):",
                    new MultiSelectInput<ポケモンタイプ>({
                        options: pokemonTypeOptions,
                        initialSelected: ["くさ"],
                        variant: "button",
                        direction: "horizontal"
                    }).onChange((selected) => {
                        multiSelectState2.updateValue(JSON.stringify(selected));
                    }),
                    multiSelectState2
                )
            ]);
    }

    /**
     * ラベル、入力、状態表示を横並びにした行を作成する。
     */
    private InputRow(label: string, inputComponent: HtmlComponentBase, stateDisplay: InputStateDisplay): DivC {
        return new DivC()
            .setStyleCSS({
                display: "grid",
                gridTemplateColumns: "200px 1fr auto",
                gap: "16px",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #eee"
            })
            .childs([
                new DivC({ text: label }).setStyleCSS({
                    fontWeight: "500",
                    color: "#666"
                }),
                inputComponent,
                stateDisplay
            ]);
    }

    // ITestPage インターフェースの実装
    public getRoot(): HtmlComponentBase {
        return this._componentRoot;
    }

    public destroy(): void {
        this.delete();
    }
}

