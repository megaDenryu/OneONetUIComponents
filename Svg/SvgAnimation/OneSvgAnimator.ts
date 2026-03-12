/**
 * Universal SVG Animator
 * 完全にデータ駆動型で動作する、React非依存の軽量SVGアニメーションエンジン
 */

import { div } from "SengenUI/LV1UIComponents";
import { LV1HtmlComponentBase } from "SengenUI/SengenBase/LV1HtmlComponentBase";
import { LV2HtmlComponentBase } from "SengenUI/SengenBase/LV2HtmlComponentBase";

// --- 1. アニメーション状態の型定義 ---
export interface PartState {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    strokeWidth: number;
    strokeColor: string;
    useCustomStroke: boolean;
    visible: boolean;
    shape: string;
}

export interface KeyframeData {
    time: number; // 0.0 to 100.0 (%)
    parts: Record<string, PartState>;
}

export interface AnimationTimeline {
    duration: number; // ms
    loop: boolean;
    bgColor: string;
    transparentBg: boolean;
    keyframes: KeyframeData[];
}

// --- 2. アバター定義の型定義 (ここがDIされる部分) ---
export interface AvatarPartDef {
    id: string;
    name: string;
    cx: number; // 回転・スケールの中心点 X (定義側で管理)
    cy: number; // 回転・スケールの中心点 Y (定義側で管理)
    isGlobal?: boolean; // 全体をまとめる特別なグループかどうか
    shapes?: { id: string; label: string }[]; // 形状バリエーションの定義
    // 状態を受け取り、自分自身のSVGタグ(文字列)を返す純粋関数
    render: (state: PartState, globalState: PartState, def: AvatarPartDef) => string;
}

export interface AvatarDef {
    id: string;
    name: string;
    viewBox: string;
    defs: string; // <linearGradient> などの共通定義
    parts: AvatarPartDef[];
}

// --- ヘルパー関数 (定義オブジェクト側で利用する) ---
export const getTransformStr = (state: PartState, cx: number, cy: number): string => {
    if (state.x === 0 && state.y === 0 && state.scaleX === 1 && state.scaleY === 1 && state.rotate === 0) return "";
    return `transform="translate(${state.x} ${state.y}) translate(${cx} ${cy}) scale(${state.scaleX} ${state.scaleY}) rotate(${state.rotate}) translate(-${cx} -${cy})"`;
};

export const getStrokeStr = (state: PartState, globalState: PartState): string => {
    const width = state.useCustomStroke ? state.strokeWidth : globalState.strokeWidth;
    const color = state.useCustomStroke ? state.strokeColor : globalState.strokeColor;
    if (width <= 0) return 'stroke="none" stroke-width="0"';
    return `stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"`;
};


// --- 3. アニメータークラス本体 ---
export class UniversalAnimator {
    private container: HTMLElement;
    private avatar: AvatarDef;
    private timeline: AnimationTimeline;
    
    private isPlaying: boolean = false;
    private startTime: number = 0;
    private animationFrameId: number | null = null;
    private currentProgress: number = 0;

    constructor(container: HTMLElement, avatar: AvatarDef, timeline: AnimationTimeline) {
        this.container = container;
        this.avatar = avatar;
        this.timeline = timeline;
        this.render(0);
    }

    public play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.startTime = performance.now() - (this.currentProgress * this.timeline.duration);
        this.loop(performance.now());
    }

    public pause() {
        this.isPlaying = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    public setProgress(progressPercent: number) {
        this.currentProgress = Math.max(0, Math.min(1, progressPercent / 100));
        if (this.isPlaying) {
            this.startTime = performance.now() - (this.currentProgress * this.timeline.duration);
        } else {
            this.render(this.currentProgress);
        }
    }

    private loop = (timestamp: number) => {
        if (!this.isPlaying) return;

        const elapsed = timestamp - this.startTime;
        this.currentProgress = elapsed / this.timeline.duration;

        if (this.currentProgress >= 1) {
            if (this.timeline.loop) {
                this.startTime = timestamp;
                this.currentProgress = 0;
            } else {
                this.currentProgress = 1;
                this.isPlaying = false;
                this.render(this.currentProgress);
                return;
            }
        }

        this.render(this.currentProgress);
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    // 線形補間エンジン
    private getInterpolatedState(progress: number): Record<string, PartState> {
        const kfs = this.timeline.keyframes;
        const progressPct = progress * 100;

        if (kfs.length === 0) return {};
        if (kfs.length === 1) return kfs[0].parts;

        let kf0 = kfs[0];
        let kf1 = kfs[kfs.length - 1];

        if (progressPct <= kf0.time) return kf0.parts;
        if (progressPct >= kf1.time) return kf1.parts;

        for (let i = 0; i < kfs.length - 1; i++) {
            if (kfs[i].time <= progressPct && progressPct <= kfs[i + 1].time) {
                kf0 = kfs[i];
                kf1 = kfs[i + 1];
                break;
            }
        }

        const t = (progressPct - kf0.time) / (kf1.time - kf0.time);
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const result: Record<string, PartState> = {};
        for (const key of Object.keys(kf0.parts)) {
            const p0 = kf0.parts[key];
            const p1 = kf1.parts[key] || p0;
            result[key] = {
                ...p0,
                // 数値は線形補間
                x: lerp(p0.x, p1.x, t),
                y: lerp(p0.y, p1.y, t),
                scaleX: lerp(p0.scaleX, p1.scaleX, t),
                scaleY: lerp(p0.scaleY, p1.scaleY, t),
                rotate: lerp(p0.rotate, p1.rotate, t),
                strokeWidth: lerp(p0.strokeWidth, p1.strokeWidth, t),
            };
        }
        return result;
    }

    // 描画エンジン (AvatarDefに完全に委譲)
    private render(progress: number) {
        const stateMap = this.getInterpolatedState(progress);
        
        // Globalパーツの取得
        const globalDef = this.avatar.parts.find(p => p.isGlobal);
        const globalState = globalDef ? stateMap[globalDef.id] : null;

        if (globalState && !globalState.visible) {
            this.container.innerHTML = "";
            return;
        }

        const bgRect = this.timeline.transparentBg ? '' : `<rect width="100%" height="100%" fill="${this.timeline.bgColor}" />`;
        
        let innerSvg = '';
        
        // 定義されたパーツを順にレンダリング（データ駆動）
        for (const partDef of this.avatar.parts) {
            if (partDef.isGlobal) continue; // Globalは後でラッパーとして使う
            
            const state = stateMap[partDef.id];
            if (!state || !state.visible) continue;
            
            // 実際の描画文字列の生成は「注入されたAvatarDef」に任せる
            innerSvg += partDef.render(state, globalState || state, partDef);
        }

        // 最終的なSVGの組み立て
        const globalTransform = globalState ? getTransformStr(globalState, globalDef!.cx, globalDef!.cy) : '';
        const svgContent = `
            <svg viewBox="${this.avatar.viewBox}" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; display:block;">
                <defs>${this.avatar.defs}</defs>
                ${bgRect}
                <g ${globalTransform}>
                    ${innerSvg}
                </g>
            </svg>
        `;

        this.container.innerHTML = svgContent;
    }
}

export class SvgAnimator extends LV2HtmlComponentBase {
    private animator: UniversalAnimator;

    public constructor(avatar: AvatarDef, timeline: AnimationTimeline){
        super();
        this._componentRoot = div();
        this.animator = new UniversalAnimator(this._componentRoot.dom.element, avatar, timeline);
    }
}