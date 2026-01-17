import { HtmlComponentBase } from "SengenUI/index";


/**
 * ウィンドウコンポーネントの共通インターフェース
 * TestPageManagerと同じ仕組みでWindowを管理する
 */
export interface IWindow {
    /**
     * ウィンドウのルートコンポーネントを取得
     */
    getRoot(): HtmlComponentBase;
    
    /**
     * ウィンドウを破棄
     */
    destroy(): void;
    
    /**
     * ウィンドウの初期位置を設定
     */
    setInitialPosition(): void;
}

/**
 * ウィンドウのメタ情報
 */
export interface IWindowInfo {
    /**
     * ウィンドウの表示名
     */
    title: string;
    
    /**
     * ウィンドウの説明
     */
    description?: string;
    
    /**
     * ウィンドウのファクトリー関数
     */
    factory: () => IWindow;
}

/**
 * ウィンドウの状態管理インターフェース
 */
export interface IWindowManager {
    /**
     * ウィンドウを開く
     */
    open(id: string): void;
    
    /**
     * ウィンドウを閉じる
     */
    close(id: string): void;
    
    /**
     * ウィンドウの開閉を切り替える
     */
    toggle(id: string): void;
    
    /**
     * ウィンドウが開いているか確認
     */
    isOpen(id: string): boolean;
    
    /**
     * ウィンドウを登録
     */
    registerWindow(id: string, info: IWindowInfo): void;
}

export interface IOpenCloseCallback {
    onOpen(): void;
    onClose(): void;
}

export class OpenCloseDelegator {
    private callbacks: IOpenCloseCallback[] = [];

    public addMethod(callback: IOpenCloseCallback): this {
        this.callbacks.push(callback);
        return this;
    }

    public onOpen(): void {
        for (const callback of this.callbacks) {
            callback.onOpen();
        }
    }

    public onClose(): void {
        for (const callback of this.callbacks) {
            callback.onClose();
        }
    }
}
