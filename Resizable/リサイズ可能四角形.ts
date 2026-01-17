import { DivC, HtmlComponentBase, LV2HtmlComponentBase } from "SengenUI/index";



import { resizable_rectangle_container } from "./style.css";
import { resizable_rectangle } from "./style.css";
import { resize_handle } from "./style.css";
import { resize_handle_top } from "./style.css";
import { resize_handle_bottom } from "./style.css";
import { resize_handle_left } from "./style.css";
import { resize_handle_right } from "./style.css";
import { resize_handle_corner } from "./style.css";
import { resize_handle_top_left } from "./style.css";
import { resize_handle_top_right } from "./style.css";
import { resize_handle_bottom_left } from "./style.css";
import { resize_handle_bottom_right } from "./style.css";

export interface リサイズ可能四角形Options {
    class?: string | string[], 
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    minWidth?: number;
    minHeight?: number;
    handleThickness?: number;
    cornerSize?: number;
}

// ハンドル表示設定の型定義
export interface HandleVisibility {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
}

// ハンドル有効/無効設定の型定義
export interface HandleEnabled {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
}

/**
 * 四角形の４辺と頂点に見えないハンドルのエレメントがついていてそれをドラッグすると見えている四角形の大きさが変わる。
 */
export class リサイズ可能四角形 extends LV2HtmlComponentBase {
    private container: DivC;
    private rectangle: DivC;
    
    // リサイズハンドル
    private topHandle: DivC;
    private bottomHandle: DivC;
    private leftHandle: DivC;
    private rightHandle: DivC;
    private topLeftHandle: DivC;
    private topRightHandle: DivC;
    private bottomLeftHandle: DivC;
    private bottomRightHandle: DivC;

    private width: number;
    private height: number;
    private x: number;
    private y: number;
    private minWidth: number;
    private minHeight: number;

    // ハンドルサイズ設定
    private handleThickness: number = 8;
    private cornerSize: number = 5;

    // ハンドルの有効/無効状態
    private handleEnabled: HandleEnabled = {
        top: true,
        bottom: true,
        left: true,
        right: true,
        topLeft: true,
        topRight: true,
        bottomLeft: true,
        bottomRight: true
    };

    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private initialWidth = 0;
    private initialHeight = 0;
    private initialX = 0;
    private initialY = 0;
    private currentHandle: string | null = null;

    constructor(options?: リサイズ可能四角形Options) {
        super();
        
        this.width = options?.width ?? 200;
        this.height = options?.height ?? 150;
        this.x = options?.x ?? 0;
        this.y = options?.y ?? 0;
        this.minWidth = options?.minWidth ?? 50;
        this.minHeight = options?.minHeight ?? 50;
        this.handleThickness = options?.handleThickness ?? 8;
        this.cornerSize = options?.cornerSize ?? 8;
        this._componentRoot = this.createComponentRoot().addClass(options?.class ?? []);
        this.updateStyles();
        this.setupEventListeners();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const rootDiv = new DivC({ class: resizable_rectangle_container }).bind((container) => { this.container = container; }).childs([
                            // メインの四角形
                            new DivC({ class: resizable_rectangle }).bind((rect) => { this.rectangle = rect; }),
                            // エッジハンドル
                            new DivC({ class: [resize_handle, resize_handle_top] }).bind((handle) => { this.topHandle = handle; }),
                            new DivC({ class: [resize_handle, resize_handle_bottom] }).bind((handle) => { this.bottomHandle = handle; }),
                            new DivC({ class: [resize_handle, resize_handle_left] }).bind((handle) => { this.leftHandle = handle; }),
                            new DivC({ class: [resize_handle, resize_handle_right] }).bind((handle) => { this.rightHandle = handle; }),

                            // コーナーハンドル
                            new DivC({ class: [resize_handle, resize_handle_corner, resize_handle_top_left] }).bind((handle) => { this.topLeftHandle = handle; }),
                            new DivC({ class: [resize_handle, resize_handle_corner, resize_handle_top_right] }).bind((handle) => { this.topRightHandle = handle; }),
                            new DivC({ class: [resize_handle, resize_handle_corner, resize_handle_bottom_left] }).bind((handle) => { this.bottomLeftHandle = handle; }),
                            new DivC({ class: [resize_handle, resize_handle_corner, resize_handle_bottom_right] }).bind((handle) => { this.bottomRightHandle = handle; })
                        ]);
         return rootDiv;
    }

