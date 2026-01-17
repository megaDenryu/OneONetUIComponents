import { style } from '@vanilla-extract/css';

export const 値付きスライダー = style({
    display: 'flex', // フレックスボックスを使用
    alignItems: 'center', // 垂直方向に中央揃え
    justifyContent: 'space-between', // 水平方向に配置
    gap: '10px', // 要素間のスペース
    width: '100%', // コンテナの幅を100%に設定
    padding: '0 5px', // 両端に少し余白を追加（オプション）
});

export const 値付きスライダー__input = style({
    flex: '1 1 0', // 成長可能、縮小可能、基本サイズ0
    minWidth: '50px', // 最小幅を小さく設定（狭い時でも操作可能）
    maxWidth: 'none', // 最大幅制限なし
});

export const 値付きスライダー__value = style({
    width: '50px', // 固定幅を設定
    textAlign: 'center', // テキストを中央揃え
    flexShrink: 0, // サイズ変更を禁止（値表示を優先保持）
    flexGrow: 0, // 成長しない
    fontSize: '14px', // フォントサイズを明示（オプション）
});