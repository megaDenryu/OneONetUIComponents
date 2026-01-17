import { DivC, HtmlComponentBase, HtmlElementProxy, LV2HtmlComponentBase, Percent長さ, Px長さ } from "SengenUI/index";
import { divideVectorN, dotVectorN, minusVectorN, plusVectorN, timesVectorN, VectorN, VectorNと見なせる } from "../../Math/LinearAlgebra/vector";





export * from "./style.css";
import { 上下ハンドルbase, 上下ハンドル色紫, 上下ハンドル色赤, 上下ハンドル色青, 上下ハンドルランダムカラー, ハンドル形状横フル } from "./style.css";
import { IVerticalLayoutSyncController } from "./IWidthPercentageController";


/**
 * 上下方向にドラッグで移動できるハンドル。
 * 左右ハンドルと同様の仕組みで縦方向のリサイズを実現する。
 * 
 * Q :ハンドルのcssでpositionをrelativeにした時、ハンドルをつかんでからマウスを少し動かすと、ちょっとだけハンドルが下にずれてから始まります。absoluteの時はそんなことなく滑らかに動くのですが、なぜでしょう。
 * A : この現象は、CSSのposition: relativeとposition: absoluteの動作の違いによるものです。
 * position: absoluteを使うのが一般的です。
 */
export class 上下ハンドル extends LV2HtmlComponentBase {
    private isDragging: boolean;
    private _dyで操作されるもの?: dyで操作されるもの;
    private _verticalLayoutSyncController?: IVerticalLayoutSyncController;
    private 直前のハンドルの点: 上下ハンドルの点;
    private minPercent: Percent長さ;
    private maxPercent: Percent長さ;
    private 現在のパーセント: Percent長さ; // ウィンドウリサイズ時に使用
    private resizeHandler: () => void; // リサイズイベントハンドラーの参照を保持

    public constructor(seed: { dyで操作されるもの?: dyで操作されるもの, verticalLayoutSyncController?: IVerticalLayoutSyncController, minPercent: Percent長さ, maxPercent: Percent長さ, initialPercent: Percent長さ }) {
        super();
        this._componentRoot = this.createComponentRoot();
        this._dyで操作されるもの = seed.dyで操作されるもの;
        this._verticalLayoutSyncController = seed.verticalLayoutSyncController;
        this.minPercent = seed.minPercent;
        this.maxPercent = seed.maxPercent;
        this.isDragging = false;
        this.現在のパーセント = seed.initialPercent;

        // ウィンドウリサイズ時にハンドル位置を更新
        this.resizeHandler = () => this.ハンドル位置を更新(this.パーセントからハンドルの点を生成(this.現在のパーセント));
        window.addEventListener('resize', this.resizeHandler);
    }

    protected createComponentRoot(): HtmlComponentBase {
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('mouseup', (event) => { this.dragStartEnd(false); });
        return new DivC({ class: 上下ハンドルbase })
            .addDivEventListener("mouseover", (event) => { })
            .addDivEventListener('mousedown', (event) => { event.preventDefault(); this.dragStartEnd(true) })
            .addDivEventListener('mousemove', (event) => { this.onMouseMove(event); })
            .addDivEventListener('mouseup', (event) => { this.dragStartEnd(false) });
    }

    protected createDomProxy(): HtmlElementProxy {
        return this._componentRoot.dom;
    }

    public delete(): void {
        // ウィンドウリサイズイベントリスナーを削除
        window.removeEventListener('resize', this.resizeHandler);
        super.delete();
    }

    /**
     * ハンドルの点を受け取ってハンドル位置を更新する（共通処理）
     */
    private ハンドル位置を更新(新しいハンドルの点: 上下ハンドルの点): void {
        this.現在のパーセント = 新しいハンドルの点.y_percent;
        this.setStyleCSS({ top: 新しいハンドルの点.y_percent.toCssValue() });
        this.直前のハンドルの点 = 新しいハンドルの点;
        this._dyで操作されるもの?.inputDy(新しいハンドルの点.dy);
        this._verticalLayoutSyncController?.updateLayoutFromHandlePosition(新しいハンドルの点.y_percent);
    }

    /**
     * パーセンテージからハンドルの点を生成する
     */
    private パーセントからハンドルの点を生成(percent: Percent長さ): 上下ハンドルの点 {
        const clampedPercent = this.clampPercent(percent);
        const 親の高さ = this.dom.get親要素のコンテキスト().height;
        return new 上下ハンドルの点(clampedPercent.toPx(親の高さ), clampedPercent, new Px長さ(0));
    }

