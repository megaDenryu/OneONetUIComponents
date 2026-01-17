import { DivC, HtmlComponentBase, LV2HtmlComponentBase, Percent長さ, Px長さ } from "SengenUI/index";
import { body_setting } from "../../AppPage/AppVoiroStudio/VoiroStudioWindowConponent/Components/BodySettingContainer/styles.css";




import { resize_handle, resize_handle_right } from "./style.css";


export class リサイズ可能サイドバー extends LV2HtmlComponentBase {
    private container: DivC;
    private rightHandle: DivC;
    private readonly minWidth: Percent長さ; // 最小幅をピクセルで定義
    private width: Percent長さ;

    private isDragging: boolean = false;
    private dragStartX: Px長さ = new Px長さ(0);
    private initialWidth: Percent長さ = new Percent長さ(0);

    // ハンドルサイズ設定
    private handleThickness: Px長さ = new Px長さ(8);

    public constructor(minWidth: Percent長さ, width: Percent長さ) {
        super();
        this.minWidth = minWidth;
        this.width = width;
        this._componentRoot = this.createComponentRoot();
        this.setupEventListeners();
        this.updateStyles();
        this.updateHandlePositions();
    }

    protected createComponentRoot(): HtmlComponentBase {
        const rootDiv = new DivC({ class: body_setting}).bind((container) => { this.container = container; }).childs([
                            new DivC({ class: [resize_handle, resize_handle_right] }).bind((handle) => { 
                                this.rightHandle = handle; 
                                // ハンドルの基本スタイルを設定
                                handle.setStyleCSS({
                                    backgroundColor: 'rgba(0, 123, 255, 0.3)',
                                    transition: 'background-color 0.2s ease',
                                });
                            }).addDivEventListener('mousedown', (event) => {
                                event.preventDefault();
                                this.isDragging = true;
                                this.dragStartX = new Px長さ(event.clientX);
                                this.initialWidth = this.width;
                                // ドラッグ中のスタイル
                                this.rightHandle.setStyleCSS({
                                    backgroundColor: 'rgba(0, 123, 255, 0.8)'
                                });
                            }).addDivEventListener('mouseover', (event) => {
                                if (!this.isDragging) {
                                    this.rightHandle.setStyleCSS({
                                        backgroundColor: 'rgba(0, 123, 255, 0.6)'
                                    });
                                }
                            }).addDivEventListener('mouseout', (event) => {
                                if (!this.isDragging) {
                                    this.rightHandle.setStyleCSS({
                                        backgroundColor: 'rgba(0, 123, 255, 0.3)'
                                    });
                                }
                            })
                        ]);
        return rootDiv;
    }

    private setupEventListeners(): void {
        // グローバルマウスイベント
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    private handleMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const currentX = new Px長さ(event.clientX);
        const deltaX = currentX.minus(this.dragStartX).multiply(1.5);
        
        // 親要素の幅を取得（ビューポート幅をフォールバックとして使用）
        const 親要素の幅 = new Px長さ(typeof window !== 'undefined' ? window.innerWidth : 1920);
        
        // 現在の幅をピクセルに変換してデルタを適用
        const 現在の幅Px = this.initialWidth.toPx(親要素の幅);
        const 新しい幅Px = 現在の幅Px.plus(deltaX);
        
        // 最小幅制約を適用
        const 最小幅Px = this.minWidth.toPx(親要素の幅);
        const 制約適用後の幅Px = new Px長さ(Math.max(最小幅Px.値, 新しい幅Px.値));
        
        // パーセントに変換して更新
        this.width = 制約適用後の幅Px.toPercent(親要素の幅);

        this.updateStyles().updateHandlePositions();
    }

    private handleMouseUp(): void {
        if (this.isDragging) {
            this.isDragging = false;
            // ドラッグ終了時にハンドルの色をデフォルトに戻す
            this.rightHandle.setStyleCSS({
                backgroundColor: 'rgba(0, 123, 255, 0.3)'
            });
        }
    }

    private updateStyles(): this {
        // コンテナの位置とサイズ設定
        this.container.setStyleCSS({
            width: this.width.toStr(),
            height: '100%', // サイドバーなので高さは100%
            position: 'relative', // ハンドルの位置設定のため
            overflowY: 'auto', // 縦スクロールを有効にする
            overflowX: 'hidden', // 横スクロールは無効
            backgroundColor: 'var(--sidebar-background, #f0f0f0)', // デフォルトの背景色
            borderRight: '1px solid var(--border-color, #262626ff)', // 右側に境界線
        });

        return this;
    }

    private updateHandlePositions(): this {
        const handleOffset = this.handleThickness.divide(2); // ハンドルのオフセットを計算
        
        // 右辺ハンドル - サイドバーの右端に配置
        const baseStyle = {
            position: 'absolute',
            right: `${-handleOffset.値}px`, // 右端から少しはみ出させる
            top: '0',
            width: this.handleThickness.toStr(),
            height: '100%',
            cursor: 'ew-resize', // 水平リサイズのカーソル
            zIndex: '1000', // 他の要素より前面に
        };

        // ドラッグ中かどうかで背景色を決定
        if (this.isDragging) {
            this.rightHandle.setStyleCSS({
                ...baseStyle,
                backgroundColor: 'rgba(0, 123, 255, 0.8)' // ドラッグ中は濃い青
            });
        } else {
            this.rightHandle.setStyleCSS({
                ...baseStyle,
                backgroundColor: 'rgba(15, 128, 249, 0.8)' // デフォルトは薄い青
            });
        }

        return this;
    }

    // 公開メソッド
    public getWidth(): Percent長さ {
        return this.width;
    }

    public setWidth(width: Percent長さ): this {
        const 親要素の幅 = new Px長さ(typeof window !== 'undefined' ? window.innerWidth : 1920);
        const 最小幅Px = this.minWidth.toPx(親要素の幅);
        const 新しい幅Px = width.toPx(親要素の幅);
        
        // 最小幅制約を適用
        if (新しい幅Px.値 >= 最小幅Px.値) {
            this.width = width;
        } else {
            this.width = this.minWidth;
        }
        
        this.updateStyles().updateHandlePositions();
        return this;
    }

    public getMinWidth(): Percent長さ {
        return this.minWidth;
    }

}