    private setupEventListeners(): void {
        // 各ハンドルにマウスダウンイベントを設定
        this.setupHandleEvents(this.topHandle, 'top');
        this.setupHandleEvents(this.bottomHandle, 'bottom');
        this.setupHandleEvents(this.leftHandle, 'left');
        this.setupHandleEvents(this.rightHandle, 'right');
        this.setupHandleEvents(this.topLeftHandle, 'top-left');
        this.setupHandleEvents(this.topRightHandle, 'top-right');
        this.setupHandleEvents(this.bottomLeftHandle, 'bottom-left');
        this.setupHandleEvents(this.bottomRightHandle, 'bottom-right');

        // グローバルマウスイベント
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    private setupHandleEvents(handle: DivC, handleType: string): void {
        handle.addDivEventListener('mousedown', (event) => {
            // ハンドルが無効の場合は処理しない
            if (!this.isHandleEnabled(handleType)) {
                return;
            }
            
            event.preventDefault();
            this.isDragging = true;
            this.currentHandle = handleType;
            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;
            this.initialWidth = this.width;
            this.initialHeight = this.height;
            this.initialX = this.x;
            this.initialY = this.y;
        });
    }

    private isHandleEnabled(handleType: string): boolean {
        const handleMap: { [key: string]: keyof HandleEnabled } = {
            'top': 'top',
            'bottom': 'bottom',
            'left': 'left',
            'right': 'right',
            'top-left': 'topLeft',
            'top-right': 'topRight',
            'bottom-left': 'bottomLeft',
            'bottom-right': 'bottomRight'
        };
        
        const enabledKey = handleMap[handleType];
        return enabledKey ? (this.handleEnabled[enabledKey] ?? true) : true;
    }

    private handleMouseMove(event: MouseEvent): void {
        if (!this.isDragging || !this.currentHandle) return;

        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;

        let newWidth = this.initialWidth;
        let newHeight = this.initialHeight;
        let newX = this.initialX;
        let newY = this.initialY;

        switch (this.currentHandle) {
            case 'top':
                newHeight = Math.max(this.minHeight, this.initialHeight - deltaY);
                newY = this.initialY + (this.initialHeight - newHeight);
                break;
            case 'bottom':
                newHeight = Math.max(this.minHeight, this.initialHeight + deltaY);
                break;
            case 'left':
                newWidth = Math.max(this.minWidth, this.initialWidth - deltaX);
                newX = this.initialX + (this.initialWidth - newWidth);
                break;
            case 'right':
                newWidth = Math.max(this.minWidth, this.initialWidth + deltaX);
                break;
            case 'top-left':
                newWidth = Math.max(this.minWidth, this.initialWidth - deltaX);
                newHeight = Math.max(this.minHeight, this.initialHeight - deltaY);
                newX = this.initialX + (this.initialWidth - newWidth);
                newY = this.initialY + (this.initialHeight - newHeight);
                break;
            case 'top-right':
                newWidth = Math.max(this.minWidth, this.initialWidth + deltaX);
                newHeight = Math.max(this.minHeight, this.initialHeight - deltaY);
                newY = this.initialY + (this.initialHeight - newHeight);
                break;
            case 'bottom-left':
                newWidth = Math.max(this.minWidth, this.initialWidth - deltaX);
                newHeight = Math.max(this.minHeight, this.initialHeight + deltaY);
                newX = this.initialX + (this.initialWidth - newWidth);
                break;
            case 'bottom-right':
                newWidth = Math.max(this.minWidth, this.initialWidth + deltaX);
                newHeight = Math.max(this.minHeight, this.initialHeight + deltaY);
                break;
        }

        this.width = newWidth;
        this.height = newHeight;
        this.x = newX;
        this.y = newY;

        this.updateStyles();
    }

    private handleMouseUp(): void {
        this.isDragging = false;
        this.currentHandle = null;
    }

    private updateStyles(): void {
        // コンテナの位置とサイズ設定
        this.container.setStyleCSS({
            width: `${this.width + 20}px`,
            height: `${this.height + 20}px`,
            left: `${this.x}px`,
            top: `${this.y}px`
        });

        // メイン四角形のサイズ設定
        this.rectangle.setStyleCSS({
            width: `${this.width}px`,
            height: `${this.height}px`
        });

        // ハンドルの位置設定
        this.updateHandlePositions();
    }

    private updateHandlePositions(): void {
        const handleOffset = this.handleThickness / 2;
        const cornerOffset = this.cornerSize / 2;

        // エッジハンドル - 辺全体に伸ばす
        // 上辺ハンドル
        this.topHandle.setStyleCSS({
            left: `${10}px`,
            top: `${10 - handleOffset}px`,
            width: `${this.width}px`,
            height: `${this.handleThickness}px`
        });

        // 下辺ハンドル
        this.bottomHandle.setStyleCSS({
            left: `${10}px`,
            top: `${10 + this.height - handleOffset}px`,
            width: `${this.width}px`,
            height: `${this.handleThickness}px`
        });

        // 左辺ハンドル
        this.leftHandle.setStyleCSS({
            left: `${10 - handleOffset}px`,
            top: `${10}px`,
            width: `${this.handleThickness}px`,
            height: `${this.height}px`
        });

        // 右辺ハンドル
        this.rightHandle.setStyleCSS({
            left: `${10 + this.width - handleOffset}px`,
            top: `${10}px`,
            width: `${this.handleThickness}px`,
            height: `${this.height}px`
        });

        // コーナーハンドル - 少し大きめに
        this.topLeftHandle.setStyleCSS({
            left: `${10 - cornerOffset}px`,
            top: `${10 - cornerOffset}px`,
            width: `${this.cornerSize}px`,
            height: `${this.cornerSize}px`
        });

        this.topRightHandle.setStyleCSS({
            left: `${10 + this.width - cornerOffset}px`,
            top: `${10 - cornerOffset}px`,
            width: `${this.cornerSize}px`,
            height: `${this.cornerSize}px`
        });

        this.bottomLeftHandle.setStyleCSS({
            left: `${10 - cornerOffset}px`,
            top: `${10 + this.height - cornerOffset}px`,
            width: `${this.cornerSize}px`,
            height: `${this.cornerSize}px`
        });

        this.bottomRightHandle.setStyleCSS({
            left: `${10 + this.width - cornerOffset}px`,
            top: `${10 + this.height - cornerOffset}px`,
            width: `${this.cornerSize}px`,
            height: `${this.cornerSize}px`
        });

        // 有効/無効状態に応じてスタイルを更新
        this.updateHandleEnabledStates();
    }

    private updateHandleEnabledStates(): void {
        const handleMap = {
            top: this.topHandle,
            bottom: this.bottomHandle,
            left: this.leftHandle,
            right: this.rightHandle,
            topLeft: this.topLeftHandle,
            topRight: this.topRightHandle,
            bottomLeft: this.bottomLeftHandle,
            bottomRight: this.bottomRightHandle
        };

        Object.entries(this.handleEnabled).forEach(([handleName, isEnabled]) => {
            const handle = handleMap[handleName as keyof HandleEnabled];
            if (handle) {
                if (isEnabled) {
                    // 有効状態: 通常のスタイル
                    handle.setStyleCSS({
                        pointerEvents: 'auto',
                        cursor: this.getHandleCursor(handleName as keyof HandleEnabled)
                    });
                } else {
                    // 無効状態: マウスイベントを無効化し、視覚的に無効であることを示す
                    handle.setStyleCSS({
                        pointerEvents: 'none',
                        cursor: 'default',
                        opacity: '0.3'
                    });
                }
            }
        });
    }

    private getHandleCursor(handleName: keyof HandleEnabled): string {
        const cursorMap: { [key in keyof HandleEnabled]: string } = {
            top: 'n-resize',
            bottom: 's-resize',
            left: 'w-resize',
            right: 'e-resize',
            topLeft: 'nw-resize',
            topRight: 'ne-resize',
            bottomLeft: 'sw-resize',
            bottomRight: 'se-resize'
        };
        return cursorMap[handleName] || 'default';
    }

    // 公開メソッド
    public getSize(): { width: number; height: number } {
        return { width: this.width, height: this.height };
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public setSize(width: number, height: number): void {
        this.width = Math.max(this.minWidth, width);
        this.height = Math.max(this.minHeight, height);
        this.updateStyles();
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.updateStyles();
    }

    /**
     * ハンドルのサイズを設定します
     * @param handleThickness エッジハンドルの厚み
     * @param cornerSize コーナーハンドルのサイズ
     */
    public setHandleSize(handleThickness?: number, cornerSize?: number): void {
        if (handleThickness !== undefined) {
            this.handleThickness = Math.max(1, handleThickness);
        }
        if (cornerSize !== undefined) {
            this.cornerSize = Math.max(1, cornerSize);
        }
        this.updateHandlePositions();
    }

    /**
     * 現在のハンドルサイズを取得します
     */
    public getHandleSize(): { handleThickness: number; cornerSize: number } {
        return {
            handleThickness: this.handleThickness,
            cornerSize: this.cornerSize
        };
    }

    /**
     * 個別ハンドルの表示/非表示を制御します
     * @param visibility 各ハンドルの表示設定。未指定のハンドルは現在の状態を維持
     * @param opacity 表示時の透明度（デフォルト: 0.7）
     */
    public setHandleVisibility(visibility: HandleVisibility, opacity: number = 0.7): this {
        const handleMap = {
            top: this.topHandle,
            bottom: this.bottomHandle,
            left: this.leftHandle,
            right: this.rightHandle,
            topLeft: this.topLeftHandle,
            topRight: this.topRightHandle,
            bottomLeft: this.bottomLeftHandle,
            bottomRight: this.bottomRightHandle
        };

        Object.entries(visibility).forEach(([handleName, isVisible]) => {
            const handle = handleMap[handleName as keyof HandleVisibility];
            if (handle && isVisible !== undefined) {
                // 無効なハンドルは表示されていても操作できない
                handle.setStyleCSS({
                    opacity: isVisible ? opacity.toString() : '0'
                });
            }
        });
        return this
    }

    /**
     * 個別ハンドルの有効/無効を制御します
     * @param enabled 各ハンドルの有効設定。未指定のハンドルは現在の状態を維持
     */
    public setHandleEnabled(enabled: HandleEnabled): this {
        // 現在の状態を更新
        Object.entries(enabled).forEach(([handleName, isEnabled]) => {
            if (isEnabled !== undefined) {
                (this.handleEnabled as any)[handleName] = isEnabled;
            }
        });

        // 見た目とイベント処理を更新
        this.updateHandleEnabledStates();
        return this;
    }

    /**
     * 現在のハンドル有効状態を取得します
     */
    public getHandleEnabled(): HandleEnabled {
        return { ...this.handleEnabled };
    }

    /**
     * 全ハンドルを表示します（レガシー互換性のため残存）
     * @param opacity 表示時の透明度（デフォルト: 0.7）
     */
    public showHandles(opacity: number = 0.7): this {
        this.setHandleVisibility({
            top: true,
            bottom: true,
            left: true,
            right: true,
            topLeft: true,
            topRight: true,
            bottomLeft: true,
            bottomRight: true
        }, opacity);
        return this;
    }

    /**
     * 全ハンドルを非表示にします（レガシー互換性のため残存）
     */
    public hideHandles(): this {
        return this.setHandleVisibility({
            top: false,
            bottom: false,
            left: false,
            right: false,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        });
    }

    /**
     * エッジハンドルのみを表示します
     * @param opacity 表示時の透明度（デフォルト: 0.7）
     */
    public showEdgeHandles(opacity: number = 0.7): this {
        return this.setHandleVisibility({
            top: true,
            bottom: true,
            left: true,
            right: true,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        }, opacity);
    }

    /**
     * コーナーハンドルのみを表示します
     * @param opacity 表示時の透明度（デフォルト: 0.7）
     */
    public showCornerHandles(opacity: number = 0.7): this {
        return this.setHandleVisibility({
            top: false,
            bottom: false,
            left: false,
            right: false,
            topLeft: true,
            topRight: true,
            bottomLeft: true,
            bottomRight: true
        }, opacity);
    }

    /**
     * 全ハンドルを有効にします
     */
    public enableAllHandles(): this {
        return this.setHandleEnabled({
            top: true,
            bottom: true,
            left: true,
            right: true,
            topLeft: true,
            topRight: true,
            bottomLeft: true,
            bottomRight: true
        });
    }

    /**
     * 全ハンドルを無効にします
     */
    public disableAllHandles(): this {
        return this.setHandleEnabled({
            top: false,
            bottom: false,
            left: false,
            right: false,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        });
    }

    /**
     * エッジハンドルのみを有効にします（サイドバー等での水平/垂直リサイズ用）
     */
    public enableEdgeHandlesOnly(): this {
        return this.setHandleEnabled({
            top: true,
            bottom: true,
            left: true,
            right: true,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        });
    }

    /**
     * コーナーハンドルのみを有効にします（比率保持リサイズ用）
     */
    public enableCornerHandlesOnly(): this {
        return this.setHandleEnabled({
            top: false,
            bottom: false,
            left: false,
            right: false,
            topLeft: true,
            topRight: true,
            bottomLeft: true,
            bottomRight: true
        });
    }

    /**
     * 右端ハンドルのみを有効にします（サイドバー等での幅調整用）
     */
    public enableRightHandleOnly(): this {
        return this.setHandleEnabled({
            top: false,
            bottom: false,
            left: false,
            right: true,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        }).setHandleVisibility({
            top: false,
            bottom: false,
            left: false,
            right: true,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        })
    }

    /**
     * 下端ハンドルのみを有効にします（高さ調整用）
     */
    public enableBottomHandleOnly(): this {
        return this.setHandleEnabled({
            top: false,
            bottom: true,
            left: false,
            right: false,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        });
    }
}
