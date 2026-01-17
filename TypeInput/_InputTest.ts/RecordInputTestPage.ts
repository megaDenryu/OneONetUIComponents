import { ButtonC, DivC, H1C, H2C, H3C, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";


import { ITestPage } from "../../../Examples/ITestPage";
import { RecordInput, RecordEntryTemplate } from "../RecordInput/RecordInput";
import { TextInput } from "../TextInput/TextInput";
import { NumberSliderInput } from "../NumberInput/NumberSliderInput";
import { BoolToggleSwitchInput } from "../BoolInput/BoolToggleSwitchInput";
import { EnumSelectInput } from "../EnumInput/EnumSelectInput";
import { IntTextInput } from "../NumberInput/IntTextInput";
import { ObjectInput, Property, PropertyType, PropertyOptions, ObjectProperty } from "../ObjectInput/ObjectInput";

/**
 * RecordInputTestPage - RecordInputコンポーネントのテストページ
 * 
 * 様々な型のRecordInputの使用例をデモします
 */
export class RecordInputTestPage extends LV2HtmlComponentBase implements ITestPage {
    private stringRecordInput: RecordInput<string>;
    private numberRecordInput: RecordInput<number>;
    private boolRecordInput: RecordInput<boolean>;
    private enumRecordInput: RecordInput<"low" | "medium" | "high">;
    private resultsDisplay: DivC;

    constructor() {
        super();
        this._componentRoot = this.createComponentRoot();
        console.log('✅ RecordInputTestPage initialized successfully');
    }

    public getRoot(): HtmlComponentBase {
        return this._componentRoot;
    }

    public destroy(): void {
        this.delete();
    }

    protected createComponentRoot(): HtmlComponentBase {
        this.resultsDisplay = new DivC().setStyleCSS({
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "14px",
            whiteSpace: "pre-wrap",
            marginTop: "16px",
            maxHeight: "400px",
            overflowY: "auto"
        });

        return new DivC().setStyleCSS({
                    padding: "32px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    fontFamily: "system-ui, -apple-system, sans-serif"
                }).childs([
                    new H1C({ text: "🧪 RecordInput テストページ" }).setStyleCSS({
                        marginBottom: "32px",
                        color: "#333",
                        borderBottom: "2px solid #dee2e6",
                        paddingBottom: "16px"
                    }),
                    this.createStringRecordSection(),
                    this.createNumberRecordSection(),
                    this.createBoolRecordSection(),
                    this.createEnumRecordSection(),
                    this.createTableLayoutSection(),
                    this.createObjectInputIntegrationSection(),
                    this.createResultsSection(),
                    this.createControlButtons()
                ]);
    }

    /**
     * 文字列値のRecord入力セクション
     */
    private createStringRecordSection(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }).childs([
                    new H2C({ text: "1. 文字列値のRecord<string, string>" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#495057"
                    }),
                    new DivC({ text: "環境変数やキー・値ペアの設定に使用" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#6c757d",
                        fontSize: "14px"
                    }),
                    this.createStringRecordInput()
                ]);
    }

    private createStringRecordInput(): RecordInput<string> {
        console.log("🔧 createStringRecordInput 開始");
        try {
            this.stringRecordInput = new RecordInput<string>({
                layout: "vertical",
                sectionTitle: "🔧 環境変数設定",
                minEntries: 0,
                maxEntries: 10,
                onChange: (value) => {
                    this.displayResult("文字列Record 変更", value);
                }
            }).entryTemplate(
                new RecordEntryTemplate(
                    () => new TextInput({ placeholder: "例: API_KEY" }),
                    () => new TextInput({ placeholder: "例: your-secret-key" })
                ).withOptions({
                    keyLabel: "変数名",
                    valueLabel: "設定値",
                    uniqueKeys: true
                })
            ).initialEntries({
                "API_KEY": "sk-1234567890abcdef",
                "DB_HOST": "localhost",
                "DB_PORT": "5432",
                "NODE_ENV": "development"
            });
            console.log("✅ createStringRecordInput 完了");
            return this.stringRecordInput;
        } catch (error) {
            console.error("❌ createStringRecordInput エラー:", error);
            throw error;
        }
    }

    /**
     * 数値のRecord入力セクション
     */
    private createNumberRecordSection(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }).childs([
                    new H2C({ text: "2. 数値のRecord<string, number>" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#495057"
                    }),
                    new DivC({ text: "スコアやカウンターなど数値データの管理" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#6c757d",
                        fontSize: "14px"
                    }),
                    this.createNumberRecordInput()
                ]);
    }

    private createNumberRecordInput(): RecordInput<number> {
        this.numberRecordInput = new RecordInput<number>({
            layout: "vertical",
            sectionTitle: "🎯 科目別スコア",
            onChange: (value) => {
                this.displayResult("数値Record 変更", value);
            }
        }).entryTemplate(
            new RecordEntryTemplate(
                () => new TextInput({ placeholder: "科目名" }),
                () => new NumberSliderInput({ min: 0, max: 100, step: 5 })
            ).withOptions({
                keyLabel: "科目",
                valueLabel: "スコア (0-100)"
            })
        ).initialEntries({
            "数学": 85,
            "英語": 90,
            "理科": 75,
            "国語": 80
        });

        return this.numberRecordInput;
    }

    /**
     * Boolean値のRecord入力セクション
     */
    private createBoolRecordSection(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }).childs([
                    new H2C({ text: "3. Boolean値のRecord<string, boolean>" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#495057"
                    }),
                    new DivC({ text: "機能の有効/無効フラグの管理" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#6c757d",
                        fontSize: "14px"
                    }),
                    this.createBoolRecordInput()
                ]);
    }

    private createBoolRecordInput(): RecordInput<boolean> {
        this.boolRecordInput = new RecordInput<boolean>({
            layout: "vertical",
            sectionTitle: "⚙️ 機能フラグ設定",
            onChange: (value) => {
                this.displayResult("Boolean Record 変更", value);
            }
        }).entryTemplate(
            new RecordEntryTemplate(
                () => new TextInput({ placeholder: "機能名" }),
                () => new BoolToggleSwitchInput({ initialValue: false })
            ).withOptions({
                keyLabel: "機能",
                valueLabel: "有効/無効"
            })
        ).initialEntries({
            "darkMode": true,
            "notifications": true,
            "autoSave": false,
            "analyticsTracking": false
        });

        return this.boolRecordInput;
    }

    /**
     * Enum値のRecord入力セクション
     */
    private createEnumRecordSection(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }).childs([
                    new H2C({ text: "4. Enum値のRecord<string, Enum>" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#495057"
                    }),
                    new DivC({ text: "権限レベルや優先度など選択肢が決まっているデータ" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#6c757d",
                        fontSize: "14px"
                    }),
                    this.createEnumRecordInput()
                ]);
    }

    private createEnumRecordInput(): RecordInput<"low" | "medium" | "high"> {
        this.enumRecordInput = new RecordInput<any>({
            layout: "vertical",
            sectionTitle: "🔐 リソース権限設定",
            onChange: (value) => {
                this.displayResult("Enum Record 変更", value);
            }
        }).entryTemplate(
            new RecordEntryTemplate(
                () => new TextInput({ placeholder: "リソース名" }),
                () => new EnumSelectInput({ 
                    options: [
                        { value: "low", label: "🟢 低 (読取のみ)" },
                        { value: "medium", label: "🟡 中 (読取・書込)" },
                        { value: "high", label: "🔴 高 (フル権限)" }
                    ]
                })
            ).withOptions({
                keyLabel: "リソース",
                valueLabel: "権限レベル"
            })
        ).initialEntries({
            "users": "high",
            "posts": "medium",
            "comments": "low",
            "settings": "high"
        }) as any;

        return this.enumRecordInput;
    }

    /**
     * ObjectInput統合テストセクション（CevioAI感情設定デモ）
     */
    private createObjectInputIntegrationSection(): HtmlComponentBase {
        type CevioAIEmotionData = {
            emotionName: string;
            emotionRecord: Record<string, number>;
        };

        const emotionObjectInput = new ObjectInput<CevioAIEmotionData>({ 
            layout: "vertical", 
            sectionTitle: "🎭 CevioAI風 感情設定（ObjectInput統合デモ）",
            onChange: (value) => {
                console.log("ObjectInput統合テスト - 値変更:", value);
                this.displayResult("🎭 CevioAI感情設定変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("emotionName", new TextInput({ placeholder: "キャラクター名" })),
                new PropertyOptions({ 
                    label: "キャラクター名", 
                    required: true,
                    defaultValue: "テストキャラ"
                })
            ),
            new Property(
                new PropertyType("emotionRecord", 
                    new RecordInput<number>({ 
                        layout: "table", 
                        sectionTitle: "💖 感情パラメータ",
                        uniqueKeys: true,
                        allowKeyEdit: false,
                        showAddButton: true,
                        addButtonText: "➕ 感情を追加",
                        onChange: (value) => {
                            console.log("感情レコード変更:", value);
                        }
                    }).entryTemplate(
                        new RecordEntryTemplate(
                            () => new TextInput({ placeholder: "感情名（例: 嬉しい、悲しい）" }),
                            () => new NumberSliderInput({ min: 0, max: 100, step: 1 })
                        ).withOptions({
                            keyLabel: "感情名",
                            valueLabel: "強度（0-100）",
                            uniqueKeys: true
                        })
                    ).initialEntries({
                        "普通": 100,
                        "喜び": 0,
                        "怒り": 0,
                        "悲しみ": 0,
                        "落ち着き": 0
                    })
                ),
                new PropertyOptions({ 
                    label: "感情パラメータ", 
                    required: false,
                    defaultValue: {}
                })
            )
        ]);

        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff8e1",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "2px solid #ffd54f"
                }).childs([
                    new H2C({ text: "6. ObjectInput統合テスト - CevioAI感情設定デモ" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#f57c00"
                    }),
                    new DivC({ text: "RecordInputをObjectInputのPropertyとして使用した実践例。CevioAIの感情設定を再現します。" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#e65100",
                        fontSize: "14px",
                        lineHeight: "1.6"
                    }),
                    emotionObjectInput,
                    new DivC().setStyleCSS({ marginTop: "16px" }).childs([
                        new ButtonC({ text: "🎯 感情プリセット：標準" })
                            .setStyleCSS({ 
                                marginRight: "8px",
                                padding: "8px 16px",
                                backgroundColor: "#4caf50",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            })
                            .addTypedEventListener("click", () => {
                                emotionObjectInput.setValue({
                                    emotionName: "標準キャラ",
                                    emotionRecord: { "普通": 100, "喜び": 0, "怒り": 0, "悲しみ": 0 }
                                });
                                this.displayResult("✅ プリセット適用", "標準プリセットを適用しました");
                            }),
                        new ButtonC({ text: "😊 感情プリセット：元気" })
                            .setStyleCSS({ 
                                marginRight: "8px",
                                padding: "8px 16px",
                                backgroundColor: "#ff9800",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            })
                            .addTypedEventListener("click", () => {
                                emotionObjectInput.setValue({
                                    emotionName: "元気キャラ",
                                    emotionRecord: { "普通": 20, "喜び": 80, "怒り": 0, "悲しみ": 0, "元気": 100 }
                                });
                                this.displayResult("✅ プリセット適用", "元気プリセットを適用しました");
                            }),
                        new ButtonC({ text: "😢 感情プリセット：悲しい" })
                            .setStyleCSS({ 
                                padding: "8px 16px",
                                backgroundColor: "#2196f3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            })
                            .addTypedEventListener("click", () => {
                                emotionObjectInput.setValue({
                                    emotionName: "悲しみキャラ",
                                    emotionRecord: { "普通": 10, "喜び": 0, "怒り": 0, "悲しみ": 90, "落ち込み": 70 }
                                });
                                this.displayResult("✅ プリセット適用", "悲しみプリセットを適用しました");
                            })
                    ])
                ]);
    }

    /**
     * テーブルレイアウトのセクション
     */
    private createTableLayoutSection(): HtmlComponentBase {
        const tableInput = new RecordInput<any>({
            layout: "table",
            sectionTitle: "📊 在庫管理（テーブル表示）",
            onChange: (value) => {
                this.displayResult("テーブルレイアウト 変更", value);
            }
        }).entryTemplate(
            new RecordEntryTemplate(
                () => new TextInput({ placeholder: "商品名" }),
                () => new IntTextInput({ min: 0, max: 9999 })
            ).withOptions({
                keyLabel: "商品",
                valueLabel: "在庫数"
            })
        ).initialEntries({
            "りんご": 150,
            "バナナ": 200,
            "オレンジ": 80,
            "ぶどう": 120
        });

        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }).childs([
                    new H2C({ text: "5. テーブルレイアウトデモ" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#495057"
                    }),
                    new DivC({ text: "大量データの一覧表示に適したテーブル形式" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#6c757d",
                        fontSize: "14px"
                    }),
                    tableInput
                ]);
    }

    /**
     * 結果表示セクション
     */
    private createResultsSection(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    marginBottom: "32px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }).childs([
                    new H2C({ text: "📊 変更結果" }).setStyleCSS({
                        marginBottom: "16px",
                        color: "#495057"
                    }),
                    this.resultsDisplay
                ]);
    }

    /**
     * 操作ボタン
     */
    private createControlButtons(): HtmlComponentBase {
        return new DivC().setStyleCSS({
                    display: "flex",
                    gap: "12px",
                    marginTop: "24px"
                }).childs([
                    new ButtonC({ text: "📄 全ての値を取得" }).setStyleCSS({
                        padding: "12px 24px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }).addTypedEventListener("click", () => this.getAllValues()),
                    new ButtonC({ text: "🔄 全てクリア" }).setStyleCSS({
                        padding: "12px 24px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }).addTypedEventListener("click", () => this.clearAll()),
                    new ButtonC({ text: "📝 サンプルデータセット" }).setStyleCSS({
                        padding: "12px 24px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }).addTypedEventListener("click", () => this.setSampleData())
                ]);
    }

    /**
     * 結果表示ヘルパー
     */
    private displayResult(title: string, data: any): void {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const result = `[${timestamp}] ${title}:\n${JSON.stringify(data, null, 2)}\n\n`;
        this.resultsDisplay.setTextContent(result + this.resultsDisplay.dom.element.textContent);
    }

    /**
     * 全ての値を取得
     */
    private getAllValues(): void {
        const allValues = {
            stringRecord: this.stringRecordInput.getValue(),
            numberRecord: this.numberRecordInput.getValue(),
            boolRecord: this.boolRecordInput.getValue(),
            enumRecord: this.enumRecordInput.getValue()
        };
        this.displayResult("📦 全データ取得", allValues);
        console.log("All Values:", allValues);
    }

    /**
     * 全てクリア
     */
    private clearAll(): void {
        this.stringRecordInput.clearAll();
        this.numberRecordInput.clearAll();
        this.boolRecordInput.clearAll();
        this.enumRecordInput.clearAll();
        this.displayResult("🗑️ 全データクリア", "すべてのエントリをクリアしました");
    }

    /**
     * サンプルデータをセット
     */
    private setSampleData(): void {
        this.stringRecordInput.setValue({
            "SAMPLE_KEY_1": "sample-value-1",
            "SAMPLE_KEY_2": "sample-value-2"
        });
        
        this.numberRecordInput.setValue({
            "項目A": 100,
            "項目B": 200
        });
        
        this.boolRecordInput.setValue({
            "feature1": true,
            "feature2": false
        });
        
        this.enumRecordInput.setValue({
            "resource1": "high",
            "resource2": "low"
        });
        
        this.displayResult("✅ サンプルデータセット完了", "すべてにサンプルデータを設定しました");
    }

    public delete(): void {
        this.stringRecordInput?.delete();
        this.numberRecordInput?.delete();
        this.boolRecordInput?.delete();
        this.enumRecordInput?.delete();
        super.delete();
    }
}
