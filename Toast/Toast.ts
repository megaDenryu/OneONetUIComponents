import { ButtonC, DivC, LV2HtmlComponentBase, SpanC } from "SengenUI/index";


import {
    toastContainer,
    toastItem,
    toastItemClosing,
    toastTypes,
    toastIcon,
    toastMessage,
    toastAction,
    toastClose,
    toastProgress
} from "./style.css";

/** 通知の種類 */
export type ToastType = "success" | "error" | "warning" | "info";

/** 通知オプション */
export interface IToastOptions {
    /** 通知の種類 */
    type: ToastType;
    /** メッセージ */
    message: string;
    /** 自動消去までの時間（ミリ秒）。0で自動消去なし */
    duration?: number;
    /** アクションボタンのテキスト */
    actionText?: string;
    /** アクションボタンのコールバック */
    onAction?: () => void;
    /** 閉じるボタンを表示するか */
    showClose?: boolean;
}

/** 通知アイテムの内部管理用 */
interface IToastItem {
    id: string;
    options: IToastOptions;
    element: DivC;
    timeoutId?: number;
}

/**
 * トースト通知マネージャー
 * シングルトンパターンで全体で1つのインスタンスを共有
 */
export class ToastManager extends LV2HtmlComponentBase {
    protected _componentRoot: DivC;
    private static _instance: ToastManager | null = null;
    private _toasts: Map<string, IToastItem> = new Map();
    private _idCounter: number = 0;

    private constructor() {
        super();
        this._componentRoot = this.createComponentRoot();
        document.body.appendChild(this.dom.element);
    }

    /** シングルトンインスタンスを取得 */
    public static getInstance(): ToastManager {
        if (!ToastManager._instance) {
            ToastManager._instance = new ToastManager();
        }
        return ToastManager._instance;
    }

    protected createComponentRoot(): DivC {
        return new DivC({ class: toastContainer });
    }

    /**
     * 通知を表示
     * @returns 通知のID（後で削除するために使用可能）
     */
    public notify(options: IToastOptions): string {
        const id = `toast-${++this._idCounter}`;
        const duration = options.duration ?? this.getDefaultDuration(options.type);
        
        const element = this.createToastElement(id, options);
        this._componentRoot.child(element);
        
        const item: IToastItem = { id, options, element };
        
        // 自動消去タイマー
        if (duration > 0) {
            item.timeoutId = window.setTimeout(() => {
                this.dismiss(id);
            }, duration);
        }
        
        this._toasts.set(id, item);
        return id;
    }

    /** 通知を閉じる */
    public dismiss(id: string): void {
        const item = this._toasts.get(id);
        if (!item) return;
        
        if (item.timeoutId) {
            clearTimeout(item.timeoutId);
        }
        
        // 閉じるアニメーション
        item.element.addClass(toastItemClosing);
        
        setTimeout(() => {
            item.element.delete();
            this._toasts.delete(id);
        }, 300);
    }

    /** すべての通知を閉じる */
    public dismissAll(): void {
        for (const id of this._toasts.keys()) {
            this.dismiss(id);
        }
    }

    private createToastElement(id: string, options: IToastOptions): DivC {
        const icon = this.getIcon(options.type);
        const showClose = options.showClose ?? true;
        
        return new DivC({ class: [toastItem, toastTypes[options.type]] })
            .setStyleCSS({ position: 'relative' })
            .childs([
                new SpanC({ text: icon, class: toastIcon }),
                new SpanC({ text: options.message, class: toastMessage }),
                ...(options.actionText && options.onAction ? [
                    new ButtonC({ text: options.actionText, class: toastAction })
                        .addTypedEventListener('click', () => {
                            options.onAction!();
                            this.dismiss(id);
                        })
                ] : []),
                ...(showClose ? [
                    new ButtonC({ text: "×", class: toastClose })
                        .addTypedEventListener('click', () => this.dismiss(id))
                ] : [])
            ]);
    }

    private getIcon(type: ToastType): string {
        switch (type) {
            case "success": return "✓";
            case "error": return "✕";
            case "warning": return "⚠";
            case "info": return "ℹ";
        }
    }

    private getDefaultDuration(type: ToastType): number {
        switch (type) {
            case "success": return 3000;
            case "error": return 5000;
            case "warning": return 4000;
            case "info": return 3000;
        }
    }

    // === 便利メソッド ===

    /** 成功通知 */
    public success(message: string, options?: Partial<IToastOptions>): string {
        return this.notify({ type: "success", message, ...options });
    }

    /** エラー通知 */
    public error(message: string, options?: Partial<IToastOptions>): string {
        return this.notify({ type: "error", message, ...options });
    }

    /** 警告通知 */
    public warning(message: string, options?: Partial<IToastOptions>): string {
        return this.notify({ type: "warning", message, ...options });
    }

    /** 情報通知 */
    public info(message: string, options?: Partial<IToastOptions>): string {
        return this.notify({ type: "info", message, ...options });
    }

    /** 元に戻すアクション付きの通知 */
    public withUndo(message: string, onUndo: () => void, type: ToastType = "info"): string {
        return this.notify({
            type,
            message,
            actionText: "元に戻す",
            onAction: onUndo,
            duration: 5000
        });
    }
}

// グローバルアクセス用のヘルパー関数
export const Toast = {
    notify: (options: IToastOptions) => ToastManager.getInstance().notify(options),
    dismiss: (id: string) => ToastManager.getInstance().dismiss(id),
    dismissAll: () => ToastManager.getInstance().dismissAll(),
    success: (message: string, options?: Partial<IToastOptions>) => ToastManager.getInstance().success(message, options),
    error: (message: string, options?: Partial<IToastOptions>) => ToastManager.getInstance().error(message, options),
    warning: (message: string, options?: Partial<IToastOptions>) => ToastManager.getInstance().warning(message, options),
    info: (message: string, options?: Partial<IToastOptions>) => ToastManager.getInstance().info(message, options),
    withUndo: (message: string, onUndo: () => void, type?: ToastType) => ToastManager.getInstance().withUndo(message, onUndo, type)
};