    /**
     * マウスイベントからハンドルの点を生成する
     */
    private マウスイベントからハンドルの点を生成(event: MouseEvent): 上下ハンドルの点 {
        const currentY = new Px長さ(event.clientY);
        const dy = currentY.minus(this.直前のハンドルの点.y);
        const 親の高さ = this.dom.get親要素のコンテキスト().height;
        const clampedPercent = this.clampPercent(currentY.toPercent(親の高さ));
        return new 上下ハンドルの点(clampedPercent.toPx(親の高さ), clampedPercent, dy);
    }

    /**
     * パーセンテージを指定範囲内に制限する
     */
    private clampPercent(percent: Percent長さ): Percent長さ {
        const clampedValue = Math.max(this.minPercent.値, Math.min(this.maxPercent.値, percent.値));
        return new Percent長さ(clampedValue);
    }

    private onMouseMove(event: MouseEvent) {
        if (this.isDragging == true && event.buttons === 1) { // 左クリックが押されている場合
            const 新しいハンドルの点 = this.マウスイベントからハンドルの点を生成(event);
            this.ハンドル位置を更新(新しいハンドルの点);
        }
    }

    public setHandleColor(color: "red" | "blue" | "purple" | "randomColor"): this {
        this.removeClass([上下ハンドル色赤, 上下ハンドル色青, 上下ハンドル色紫, 上下ハンドルランダムカラー]);
        switch (color) {
            case "red": this.addClass(上下ハンドル色赤); break;
            case "blue": this.addClass(上下ハンドル色青); break;
            case "purple": this.addClass(上下ハンドル色紫); break;
            case "randomColor": this.addClass(上下ハンドルランダムカラー); break;
        }
        return this;
    }

    public setHandleSize(size: "100%"): this {
        switch (size) {
            case "100%": this.addClass(ハンドル形状横フル); break;
        }
        return this;
    }

    private dragStartEnd(isStart: boolean) {
        this.isDragging = isStart;
        switch (isStart) {
            case true: console.log("上下ドラッグ開始"); break;
            case false: console.log("上下ドラッグ終了"); break;
        }
    }

    public パーセンテージでハンドルを直接指定(initialPercent: Percent長さ): this {
        const 新しいハンドルの点 = this.パーセントからハンドルの点を生成(initialPercent);
        this.ハンドル位置を更新(新しいハンドルの点);
        this._verticalLayoutSyncController?.updateLayoutFromHandlePosition(新しいハンドルの点.y_percent);
        return this;
    }

}


export interface dyで操作されるもの {
    inputDy(diffHeight: Px長さ): void;
}

export class 上下ハンドルの点 implements VectorNと見なせる<上下ハンドルの点> {
    public readonly y: Px長さ;
    public readonly y_percent: Percent長さ;
    public readonly dy: Px長さ;
    constructor(y: Px長さ, y_percent: Percent長さ, dy: Px長さ) {
        this.y = y;
        this.dy = dy;
        this.y_percent = y_percent;
    }

    public static fromVectorN(vectorN: VectorNと見なせる<any>): 上下ハンドルの点 {
        if (vectorN.vectorN.array.length < 3) {
            throw new Error("VectorNの次元が足りません。少なくとも3次元必要です。");
        }
        return new 上下ハンドルの点(new Px長さ(vectorN.vectorN.array[0]), new Percent長さ(vectorN.vectorN.array[1]), new Px長さ(vectorN.vectorN.array[2]));
    }
    public newFromVectorN(vectorN: VectorN): this {
        return 上下ハンドルの点.fromVectorN(vectorN) as this;
    }
    public get vectorN(): VectorN {
        return new VectorN([this.y.値, this.y_percent.値, this.dy.値]);
    }

    public plus(v: 上下ハンドルの点): 上下ハンドルの点 { return plusVectorN(this, v); }
    public minus(v: 上下ハンドルの点): 上下ハンドルの点 { return minusVectorN(this, v); }
    public times(k: number): 上下ハンドルの点 { return timesVectorN(this, k); }
    public divide(k: number): 上下ハンドルの点 { return divideVectorN(this, k); }
    public dot(v: 上下ハンドルの点): number { return dotVectorN(this, v); }
}

