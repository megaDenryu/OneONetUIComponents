/**
 * バリデーションルール定義
 */
export interface ValidationRule<T> {
    validator: (value: T) => boolean | string;
    message?: string;
    priority?: number;
}

/**
 * ValidationRulesライブラリのstaticインターフェース
 */
export interface IValidationRulesStatic {
    required(message?: string): ValidationRule<any>;
    stringLength(min?: number, max?: number): ValidationRule<string | undefined>;
    email(): ValidationRule<string | undefined>;
    numberRange(min?: number, max?: number): ValidationRule<number | undefined>;
    url(): ValidationRule<string | undefined>;
    pattern(regex: RegExp, message: string): ValidationRule<string | undefined>;
    custom<T>(predicate: (value: T | undefined) => boolean, message: string): ValidationRule<T | undefined>;
}

/**
 * ValidationRulesライブラリ - 再利用可能なバリデーションルール
 */
export class ValidationRules {
    static required(message?: string): ValidationRule<any> {
        return {
            validator: (value: any) => {
                if (value === null || value === undefined || value === "") {
                    return message || "この項目は必須です";
                }
                return true;
            }
        };
    }

    static stringLength(min?: number, max?: number): ValidationRule<string | undefined> {
        return {
            validator: (value: string | undefined) => {
                if (!value) return true;
                if (min && value.length < min) {
                    return `${min}文字以上で入力してください`;
                }
                if (max && value.length > max) {
                    return `${max}文字以下で入力してください`;
                }
                return true;
            }
        };
    }

    static email(): ValidationRule<string | undefined> {
        return {
            validator: (value: string | undefined) => {
                if (!value) return true;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) || "有効なメールアドレスを入力してください";
            }
        };
    }

    static numberRange(min?: number, max?: number): ValidationRule<number | undefined> {
        return {
            validator: (value: number | undefined) => {
                if (value === undefined) return true;
                if (min !== undefined && value < min) {
                    return `${min}以上で入力してください`;
                }
                if (max !== undefined && value > max) {
                    return `${max}以下で入力してください`;
                }
                return true;
            }
        };
    }

    static url(): ValidationRule<string | undefined> {
        return {
            validator: (value: string | undefined) => {
                if (!value) return true;
                try {
                    new URL(value);
                    return true;
                } catch {
                    return "有効なURLを入力してください";
                }
            }
        };
    }

    static pattern(regex: RegExp, message: string): ValidationRule<string | undefined> {
        return {
            validator: (value: string | undefined) => {
                if (!value) return true;
                return regex.test(value) || message;
            }
        };
    }

    static custom<T>(predicate: (value: T | undefined) => boolean, message: string): ValidationRule<T | undefined> {
        return {
            validator: (value: T | undefined) => {
                return predicate(value) || message;
            }
        };
    }
}
