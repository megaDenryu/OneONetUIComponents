import { DivC, HtmlComponentBase, HtmlElementProxy, LV2HtmlComponentBase, Percent長さ, Px長さ } from "SengenUI/index";
import { divideVectorN, dotVectorN, minusVectorN, plusVectorN, timesVectorN, VectorN, VectorNと見なせる } from "../../Math/LinearAlgebra/vector";





import { ハンドル形状縦フル, 左右ハンドルbase, 左右ハンドル色紫, 左右ハンドル色赤, 左右ハンドル色青, 左右ハンドルランダムカラー } from "./style.css";
import { ILayoutSyncController } from "./IWidthPercentageController";


/**
 * Q :ハンドルのcssでpositionをrelativeにした時、ハンドルをつかんでからマウスを少し動かすと、ちょっとだけハンドルが右にずれてから始まります。absokuteの時はそんなことなく滑らかに動くのですが、なぜでしょう。
 * A : この現象は、CSSのposition: relativeとposition: absoluteの動作の違いによるものです。
 * ### 原因の詳細
 * - position: relativeの場合、要素は「元の位置」からleft/topなどで相対的に移動しますが、「元の位置」はレイアウト上そのまま残ります。  
 *   つまり、leftプロパティで動かしても、要素の「本来の位置」は変わらず、見た目だけがずれます。
 * - ドラッグ開始時点で、ハンドルの「元の位置」とマウスカーソルの位置が一致していない場合、leftで動かすと「元の位置」からの相対移動になるため、マウスとハンドルの位置にズレが生じやすいです。
 * - 逆にposition: absoluteの場合、親要素の基準位置から直接座標指定されるため、マウスの位置とハンドルの位置が一致しやすく、ズレが発生しません。
 * ### 具体的な挙動
 * - relativeだと、ドラッグ開始時に「元の位置」からのleft値が加算されるため、マウスの座標とハンドルの座標がピッタリ合わず、少し右にずれてから動き始めるように見えます。
 * - absoluteだと、left/topが親要素基準で直接指定されるので、マウスの動きとハンドルの動きが一致し、滑らかに動きます。
 * ### 対策
 * - ドラッグで座標を更新する場合は、position: absoluteを使うのが一般的です。
 * - relativeを使う場合は、「元の位置」とマウスの位置の差分を計算して補正する必要がありますが、absoluteの方がシンプルです。
 * ---
 * 要約：  
 * position: relativeは「元の位置」からの相対移動なので、ドラッグ開始時にマウスとハンドルの位置がズレやすい。absoluteならズレずに滑らかに動きます。ドラッグUIにはabsolute推奨です。
 * 
 */
export class 左右ハンドル extends LV2HtmlComponentBase {
    private isDragging: boolean;
    private _dxで操作されるもの?: dxで操作されるもの;
    private _layoutSyncController?: ILayoutSyncController;
    private 直前のハンドルの点: ハンドルの点;
    private minPercent: Percent長さ;
    private maxPercent: Percent長さ;
    private 現在のパーセント: Percent長さ; // ウィンドウリサイズ時に使用
    private resizeHandler: () => void; // リサイズイベントハンドラーの参照を保持
    
    public constructor(seed:{dxで操作されるもの?: dxで操作されるもの, layoutSyncController?: ILayoutSyncController,minPercent: Percent長さ,maxPercent: Percent長さ} ) {
        super();
        this._componentRoot = this.createComponentRoot();
        this._dxで操作されるもの = seed.dxで操作されるもの;
        this._layoutSyncController = seed.layoutSyncController;
        this.minPercent = seed.minPercent;
        this.maxPercent = seed.maxPercent;
        this.isDragging = false;
        this.現在のパーセント = new Percent長さ(20);
        
        // ウィンドウリサイズ時にハンドル位置を更新
        this.resizeHandler = () => this.ハンドル位置を更新(this.パーセントからハンドルの点を生成(this.現在のパーセント));
        window.addEventListener('resize', this.resizeHandler);
        
        this.パーセンテージでハンドルを直接指定(new Percent長さ(20)); 
    }

