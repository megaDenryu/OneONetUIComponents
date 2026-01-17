import { Percent長さ, Px長さ } from "SengenUI/index";

import { IWidthPercentageController, ILayoutSyncController } from "./IWidthPercentageController";

/**
 * ハンドルの位置変更を受け取って、SideBarLeftとHumanTabGroupの幅を同期するコントローラー
 */
export class LayoutSyncController implements ILayoutSyncController {
    private sideBarLeft: IWidthPercentageController;
    private humanTabGroup: IWidthPercentageController;

    constructor(
        sideBarLeft: IWidthPercentageController,
        humanTabGroup: IWidthPercentageController
    ) {
        this.sideBarLeft = sideBarLeft;
        this.humanTabGroup = humanTabGroup;
    }

    /**
     * ハンドルの位置（パーセンテージ）を受け取って、レイアウトを更新する
     * @param handlePositionPercent ハンドルの位置（0-100%）
     */
    public updateLayoutFromHandlePosition(handlePositionPercent: Percent長さ): void {
        // ハンドル側で既に制約が適用されているので、そのまま使用
        const sideBarWidth = handlePositionPercent;
        const humanTabGroupWidth = new Percent長さ(100 - sideBarWidth.値);

        // 両方のコンポーネントの幅を更新
        this.sideBarLeft.setWidthPercentage(sideBarWidth);
        this.humanTabGroup.setWidthPercentage(humanTabGroupWidth);
    }
}

