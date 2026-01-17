import { DivC, DragMover, HtmlComponentBase, IDragAble, LV2HtmlComponentBase } from "SengenUI/index";
import { ExtendFunction } from "TypeScriptBenriKakuchou/extend";
import { 明るくて優しい色をランダムに出力 } from "TypeScriptBenriKakuchou/ExtendRandom.ts/RandomColor";




import { square_board_base, square_board_header, board_title, margin } from "./style.css";

export class SquareBoardComponent extends LV2HtmlComponentBase implements IDragAble {
    private _title: string;
    public get title(): string { return this._title; }
    public readonly dragMover: DragMover;
    public readonly id: string;
    private _headerContainer: DivC;
    private _titleElement: DivC;
    private _borderColor: string;

    constructor(
        input :{
            title: string,
            width: string | null,
            height: string | null,
            id: string | null,
            enableDrag: boolean
        }
    ) {
        super();
        this._title = input.title;
        this.id = input.id ?? ExtendFunction.uuid();
        this._borderColor = 明るくて優しい色をランダムに出力().hex;
        this._componentRoot = this.createComponentRoot();
        if (input.width !== null || input.height !== null) {
            this.setStyleCSS({
                width: input.width ?? undefined,
                height: input.height ?? undefined
            });
        }
        this.dragMover = new DragMover(this).setEnableDrag(input.enableDrag);
    }

    protected createComponentRoot(): HtmlComponentBase {
        return new DivC({ class: [square_board_base, margin] })
                    .setStyleCSS({ borderColor: this._borderColor })
                    .childs([
                        new DivC({ class: square_board_header }).bind((div) => { this._headerContainer = div; }).childs([
                            new DivC({ class: board_title, text: this.title }).bind((div) => { this._titleElement = div; })
                        ])
                    ]);
    }

    // Headerのタイトルの横にコンポーネントを追加する
    public Header(component: HtmlComponentBase): this {
        this._headerContainer.child(component);
        return this;
    }

    public setTitle(title: string): void {
        this._title = title;
        this._titleElement.setTextContent(title);
    }

    public changeSize(width: string | null, height: string | null): void {
        this.setStyleCSS({
            width: width ?? undefined,
            height: height ?? undefined
        });
    }

    public setInitialPosition(left: number, top: number): void {
        this.setStyleCSS({
            left: `${left}px`,
            top: `${top}px`
        });
    }

    
}