    protected createComponentRoot(): HtmlComponentBase {
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('mouseup', (event) => { this.dragStartEnd(false);});
        return new DivC({ class: 左右ハンドルbase })
                .addDivEventListener("mouseover", (event) => {})
                .addDivEventListener('mousedown', (event) => { event.preventDefault(); this.dragStartEnd(true) })
                .addDivEventListener('mousemove', (event) => { this.onMouseMove(event);})
                .addDivEventListener('mouseup', (event) => { this.dragStartEnd(false) })
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
    private ハンドル位置を更新(新しいハンドルの点: ハンドルの点): void {
        this.現在のパーセント = 新しいハンドルの点.x_percent;
        this.setStyleCSS({ left: 新しいハンドルの点.x.toCssValue() });
        this.直前のハンドルの点 = 新しいハンドルの点;
        this._dxで操作されるもの?.inputDx(新しいハンドルの点.dx);
        this._layoutSyncController?.updateLayoutFromHandlePosition(新しいハンドルの点.x_percent);
    }

    /**
     * パーセンテージからハンドルの点を生成する
     */
    private パーセントからハンドルの点を生成(percent: Percent長さ): ハンドルの点 {
        const clampedPercent = this.clampPercent(percent);
        const 親の横幅 = this.dom.get親要素のコンテキスト().width;
        return new ハンドルの点(clampedPercent.toPx(親の横幅), clampedPercent, new Px長さ(0));
    }

    /**
     * マウスイベントからハンドルの点を生成する
     */
    private マウスイベントからハンドルの点を生成(event: MouseEvent): ハンドルの点 {
        const currentX = new Px長さ(event.clientX);
        const dx = currentX.minus(this.直前のハンドルの点.x);
        const 親の横幅 = this.dom.get親要素のコンテキスト().width;
        const clampedPercent = this.clampPercent(currentX.toPercent(親の横幅));
        return new ハンドルの点(clampedPercent.toPx(親の横幅), clampedPercent, dx);
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
            
            // this._dxで操作されるもの?.inputDx(新しいハンドルの点.dx);
            // this._layoutSyncController?.updateLayoutFromHandlePosition(新しいハンドルの点.x_percent);
        }
    }

    public setHandleColor(color : "red"|"blue" | "purple" | "randomColor"):this {
        this.removeClass([左右ハンドル色赤,左右ハンドル色青,左右ハンドル色紫,左右ハンドルランダムカラー]);
        switch (color) {
            case "red":   this.addClass(左右ハンドル色赤);break;
            case "blue":  this.addClass(左右ハンドル色青);break;
            case "purple":this.addClass(左右ハンドル色紫);break;
            case "randomColor": this.addClass(左右ハンドルランダムカラー);break;
        }
        return this;
    }

    public setHandleSize(size: "100%"):this {
        switch (size) {
            case "100%": this.addClass(ハンドル形状縦フル);break;
        }
        return this;
    }


    private dragStartEnd(isStart: boolean) {
        this.isDragging = isStart;
        switch (isStart) {
            case true: console.log("ドラッグ開始"); break;
            case false: console.log("ドラッグ終了"); break;
        }
    }

    public パーセンテージでハンドルを直接指定(initialPercent: Percent長さ): this {
        const 新しいハンドルの点 = this.パーセントからハンドルの点を生成(initialPercent);
        this.ハンドル位置を更新(新しいハンドルの点);
        this._layoutSyncController?.updateLayoutFromHandlePosition(新しいハンドルの点.x_percent);
        return this;
    }
    
}


export interface dxで操作されるもの {
    inputDx(diffwidth: Px長さ): void;
}

export class ハンドルの点 implements VectorNと見なせる<ハンドルの点> {
    public readonly x: Px長さ;
    public readonly x_percent: Percent長さ;
    public readonly dx: Px長さ;
    constructor(x: Px長さ,x_percent: Percent長さ, dx: Px長さ) {
        this.x = x;
        this.dx = dx;
        this.x_percent = x_percent;
    }

    public static fromVectorN(vectorN: VectorNと見なせる<any>): ハンドルの点 {
        if (vectorN.vectorN.array.length < 2) {
            throw new Error("VectorNの次元が足りません。少なくとも2次元必要です。");
        }
        return new ハンドルの点(new Px長さ(vectorN.vectorN.array[0]), new Percent長さ(vectorN.vectorN.array[1]), new Px長さ(vectorN.vectorN.array[2]));
    }
    public newFromVectorN(vectorN: VectorN): this {
        return ハンドルの点.fromVectorN(vectorN) as this;
    }
    public get vectorN(): VectorN {
        return new VectorN([this.x.値, this.x_percent.値, this.dx.値]);
    }

    public plus(v: ハンドルの点): ハンドルの点 { return plusVectorN(this, v);}
    public minus(v: ハンドルの点): ハンドルの点 { return minusVectorN(this, v); }
    public times(k: number): ハンドルの点 {return timesVectorN(this, k); }
    public divide(k: number): ハンドルの点 {return divideVectorN(this, k); }
    public dot(v: ハンドルの点): number {return dotVectorN(this, v); }

}
