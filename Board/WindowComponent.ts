import { ButtonC, DivC, Drag中値, Drag終了値, Drag開始値, HtmlComponentBase, HtmlComponentChild, LV2HtmlComponentBase, MouseWife, 位置管理 } from "SengenUI/index";





import { NormalButton } from "../Buttons/NormalButton/NormalButton";
import { OpenCloseDelegator } from "./WindowManager/IWindow";
import { characterSettingWindow, dragHandle, headerSection, scrollableContent, windowCloseButton } from "./style.css";

export class WindowComponent extends LV2HtmlComponentBase  {
    private _mouseWife: MouseWife;
    private _ドラッグハンドル: DivC;
    private _位置管理: 位置管理;
    private _ヘッダータイトル: DivC;
    private _contentContainer: DivC;
    public readonly openCloseDelegator: OpenCloseDelegator = new OpenCloseDelegator();
    constructor(options:{
        title:string,
    }) {
        super();
        this._componentRoot = this.createComponentRoot(options.title);
    }

    protected createComponentRoot(title: string): HtmlComponentBase {
        return new DivC({ class: characterSettingWindow }).bind((self) => { this._位置管理 = new 位置管理(self); }).childs([
                    // ヘッダー部分（固定）
                    new DivC({ class: headerSection }).childs([
                        new DivC({ text: title, class: dragHandle })
                            .bind((self) => {
                                this._ドラッグハンドル = self;
                                this._ヘッダータイトル = self;
                                this._mouseWife = new MouseWife(self).ドラッグ連動登録(this);
                            }),
                        new NormalButton("×", windowCloseButton)
                            .addOnClickEvent(() => { this.close(); })
                    ]),
                    // コンテンツ部分（スクロール可能）
                    new DivC({ class: scrollableContent }).bind((self) => { this._contentContainer = self; })
                ]);
    }

    /**
     * ヘッダータイトルを更新
     */
    public headerTitle(title: string): this {
        this._ヘッダータイトル.setTextContent(title);
        return this;
    }

    // コンテンツ部分に子要素を追加する
    public contents(...childrenList: ((HtmlComponentChild|undefined)[] | Iterable<HtmlComponentChild|undefined>)[]): this {
        this._contentContainer.childs(...childrenList);
        return this;
    }

    // Iドラッグに連動可能インターフェースの実装
    public onドラッグ開始(e: Drag開始値): void {
        this._位置管理.管理対象の移動を開始();
    }

    public onドラッグ中(e: Drag中値): void {
        this._位置管理.本体のあるべき位置を計算して適用する(e);
    }

    public onドラッグ終了(e: Drag終了値): void {
        // ドラッグ終了時の処理（必要に応じて）
    }

    public close(): void {
        this.openCloseDelegator.onClose();
        this.dom.hide();
    }

    public open(): void {
        this.openCloseDelegator.onOpen();
        // 初回表示時に位置を設定
        this.setInitialWindowPosition();
        this.dom.show();
    }

    // 初期位置設定のみを行う（スタイルはvanilla extractで定義される）
    public setInitialWindowPosition(): void {
        const maxWindowHeight = window.innerHeight * 0.5; // 50vh
        const centerX = window.innerWidth / 2 - 250; // 250px は max-width 500px の半分  
        const centerY = window.innerHeight / 2 - maxWindowHeight / 2; // 高さ制限を考慮した中央配置
        
        this.dom.setStyle({
            left: `${Math.max(0, centerX)}px`,
            top: `${Math.max(0, centerY)}px`,
            zIndex: "3",
        });
    }
}
