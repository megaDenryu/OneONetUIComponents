import { Percent長さ, Px長さ } from "SengenUI/index";


/**
 * パーセンテージで幅を設定できるコンポーネントのインターフェース
 */
export interface IWidthPercentageController {
    /**
     * 幅をパーセンテージで設定する
     * @param width パーセンテージでの幅
     */
    setWidthPercentage(width: Percent長さ): void;
}

/**
 * パーセンテージで高さを設定できるコンポーネントのインターフェース
 */
export interface IHeightPercentageController {
    /**
     * 高さをパーセンテージで設定する
     * @param height パーセンテージでの高さ
     */
    setHeightPercentage(height: Percent長さ): void;
}

/**
 * ハンドルの位置変更を受け取って、複数のコンポーネントの幅を同期するコントローラー
 */
export interface ILayoutSyncController {
    /**
     * ハンドルの位置（パーセンテージ）を受け取って、レイアウトを更新する
     * @param handlePositionPercent ハンドルの位置（0-100%）
     */
    updateLayoutFromHandlePosition(handlePositionPercent: Percent長さ): void;
}

/**
 * ハンドルの位置変更を受け取って、複数のコンポーネントの高さを同期するコントローラー
 */
export interface IVerticalLayoutSyncController {
    /**
     * ハンドルの位置（パーセンテージ）を受け取って、レイアウトを更新する
     * @param handlePositionPercent ハンドルの位置（0-100%）
     */
    updateLayoutFromHandlePosition(handlePositionPercent: Percent長さ): void;
}

