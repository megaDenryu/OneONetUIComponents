import { ButtonC, DivC, H1C, H2C, H3C, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";

import { ITestPage } from "../../../Examples/ITestPage";
import { ObjectInput, Property, PropertyType, PropertyOptions } from "../ObjectInput/ObjectInput";
import { ValidationRules } from "../Interfaces/Validation";
import { TextInput } from "../TextInput/TextInput";
import { NumberSliderInput } from "../NumberInput/NumberSliderInput";
import { BoolCheckboxInput } from "../BoolInput/BoolCheckboxInput";
import { BoolToggleSwitchInput } from "../BoolInput/BoolToggleSwitchInput";
import { ObjectInputStateDisplay } from "../ObjectInput/ObjectInputStateDisplay";
import { IntTextInput } from "../NumberInput/IntTextInput";

// テスト用のモデル定義
interface IBasicTestModel {
    name: string;
    age: number;
    email: string;
    isActive: boolean;
    description?: string;
}

interface IAdvancedTestModel {
    title: string;
    priority: number;
    url: string;
    tags: string[];
}

// ネストオブジェクトテスト用
interface IAddress {
    street: string;
    city: string;
    zipCode: string;
    country?: string;
}

interface ICompany {
    name: string;
    address: IAddress;
    employeeCount: number;
    founded: number;
}

interface IContactInfo {
    email: string;
    phone: string;
    website?: string;
}

interface IEmployee {
    name: string;
    position: string;
    salary: number;
    contact: IContactInfo;
    isFullTime: boolean;
}

// 深いネストオブジェクトテスト用（4階層）
interface IOrganization {
    name: string;
    headquarters: IHeadquartersInfo;
}

interface IHeadquartersInfo {
    location: IAddress;
    ceo: ICeoInfo;
}

interface ICeoInfo {
    name: string;
    age: number;
    contact: IContactInfo;
}

// リストオブジェクトテスト用
interface IProject {
    name: string;
    description: string;
    members: IEmployee[];
    tags: string[];
    priorities: number[];
}

export class ObjectInput2TestPage extends LV2HtmlComponentBase implements ITestPage {
    private basicForm: ObjectInput<IBasicTestModel>;
    private advancedForm: ObjectInput<IAdvancedTestModel>;
    private nestedForm: ObjectInput<ICompany>;
    private deepNestedForm: ObjectInput<IEmployee>;
    private recursiveNestedForm: ObjectInput<IOrganization>;
    private listForm: ObjectInput<IProject>;
    private resultsDisplay: DivC;

    constructor() {
        super();
        this._componentRoot = this.createComponentRoot();

        console.log('✅ ObjectInput2TestPage initialized successfully');
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
            new H1C({ text: "🧪 ObjectInput2 テストページ" }).setStyleCSS({
                marginBottom: "32px",
                color: "#333",
                borderBottom: "2px solid #dee2e6",
                paddingBottom: "16px"
            }),
            this.createBasicTestSection(),
            this.createAdvancedTestSection(),
            this.createValidationTestSection(),
            this.createNestedObjectSection(),
            this.createDeepNestedSection(),
            this.createRecursiveNestedSection(),
            this.createListObjectSection(),
            this.createNewFeaturesTestSection(),
            this.createResultsSection(),
            this.createControlButtons()
        ]);
    }

    private createBasicTestSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム）:",
            initialValue: {
                name: "",
                age: 25,
                email: "",
                isActive: true,
                description: ""
            }
        });

        const basicForm = this.createBasicForm(stateDisplay);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "� 基本的なObjectInput2" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            basicForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "値を取得" }).addTypedEventListener("click", () => {
                    const value = this.basicForm.getValue();
                    this.displayResult("基本フォーム getValue() 結果", value);
                }),
                new ButtonC({ text: "値を設定" }).addTypedEventListener("click", () => {
                    this.basicForm.setValue({
                        name: "テストユーザー",
                        age: 30,
                        email: "test@example.com",
                        isActive: false,
                        description: "テスト説明文"
                    });
                }),
                new ButtonC({ text: "バリデーション実行" }).addTypedEventListener("click", () => {
                    const isValid = this.basicForm.validate();
                    this.displayResult("バリデーション結果", {
                        isValid,
                        errors: isValid ? "エラーなし" : "バリデーションエラーあり"
                    });
                }),
                new ButtonC({ text: "リセット" }).addTypedEventListener("click", () => {
                    this.basicForm.setValue({
                        name: "",
                        age: 25,
                        email: "",
                        isActive: true,
                        description: ""
                    });
                }),
                new ButtonC({ text: "🧪 値整合性テスト" }).addTypedEventListener("click", () => {
                    this.testValueConsistency();
                })
            ]),
            stateDisplay
        ]);
    }

    private createBasicForm(stateDisplay: ObjectInputStateDisplay): ObjectInput<IBasicTestModel> {
        this.basicForm = new ObjectInput<IBasicTestModel>({
            layout: "vertical",
            sectionTitle: "ユーザー基本情報",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("基本フォーム 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("name", new TextInput({ placeholder: "山田太郎" })),
                new PropertyOptions({
                    label: "名前",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.stringLength(2, 50)
                    ]
                })
            ),
            new Property(
                new PropertyType("age", new NumberSliderInput({ min: 0, max: 120, step: 1 })),
                new PropertyOptions({
                    label: "年齢",
                    required: true,
                    defaultValue: 25,
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.numberRange(0, 120)
                    ]
                })
            ),
            new Property(
                new PropertyType("email", new TextInput({ placeholder: "example@example.com" })),
                new PropertyOptions({
                    label: "メールアドレス",
                    required: false,
                    defaultValue: "",
                    validations: [
                        ValidationRules.email()
                    ]
                })
            ),
            new Property(
                new PropertyType("isActive", new BoolToggleSwitchInput({ initialValue: true })),
                new PropertyOptions({
                    label: "アクティブ",
                    required: false,
                    defaultValue: true
                })
            ),
            new Property(
                new PropertyType("description", new TextInput({ placeholder: "説明を入力..." })),
                new PropertyOptions({
                    label: "説明",
                    required: false,
                    defaultValue: "",
                    validations: [
                        ValidationRules.stringLength(0, 200)
                    ]
                })
            )
        ]);

        return this.basicForm;
    }

    private createAdvancedTestSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム）:",
            initialValue: {
                title: "",
                priority: 5,
                url: "",
                tags: []
            }
        });

        const advancedForm = this.createAdvancedForm(stateDisplay);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "🚀 高度なObjectInput2" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            advancedForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "値を取得" }).addTypedEventListener("click", () => {
                    const value = this.advancedForm.getValue();
                    this.displayResult("高度フォーム getValue() 結果", value);
                }),
                new ButtonC({ text: "値を設定" }).addTypedEventListener("click", () => {
                    this.advancedForm.setValue({
                        title: "サンプルプロジェクト",
                        priority: 8,
                        url: "https://example.com",
                        tags: ["web", "frontend", "typescript"]
                    });
                }),
                new ButtonC({ text: "バリデーション実行" }).addTypedEventListener("click", () => {
                    const isValid = this.advancedForm.validate();
                    this.displayResult("バリデーション結果", {
                        isValid,
                        errors: isValid ? "エラーなし" : "バリデーションエラーあり"
                    });
                })
            ]),
            stateDisplay
        ]);
    }

    private createAdvancedForm(stateDisplay: ObjectInputStateDisplay): ObjectInput<IAdvancedTestModel> {
        this.advancedForm = new ObjectInput<IAdvancedTestModel>({
            layout: "horizontal",
            sectionTitle: "プロジェクト設定",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("高度フォーム 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("title", new TextInput({ placeholder: "プロジェクト名を入力" })),
                new PropertyOptions({
                    label: "プロジェクト名",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.stringLength(3, 100),
                        ValidationRules.pattern(/^[A-Za-z0-9\s\-_]+$/, "英数字、ハイフン、アンダースコアのみ使用可能")
                    ]
                })
            ),
            new Property(
                new PropertyType("priority", new NumberSliderInput({ min: 1, max: 10, step: 1 })),
                new PropertyOptions({
                    label: "優先度",
                    required: true,
                    defaultValue: 5,
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.numberRange(1, 10)
                    ]
                })
            ),
            new Property(
                new PropertyType("url", new TextInput({ placeholder: "https://example.com" })),
                new PropertyOptions({
                    label: "プロジェクトURL",
                    required: false,
                    defaultValue: "",
                    validations: [
                        ValidationRules.url()
                    ]
                })
            )
        ]);

        return this.advancedForm;
    }

    private createValidationTestSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム・バリデーション付き）:",
            initialValue: {
                name: "",
                age: 0,
                email: "",
                isActive: false,
                description: ""
            }
        });

        const validationForm = new ObjectInput<IBasicTestModel>({
            layout: "grid",
            sectionTitle: "バリデーション付きフォーム",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("バリデーションフォーム 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("name", new TextInput({ placeholder: "3文字以上" })),
                new PropertyOptions({
                    label: "名前",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.stringLength(3, 50)
                    ]
                })
            ),
            new Property(
                new PropertyType("age", new IntTextInput({ min: 0, max: 150 })),
                new PropertyOptions({
                    label: "年齢",
                    required: true,
                    defaultValue: 0,
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.numberRange(18, 150) // 18歳以上
                    ]
                })
            ),
            new Property(
                new PropertyType("email", new TextInput({ placeholder: "有効なメールアドレス" })),
                new PropertyOptions({
                    label: "メールアドレス",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.email()
                    ]
                })
            ),
            new Property(
                new PropertyType("isActive", new BoolCheckboxInput({ initialValue: false })),
                new PropertyOptions({
                    label: "アクティブ",
                    required: false,
                    defaultValue: false
                })
            ),
            new Property(
                new PropertyType("description", new TextInput({ placeholder: "10文字以上200文字以下" })),
                new PropertyOptions({
                    label: "説明",
                    required: false,
                    defaultValue: "",
                    validations: [
                        ValidationRules.stringLength(10, 200)
                    ]
                })
            )
        ]);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "✅ バリデーション付きObjectInput2" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            validationForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "バリデーション実行" }).addTypedEventListener("click", () => {
                    const isValid = validationForm.validate();
                    this.displayResult("バリデーション結果", {
                        isValid,
                        errors: isValid ? "エラーなし" : "バリデーションエラーあり"
                    });
                }),
                new ButtonC({ text: "無効な値を設定" }).addTypedEventListener("click", () => {
                    validationForm.setValue({
                        name: "短", // 3文字未満でエラー
                        age: 16, // 18未満でエラー
                        email: "invalid-email", // 無効なメール形式
                        isActive: false,
                        description: "短い" // 10文字未満でエラー
                    });
                })
            ]),
            stateDisplay
        ]);
    }

    private createNestedObjectSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム・2階層ネスト）:",
            initialValue: {
                name: "",
                address: {
                    street: "",
                    city: "",
                    zipCode: "",
                    country: ""
                },
                employeeCount: 10,
                founded: new Date().getFullYear()
            }
        });

        this.nestedForm = new ObjectInput<ICompany>({
            layout: "vertical",
            sectionTitle: "会社情報フォーム（ネストオブジェクト）",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("ネストオブジェクト 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("name", new TextInput({ placeholder: "株式会社〇〇" })),
                new PropertyOptions({
                    label: "会社名",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.stringLength(2, 100)
                    ]
                })
            ),
            // ネストオブジェクト（住所）
            new Property(
                new PropertyType("address", new ObjectInput<IAddress>({
                    layout: "horizontal",
                    sectionTitle: "📍 住所情報"
                }).properties([
                    new Property(
                        new PropertyType("street", new TextInput({ placeholder: "1-2-3" })),
                        new PropertyOptions({
                            label: "番地",
                            required: true,
                            defaultValue: "",
                            validations: [ValidationRules.required()]
                        })
                    ),
                    new Property(
                        new PropertyType("city", new TextInput({ placeholder: "渋谷区" })),
                        new PropertyOptions({
                            label: "市区町村",
                            required: true,
                            defaultValue: "",
                            validations: [ValidationRules.required()]
                        })
                    ),
                    new Property(
                        new PropertyType("zipCode", new TextInput({ placeholder: "123-4567" })),
                        new PropertyOptions({
                            label: "郵便番号",
                            required: true,
                            defaultValue: "",
                            validations: [
                                ValidationRules.required(),
                                ValidationRules.pattern(/^\d{3}-\d{4}$/, "123-4567の形式で入力してください")
                            ]
                        })
                    ),
                    new Property(
                        new PropertyType("country", new TextInput({ placeholder: "日本" })),
                        new PropertyOptions({
                            label: "国",
                            required: false,
                            defaultValue: "日本"
                        })
                    )
                ])),
                new PropertyOptions({
                    label: "住所",
                    required: true
                })
            ),
            new Property(
                new PropertyType("employeeCount", new IntTextInput({ min: 1 })),
                new PropertyOptions({
                    label: "従業員数",
                    required: true,
                    defaultValue: 10,
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.numberRange(1, 100000)
                    ]
                })
            ),
            new Property(
                new PropertyType("founded", new IntTextInput({ min: 1800, max: new Date().getFullYear() })),
                new PropertyOptions({
                    label: "設立年",
                    required: true,
                    defaultValue: new Date().getFullYear(),
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.numberRange(1800, new Date().getFullYear())
                    ]
                })
            )
        ]);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "🔗 ネストしたオブジェクト（2階層）" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            this.nestedForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "値を取得" }).addTypedEventListener("click", () => {
                    const value = this.nestedForm.getValue();
                    this.displayResult("ネストオブジェクト getValue()", value);
                }),
                new ButtonC({ text: "値を設定" }).addTypedEventListener("click", () => {
                    this.nestedForm.setValue({
                        name: "テスト株式会社",
                        address: {
                            street: "1-1-1",
                            city: "千代田区",
                            zipCode: "100-0001",
                            country: "日本"
                        },
                        employeeCount: 50,
                        founded: 2020
                    });
                }),
                new ButtonC({ text: "バリデーション" }).addTypedEventListener("click", () => {
                    const isValid = this.nestedForm.validate();
                    this.displayResult("ネストオブジェクト バリデーション", {
                        isValid,
                        errors: isValid ? "エラーなし" : "バリデーションエラーあり"
                    });
                }),
                new ButtonC({ text: "🧪 ネスト値テスト" }).addTypedEventListener("click", () => {
                    this.testNestedValueAccess();
                })
            ]),
            stateDisplay
        ]);
    }

    // 深いネストセクション（3階層）の追加
    private createDeepNestedSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム・3階層ネスト）:",
            initialValue: {
                name: "",
                position: "",
                salary: 0,
                contact: {
                    email: "",
                    phone: "",
                    website: ""
                },
                isFullTime: true
            }
        });

        this.deepNestedForm = new ObjectInput<IEmployee>({
            layout: "vertical",
            sectionTitle: "社員情報フォーム（深いネスト）",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("深いネスト 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("name", new TextInput({ placeholder: "山田太郎" })),
                new PropertyOptions({
                    label: "社員名",
                    required: true,
                    defaultValue: "",
                    validations: [ValidationRules.required()]
                })
            ),
            new Property(
                new PropertyType("position", new TextInput({ placeholder: "エンジニア" })),
                new PropertyOptions({
                    label: "役職",
                    required: true,
                    defaultValue: "",
                    validations: [ValidationRules.required()]
                })
            ),
            new Property(
                new PropertyType("salary", new IntTextInput({ min: 100000 })),
                new PropertyOptions({
                    label: "給与",
                    required: true,
                    defaultValue: 300000,
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.numberRange(100000, 10000000)
                    ]
                })
            ),
            // ネストオブジェクト（連絡先）
            new Property(
                new PropertyType("contact", new ObjectInput<IContactInfo>({
                    layout: "grid",
                    sectionTitle: "📞 連絡先情報"
                }).properties([
                    new Property(
                        new PropertyType("email", new TextInput({ placeholder: "example@example.com" })),
                        new PropertyOptions({
                            label: "メールアドレス",
                            required: true,
                            defaultValue: "",
                            validations: [
                                ValidationRules.required(),
                                ValidationRules.email()
                            ]
                        })
                    ),
                    new Property(
                        new PropertyType("phone", new TextInput({ placeholder: "090-1234-5678" })),
                        new PropertyOptions({
                            label: "電話番号",
                            required: true,
                            defaultValue: "",
                            validations: [
                                ValidationRules.required(),
                                ValidationRules.pattern(/^0\d{1,4}-\d{1,4}-\d{4}$/, "有効な電話番号を入力してください")
                            ]
                        })
                    ),
                    new Property(
                        new PropertyType("website", new TextInput({ placeholder: "https://example.com" })),
                        new PropertyOptions({
                            label: "ウェブサイト",
                            required: false,
                            defaultValue: "",
                            validations: [ValidationRules.url()]
                        })
                    )
                ])),
                new PropertyOptions({
                    label: "連絡先",
                    required: true
                })
            ),
            new Property(
                new PropertyType("isFullTime", new BoolToggleSwitchInput({ initialValue: true })),
                new PropertyOptions({
                    label: "正社員",
                    required: false,
                    defaultValue: true
                })
            )
        ]);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "🔗🔗 深くネストしたオブジェクト（3階層）" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            this.deepNestedForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "値を取得" }).addTypedEventListener("click", () => {
                    const value = this.deepNestedForm.getValue();
                    this.displayResult("深いネスト getValue()", value);
                }),
                new ButtonC({ text: "値を設定" }).addTypedEventListener("click", () => {
                    this.deepNestedForm.setValue({
                        name: "佐藤花子",
                        position: "シニアエンジニア",
                        salary: 500000,
                        contact: {
                            email: "sato@example.com",
                            phone: "090-5678-1234",
                            website: "https://sato.dev"
                        },
                        isFullTime: true
                    });
                }),
                new ButtonC({ text: "🧪 深いネスト値テスト" }).addTypedEventListener("click", () => {
                    this.testDeepNestedValueAccess();
                })
            ]),
            stateDisplay
        ]);
    }

    // 再帰的ネストセクション（4階層）の追加
    private createRecursiveNestedSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム・4階層再帰ネスト）:",
            initialValue: {
                name: "",
                headquarters: {
                    location: {
                        street: "",
                        city: "",
                        zipCode: "",
                        country: ""
                    },
                    ceo: {
                        name: "",
                        age: 0,
                        contact: {
                            email: "",
                            phone: "",
                            website: ""
                        }
                    }
                }
            },
            maxLines: 30
        });

        this.recursiveNestedForm = new ObjectInput<IOrganization>({
            layout: "vertical",
            sectionTitle: "組織情報フォーム（4階層再帰ネスト）",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("再帰ネスト 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("name", new TextInput({ placeholder: "グローバル株式会社" })),
                new PropertyOptions({
                    label: "組織名",
                    required: true,
                    defaultValue: "",
                    validations: [ValidationRules.required()]
                })
            ),
            // 4階層ネスト
            new Property(
                new PropertyType("headquarters", new ObjectInput<IHeadquartersInfo>({
                    layout: "vertical",
                    sectionTitle: "🏢 本部情報"
                }).properties([
                    // 3階層目：住所情報
                    new Property(
                        new PropertyType("location", new ObjectInput<IAddress>({
                            layout: "grid",
                            sectionTitle: "📍 本部住所"
                        }).properties([
                            new Property(
                                new PropertyType("street", new TextInput({ placeholder: "1-2-3" })),
                                new PropertyOptions({
                                    label: "番地",
                                    required: true,
                                    defaultValue: "",
                                    validations: [ValidationRules.required()]
                                })
                            ),
                            new Property(
                                new PropertyType("city", new TextInput({ placeholder: "東京都" })),
                                new PropertyOptions({
                                    label: "都市",
                                    required: true,
                                    defaultValue: "",
                                    validations: [ValidationRules.required()]
                                })
                            ),
                            new Property(
                                new PropertyType("zipCode", new TextInput({ placeholder: "123-4567" })),
                                new PropertyOptions({
                                    label: "郵便番号",
                                    required: true,
                                    defaultValue: "",
                                    validations: [
                                        ValidationRules.required(),
                                        ValidationRules.pattern(/^\d{3}-\d{4}$/, "123-4567の形式で入力してください")
                                    ]
                                })
                            ),
                            new Property(
                                new PropertyType("country", new TextInput({ placeholder: "日本" })),
                                new PropertyOptions({
                                    label: "国",
                                    required: false,
                                    defaultValue: "日本"
                                })
                            )
                        ])),
                        new PropertyOptions({
                            label: "住所",
                            required: true
                        })
                    ),
                    // 3階層目：CEO情報
                    new Property(
                        new PropertyType("ceo", new ObjectInput<ICeoInfo>({
                            layout: "vertical",
                            sectionTitle: "👔 CEO情報"
                        }).properties([
                            new Property(
                                new PropertyType("name", new TextInput({ placeholder: "田中一郎" })),
                                new PropertyOptions({
                                    label: "CEO名",
                                    required: true,
                                    defaultValue: "",
                                    validations: [ValidationRules.required()]
                                })
                            ),
                            new Property(
                                new PropertyType("age", new IntTextInput({ min: 25, max: 100 })),
                                new PropertyOptions({
                                    label: "年齢",
                                    required: true,
                                    defaultValue: 50,
                                    validations: [
                                        ValidationRules.required(),
                                        ValidationRules.numberRange(25, 100)
                                    ]
                                })
                            ),
                            // 4階層目：CEO連絡先
                            new Property(
                                new PropertyType("contact", new ObjectInput<IContactInfo>({
                                    layout: "horizontal",
                                    sectionTitle: "📞 CEO連絡先"
                                }).properties([
                                    new Property(
                                        new PropertyType("email", new TextInput({ placeholder: "ceo@company.com" })),
                                        new PropertyOptions({
                                            label: "メール",
                                            required: true,
                                            defaultValue: "",
                                            validations: [
                                                ValidationRules.required(),
                                                ValidationRules.email()
                                            ]
                                        })
                                    ),
                                    new Property(
                                        new PropertyType("phone", new TextInput({ placeholder: "03-1234-5678" })),
                                        new PropertyOptions({
                                            label: "電話番号",
                                            required: true,
                                            defaultValue: "",
                                            validations: [ValidationRules.required()]
                                        })
                                    ),
                                    new Property(
                                        new PropertyType("website", new TextInput({ placeholder: "https://ceo-blog.com" })),
                                        new PropertyOptions({
                                            label: "ウェブサイト",
                                            required: false,
                                            defaultValue: "",
                                            validations: [ValidationRules.url()]
                                        })
                                    )
                                ])),
                                new PropertyOptions({
                                    label: "連絡先",
                                    required: true
                                })
                            )
                        ])),
                        new PropertyOptions({
                            label: "CEO",
                            required: true
                        })
                    )
                ])),
                new PropertyOptions({
                    label: "本部",
                    required: true
                })
            )
        ]);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "🔄 再帰的ネスト（4階層）" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            this.recursiveNestedForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "値を取得" }).addTypedEventListener("click", () => {
                    const value = this.recursiveNestedForm.getValue();
                    this.displayResult("再帰ネスト getValue()", value);
                }),
                new ButtonC({ text: "値を設定" }).addTypedEventListener("click", () => {
                    this.recursiveNestedForm.setValue({
                        name: "グローバル・イノベーション株式会社",
                        headquarters: {
                            location: {
                                street: "2-3-4",
                                city: "東京都港区",
                                zipCode: "100-0004",
                                country: "日本"
                            },
                            ceo: {
                                name: "田中太郎",
                                age: 55,
                                contact: {
                                    email: "ceo@global-innovation.com",
                                    phone: "03-5678-9012",
                                    website: "https://tanaka-blog.com"
                                }
                            }
                        }
                    });
                }),
                new ButtonC({ text: "🧪 再帰ネスト値テスト" }).addTypedEventListener("click", () => {
                    this.testRecursiveNestedValueAccess();
                })
            ]),
            stateDisplay
        ]);
    }

    // リストオブジェクトセクションの追加
    private createListObjectSection(): HtmlComponentBase {
        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "📊 入力中の値（リアルタイム・リストオブジェクト）:",
            initialValue: {
                name: "",
                description: "",
                members: [],
                tags: [],
                priorities: []
            },
            maxLines: 25
        });

        // 注意：ObjectInput2がリスト処理に対応していない場合は、簡単なリスト表現を使用
        this.listForm = new ObjectInput<IProject>({
            layout: "vertical",
            sectionTitle: "プロジェクト情報（リストオブジェクト）",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("リストオブジェクト 値変更", value);
            }
        }).properties([
            new Property(
                new PropertyType("name", new TextInput({ placeholder: "新プロジェクト名" })),
                new PropertyOptions({
                    label: "プロジェクト名",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.stringLength(3, 100)
                    ]
                })
            ),
            new Property(
                new PropertyType("description", new TextInput({ placeholder: "プロジェクトの説明..." })),
                new PropertyOptions({
                    label: "説明",
                    required: true,
                    defaultValue: "",
                    validations: [
                        ValidationRules.required(),
                        ValidationRules.stringLength(10, 500)
                    ]
                })
            )
            // TODO: 配列フィールドの実装は ObjectInput2 の配列対応状況により調整
        ]);

        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "📋 リストオブジェクト（配列対応）" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            this.listForm,
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }).childs([
                new ButtonC({ text: "値を取得" }).addTypedEventListener("click", () => {
                    const value = this.listForm.getValue();
                    this.displayResult("リストオブジェクト getValue()", value);
                }),
                new ButtonC({ text: "値を設定" }).addTypedEventListener("click", () => {
                    this.listForm.setValue({
                        name: "Webアプリケーション開発",
                        description: "モダンなWebアプリケーションの開発プロジェクト",
                        members: [], // 配列の実装状況により調整
                        tags: [], // 配列の実装状況により調整
                        priorities: [] // 配列の実装状況により調整
                    });
                }),
                new ButtonC({ text: "🧪 リスト値テスト" }).addTypedEventListener("click", () => {
                    this.testListValueAccess();
                })
            ]),
            stateDisplay
        ]);
    }

    private createResultsSection(): HtmlComponentBase {
        return new DivC().childs([
            new H2C({ text: "📊 結果表示 - Results" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555"
            }),
            this.resultsDisplay
        ]);
    }

    private createControlButtons(): HtmlComponentBase {
        return new DivC().setStyleCSS({ marginBottom: "48px" }).childs([
            new H2C({ text: "🎮 総合コントロール - Global Controls" }).setStyleCSS({
                marginBottom: "16px",
                color: "#555",
                borderTop: "2px solid #dee2e6",
                paddingTop: "24px"
            }),
            new DivC().setStyleCSS({
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "24px"
            }).childs([
                new ButtonC({ text: "📋 全フォーム値取得" }).setStyleCSS({
                    padding: "12px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }).addTypedEventListener("click", () => {
                    const allValues = {
                        basic: this.basicForm?.getValue(),
                        advanced: this.advancedForm?.getValue(),
                        nested: this.nestedForm?.getValue(),
                        deepNested: this.deepNestedForm?.getValue(),
                        recursive: this.recursiveNestedForm?.getValue(),
                        list: this.listForm?.getValue()
                    };
                    this.displayResult("全フォーム値一括取得", allValues);
                }),
                new ButtonC({ text: "✅ 全バリデーション実行" }).setStyleCSS({
                    padding: "12px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }).addTypedEventListener("click", () => {
                    const validationResults = {
                        basic: this.basicForm?.validate(),
                        advanced: this.advancedForm?.validate(),
                        nested: this.nestedForm?.validate(),
                        deepNested: this.deepNestedForm?.validate(),
                        recursive: this.recursiveNestedForm?.validate(),
                        list: this.listForm?.validate()
                    };

                    const allValid = Object.values(validationResults).every(result => result === true);

                    this.displayResult("全フォームバリデーション結果", {
                        ...validationResults,
                        summary: {
                            allValid,
                            message: allValid ? "✅ 全フォームOK" : "❌ エラーのあるフォームがあります"
                        }
                    });
                }),
                new ButtonC({ text: "🔄 全フォームリセット" }).setStyleCSS({
                    padding: "12px 16px",
                    backgroundColor: "#ffc107",
                    color: "#212529",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }).addTypedEventListener("click", () => {
                    // 基本フォームのリセット
                    this.basicForm?.setValue({
                        name: "",
                        age: 25,
                        email: "",
                        isActive: true,
                        description: ""
                    });

                    // 高度フォームのリセット
                    this.advancedForm?.setValue({
                        title: "",
                        priority: 5,
                        url: "",
                        tags: []
                    });

                    // ネストフォームのリセット
                    this.nestedForm?.setValue({
                        name: "",
                        address: {
                            street: "",
                            city: "",
                            zipCode: "",
                            country: "日本"
                        },
                        employeeCount: 10,
                        founded: new Date().getFullYear()
                    });

                    this.displayResult("全フォームリセット", { message: "全てのフォームがリセットされました" });
                }),
                new ButtonC({ text: "📊 結果表示クリア" }).setStyleCSS({
                    padding: "12px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }).addTypedEventListener("click", () => {
                    this.resultsDisplay.dom.element.textContent = "";
                    console.log("結果表示をクリアしました");
                }),
                new ButtonC({ text: "🧪 総合テスト実行" }).setStyleCSS({
                    padding: "12px 16px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }).addTypedEventListener("click", () => {
                    this.runComprehensiveTests();
                }),
                new ButtonC({ text: "📊 パフォーマンステスト" }).setStyleCSS({
                    padding: "12px 16px",
                    backgroundColor: "#e83e8c",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }).addTypedEventListener("click", () => {
                    this.runPerformanceTests();
                })
            ])
        ]);
    }

    /**
     * 総合テスト実行
     */
    private runComprehensiveTests(): void {
        console.log("🧪 ObjectInput2 総合テスト開始");

        // 各種整合性テスト
        this.testValueConsistency();
        this.testNestedValueAccess();
        this.testDeepNestedValueAccess();
        this.testRecursiveNestedValueAccess();
        this.testListValueAccess();

        this.displayResult("総合テスト完了", {
            message: "全てのテストが実行されました。結果を確認してください。",
            timestamp: new Date().toISOString(),
            testsRun: [
                "値整合性テスト",
                "ネストオブジェクト値アクセステスト",
                "深いネスト値アクセステスト",
                "再帰ネスト値アクセステスト",
                "リストオブジェクト値アクセステスト"
            ]
        });
    }

    /**
     * パフォーマンステスト実行
     */
    private runPerformanceTests(): void {
        console.log("📊 ObjectInput2 パフォーマンステスト開始");

        const startTime = performance.now();

        // 大量データセット
        const testIterations = 100;
        const performanceResults: number[] = [];

        for (let i = 0; i < testIterations; i++) {
            const iterationStart = performance.now();

            // 基本フォームのセット・ゲット
            this.basicForm.setValue({
                name: `テストユーザー${i}`,
                age: 20 + (i % 80),
                email: `test${i}@example.com`,
                isActive: i % 2 === 0,
                description: `テスト説明文${i}`
            });

            const value = this.basicForm.getValue();

            const iterationEnd = performance.now();
            performanceResults.push(iterationEnd - iterationStart);
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const averageTime = performanceResults.reduce((a, b) => a + b, 0) / performanceResults.length;

        this.displayResult("パフォーマンステスト結果", {
            totalIterations: testIterations,
            totalTimeMs: Math.round(totalTime * 100) / 100,
            averageIterationTimeMs: Math.round(averageTime * 100) / 100,
            minTimeMs: Math.round(Math.min(...performanceResults) * 100) / 100,
            maxTimeMs: Math.round(Math.max(...performanceResults) * 100) / 100,
            iterationsPerSecond: Math.round(testIterations / (totalTime / 1000)),
            message: "ObjectInput2のパフォーマンス測定完了"
        });
    }

    /**
     * 結果を表示
     */
    private displayResult(title: string, data: any): void {
        const jsonString = JSON.stringify(data, null, 2);
        const timestamp = new Date().toLocaleTimeString();
        const resultText = `=== [${timestamp}] ${title} ===\n${jsonString}\n\n`;

        // 新しい結果を先頭に追加
        const currentContent = this.resultsDisplay.dom.element.textContent || "";
        this.resultsDisplay.dom.element.textContent = resultText + currentContent;

        // 結果が多すぎる場合は末尾を削除（大体10件まで保持）
        const lines = this.resultsDisplay.dom.element.textContent.split('\n');
        if (lines.length > 200) {
            this.resultsDisplay.dom.element.textContent = lines.slice(0, 150).join('\n');
        }
    }

    /**
     * 値整合性テスト
     */
    private testValueConsistency(): void {
        const testData: IBasicTestModel = {
            name: "テスト太郎",
            age: 25,
            email: "test@example.com",
            isActive: true,
            description: "テスト説明"
        };

        this.basicForm.setValue(testData);
        const retrievedValue = this.basicForm.getValue();

        const isConsistent = JSON.stringify(testData) === JSON.stringify(retrievedValue);

        this.displayResult("値整合性テスト結果", {
            testData,
            retrievedValue,
            isConsistent,
            message: isConsistent ? "✅ 値の整合性OK" : "❌ 値の整合性NG"
        });
    }

    /**
     * ネストオブジェクトの値アクセステスト
     */
    private testNestedValueAccess(): void {
        const testData: ICompany = {
            name: "テスト株式会社",
            address: {
                street: "1-2-3",
                city: "渋谷区",
                zipCode: "150-0001",
                country: "日本"
            },
            employeeCount: 42,
            founded: 2020
        };

        this.nestedForm.setValue(testData);
        const retrievedValue = this.nestedForm.getValue();

        this.displayResult("ネストオブジェクト値アクセステスト", {
            originalData: testData,
            retrievedValue,
            nestedAddressTest: {
                originalAddress: testData.address,
                retrievedAddress: retrievedValue.address,
                zipCodeMatch: testData.address.zipCode === retrievedValue.address.zipCode
            },
            isFullMatch: JSON.stringify(testData) === JSON.stringify(retrievedValue)
        });
    }

    /**
     * 深いネストオブジェクトの値アクセステスト
     */
    private testDeepNestedValueAccess(): void {
        const testData: IEmployee = {
            name: "佐藤花子",
            position: "シニアエンジニア",
            salary: 500000,
            contact: {
                email: "sato@example.com",
                phone: "090-5678-1234",
                website: "https://sato.dev"
            },
            isFullTime: true
        };

        this.deepNestedForm.setValue(testData);
        const retrievedValue = this.deepNestedForm.getValue();

        this.displayResult("深いネスト値アクセステスト（3階層）", {
            originalData: testData,
            retrievedValue,
            deepNestedTest: {
                originalContact: testData.contact,
                retrievedContact: retrievedValue.contact,
                emailMatch: testData.contact.email === retrievedValue.contact.email,
                websiteMatch: testData.contact.website === retrievedValue.contact.website
            },
            isFullMatch: JSON.stringify(testData) === JSON.stringify(retrievedValue)
        });
    }

    /**
     * 再帰的ネストオブジェクトの値アクセステスト（4階層）
     */
    private testRecursiveNestedValueAccess(): void {
        const testData: IOrganization = {
            name: "グローバル・イノベーション株式会社",
            headquarters: {
                location: {
                    street: "2-3-4",
                    city: "東京都港区",
                    zipCode: "100-0004",
                    country: "日本"
                },
                ceo: {
                    name: "田中太郎",
                    age: 55,
                    contact: {
                        email: "ceo@global-innovation.com",
                        phone: "03-5678-9012",
                        website: "https://tanaka-blog.com"
                    }
                }
            }
        };

        this.recursiveNestedForm.setValue(testData);
        const retrievedValue = this.recursiveNestedForm.getValue();

        this.displayResult("再帰ネスト値アクセステスト（4階層）", {
            originalData: testData,
            retrievedValue,
            deepestNestedTest: {
                originalCeoContact: testData.headquarters.ceo.contact,
                retrievedCeoContact: retrievedValue.headquarters.ceo.contact,
                deepEmailMatch: testData.headquarters.ceo.contact.email === retrievedValue.headquarters.ceo.contact.email,
                deepWebsiteMatch: testData.headquarters.ceo.contact.website === retrievedValue.headquarters.ceo.contact.website
            },
            locationTest: {
                originalLocation: testData.headquarters.location,
                retrievedLocation: retrievedValue.headquarters.location,
                zipCodeMatch: testData.headquarters.location.zipCode === retrievedValue.headquarters.location.zipCode
            },
            isFullMatch: JSON.stringify(testData) === JSON.stringify(retrievedValue)
        });
    }

    /**
     * リストオブジェクトの値アクセステスト
     */
    private testListValueAccess(): void {
        const testData: IProject = {
            name: "Webアプリケーション開発",
            description: "モダンなWebアプリケーションの開発プロジェクト",
            members: [], // ObjectInput2の配列対応状況により調整
            tags: [], // ObjectInput2の配列対応状況により調整
            priorities: [] // ObjectInput2の配列対応状況により調整
        };

        this.listForm.setValue(testData);
        const retrievedValue = this.listForm.getValue();

        this.displayResult("リストオブジェクト値アクセステスト", {
            originalData: testData,
            retrievedValue,
            isFullMatch: JSON.stringify(testData) === JSON.stringify(retrievedValue),
            note: "配列フィールドはObjectInput2の実装状況により制限される可能性があります"
        });
    }

    private updateResults(formType: string, value: any): void {
        this.displayResult(formType, value);
    }

    public delete(): void {
        // 全てのフォームを削除
        this.basicForm?.delete();
        this.advancedForm?.delete();
        this.nestedForm?.delete();
        this.deepNestedForm?.delete();
        this.recursiveNestedForm?.delete();
        this.listForm?.delete();

        console.log('🗑️ ObjectInput2TestPage deleted successfully');
        super.delete();
    }

    // 新機能テストセクション
    private createNewFeaturesTestSection(): HtmlComponentBase {
        interface IEnhancedTestModel {
            username: string;
            password: string;
            email: string;
            age: number;
            isVip: boolean;
            description?: string;
            website?: string;
        }

        // リアルタイム表示用ディスプレイ
        const stateDisplay = new ObjectInputStateDisplay({
            label: "🚀 新機能テスト - リアルタイム値表示:",
            initialValue: {
                username: "",
                password: "",
                email: "",
                age: 18,
                isVip: false,
                description: "",
                website: ""
            }
        });

        const enhancedForm = new ObjectInput<IEnhancedTestModel>({
            layout: "vertical",
            sectionTitle: "🚀 新機能テスト",
            onChange: (value) => {
                stateDisplay.updateValue(value);
                this.displayResult("新機能テスト", value);
            }
        }).withStateDisplay(stateDisplay) // 新機能: リアルタイム表示連携
            .setPerformanceMode(false) // 新機能: パフォーマンスモード
            .properties([
                new Property(
                    new PropertyType("username", new TextInput()),
                    new PropertyOptions({
                        label: "ユーザー名",
                        required: true,
                        placeholder: "半角英数字で入力してください", // 新機能: placeholder
                        helpText: "ユーザー名は3文字以上で設定してください", // 新機能: helpText
                        tooltip: "システム内でのユニークなIDです", // 新機能: tooltip
                        defaultValue: "",
                        validations: [
                            ValidationRules.required(),
                            ValidationRules.stringLength(3, 20),
                            ValidationRules.pattern(/^[a-zA-Z0-9_]+$/, "半角英数字とアンダースコアのみ使用できます")
                        ],
                        showErrorInline: true, // 新機能: インラインエラー表示
                        errorDisplayMode: "inline"
                    })
                ),
                new Property(
                    new PropertyType("password", new TextInput()),
                    new PropertyOptions({
                        label: "パスワード",
                        required: true,
                        placeholder: "8文字以上で入力",
                        helpText: "英数字を含む8文字以上で設定してください",
                        tooltip: "セキュリティのため定期的に変更してください",
                        defaultValue: "",
                        validations: [
                            ValidationRules.required(),
                            ValidationRules.stringLength(8, 50),
                            ValidationRules.pattern(/^(?=.*[A-Za-z])(?=.*\d)/, "英字と数字を含む必要があります")
                        ]
                    })
                ),
                new Property(
                    new PropertyType("email", new TextInput()),
                    new PropertyOptions({
                        label: "メールアドレス",
                        required: true,
                        placeholder: "example@domain.com",
                        helpText: "確認メールが送信されます",
                        defaultValue: "",
                        validations: [
                            ValidationRules.required(),
                            ValidationRules.email()
                        ]
                    })
                ),
                new Property(
                    new PropertyType("age", new IntTextInput()),
                    new PropertyOptions({
                        label: "年齢",
                        required: true,
                        helpText: "18歳以上である必要があります",
                        defaultValue: 18,
                        validations: [
                            ValidationRules.required(),
                            ValidationRules.numberRange(18, 120)
                        ]
                    })
                ),
                new Property(
                    new PropertyType("isVip", new BoolToggleSwitchInput({ initialValue: false })),
                    new PropertyOptions({
                        label: "VIPメンバー",
                        required: false,
                        helpText: "VIPメンバーになると特別な機能が利用できます",
                        tooltip: "月額料金が発生します",
                        defaultValue: false
                    })
                ),
                new Property(
                    new PropertyType("description", new TextInput()),
                    new PropertyOptions({
                        label: "自己紹介",
                        required: false,
                        placeholder: "簡単に自己紹介してください...",
                        helpText: "プロフィールに表示されます（任意）",
                        defaultValue: "",
                        validations: [
                            ValidationRules.stringLength(0, 500)
                        ]
                    })
                ),
                new Property(
                    new PropertyType("website", new TextInput()),
                    new PropertyOptions({
                        label: "ウェブサイト",
                        required: false,
                        placeholder: "https://your-website.com",
                        helpText: "個人サイトやブログのURL（任意）",
                        defaultValue: "",
                        validations: [
                            ValidationRules.url()
                        ]
                    })
                )
            ])
            // 新機能: 条件付き表示の設定
            .addConditionalDisplay("website", (value) => {
                return value.isVip === true; // VIPメンバーの場合のみウェブサイトフィールドを表示
            });

        return new DivC().setStyleCSS({
            marginBottom: "48px",
            padding: "24px",
            border: "2px solid #e3f2fd",
            borderRadius: "12px",
            backgroundColor: "#fafafa"
        }).childs([
            new H2C({ text: "🚀 新機能テスト（PropertyOptions拡張・エラー表示・条件付き表示・パフォーマンス最適化）" }).setStyleCSS({
                marginBottom: "24px",
                color: "#1976d2"
            }),
            new DivC().setStyleCSS({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                alignItems: "start"
            }).childs([
                new DivC().childs([
                    new H3C({ text: "📝 フォーム" }),
                    enhancedForm
                ]),
                new DivC().childs([
                    stateDisplay,
                    new DivC().setStyleCSS({
                        marginTop: "16px",
                        padding: "12px",
                        backgroundColor: "#e8f5e8",
                        borderRadius: "6px",
                        fontSize: "14px"
                    }).childs([
                        new H3C({ text: "✨ 実装済み新機能" }).setStyleCSS({ fontSize: "16px", marginBottom: "8px" }),
                        new DivC().setTextContent(`
• Placeholder表示機能
• HelpText表示機能  
• Tooltip機能
• インラインエラー表示
• リアルタイムバリデーション
• 条件付き表示（VIP時のみウェブサイト表示）
• パフォーマンス最適化（デバウンス）
• リアルタイム値表示連携
                                `).setStyleCSS({ whiteSpace: "pre-line" })
                    ])
                ])
            ]),
            new DivC().setStyleCSS({
                marginTop: "16px",
                display: "flex",
                gap: "12px"
            }).childs([
                new ButtonC({ text: "🧪 バリデーションテスト", class: [] })
                    .addTypedEventListener("click", () => {
                        const isValid = enhancedForm.validate();
                        this.displayResult("新機能 バリデーション結果", {
                            isValid: isValid,
                            currentValue: enhancedForm.getValue(),
                            timestamp: new Date().toISOString()
                        });
                    }),
                new ButtonC({ text: "🚀 パフォーマンステスト", class: [] })
                    .addTypedEventListener("click", () => {
                        const startTime = performance.now();
                        enhancedForm.setPerformanceMode(true);
                        // 大量の値変更をシミュレート
                        for (let i = 0; i < 100; i++) {
                            enhancedForm.setValue({ age: 18 + i });
                        }
                        const endTime = performance.now();
                        this.displayResult("パフォーマンステスト結果", {
                            executionTime: `${endTime - startTime}ms`,
                            iterations: 100,
                            performanceMode: true
                        });
                        enhancedForm.setPerformanceMode(false);
                    }),
                new ButtonC({ text: "🔄 値リセット", class: [] })
                    .addTypedEventListener("click", () => {
                        enhancedForm.setValue({
                            username: "",
                            password: "",
                            email: "",
                            age: 18,
                            isVip: false,
                            description: "",
                            website: ""
                        });
                    })
            ])
        ]);
    }

    // ITestPageインターフェースの実装
    public getRoot(): HtmlComponentBase {
        return this._componentRoot;
    }

    public destroy(): void {
        this.delete();
    }
}
