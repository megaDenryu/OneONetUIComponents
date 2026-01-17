import { style, keyframes, styleVariants } from '@vanilla-extract/css';

// アニメーション
export const slideIn = keyframes({
    '0%': { transform: 'translateX(100%)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 }
});

export const slideOut = keyframes({
    '0%': { transform: 'translateX(0)', opacity: 1 },
    '100%': { transform: 'translateX(100%)', opacity: 0 }
});

// トーストコンテナ（画面右上に固定）
export const toastContainer = style({
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
    maxWidth: '350px'
});

// トーストアイテム基本スタイル
export const toastItem = style({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'auto',
    animation: `${slideIn} 0.3s ease-out forwards`,
    minWidth: '280px'
});

export const toastItemClosing = style({
    animation: `${slideOut} 0.3s ease-in forwards`
});

// 通知タイプ別スタイル
export const toastTypes = styleVariants({
    success: {
        backgroundColor: '#1e3a21',
        border: '1px solid #4CAF50',
        color: '#a5d6a7'
    },
    error: {
        backgroundColor: '#3a1e1e',
        border: '1px solid #f44336',
        color: '#ef9a9a'
    },
    warning: {
        backgroundColor: '#3a351e',
        border: '1px solid #ff9800',
        color: '#ffe082'
    },
    info: {
        backgroundColor: '#1e2a3a',
        border: '1px solid #2196F3',
        color: '#90caf9'
    }
});

// アイコン
export const toastIcon = style({
    fontSize: '20px',
    flexShrink: 0
});

// メッセージ
export const toastMessage = style({
    flex: 1,
    fontSize: '14px',
    lineHeight: '1.4'
});

// アクションボタン
export const toastAction = style({
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
    ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)'
    }
});

// 閉じるボタン
export const toastClose = style({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    transition: 'opacity 0.2s ease, background-color 0.2s ease',
    flexShrink: 0,
    ':hover': {
        opacity: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
});

// プログレスバー（自動消去の進捗表示）
export const toastProgress = style({
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '0 0 8px 8px',
    transition: 'width linear'
});
