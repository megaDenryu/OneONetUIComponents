import { style } from '@vanilla-extract/css';

export const square_board_base = style({
    backgroundColor: 'rgba(255, 250, 245, 0.9)',
    border: '2px solid rgba(180, 160, 200, 0.5)',
    boxSizing: 'border-box',
    borderBottomLeftRadius: '15px',
    borderBottomRightRadius: '15px',
    overflow: 'hidden'
});

export const square_board_header = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(240, 235, 250, 0.8)'
});

export const board_title = style({
    margin: '5px',
    flex: '0.6'
});

export const margin = style({
    margin: '10px'
});


// ウィンドウ全体のスタイル
export const characterSettingWindow = style({
    padding: '0',
    width: '500px',
    height: '70vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'absolute',
    borderRadius: '12px',
    borderBottomRightRadius: '12px',
    backgroundColor: 'rgba(255, 250, 245, 0.95)',
    boxShadow: '0 6px 20px rgba(150, 120, 180, 0.25)',
    border: '2px solid rgba(180, 160, 200, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden' // ← 重要: 子要素がはみ出さないようにする
});

// ヘッダー部分のスタイル
export const headerSection = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 16px',
    backgroundColor: 'rgba(240, 235, 250, 0.8)',
    borderBottom: '2px solid rgba(200, 180, 220, 0.4)',
    borderRadius: '10px 10px 0 0',
    minHeight: '40px',
    flexShrink: '0'
});

// ドラッグハンドル部分のスタイル
export const dragHandle = style({
    color: '#5a6a8a',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'move',
    userSelect: 'none',
    flex: '1'
});

export const windowCloseButton = style({
  backgroundColor: 'transparent',
  color: '#8a7a9a',
  border: 'none',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  ':hover': {
    backgroundColor: 'rgba(240, 130, 140, 0.8)',
    color: 'white',
    transform: 'scale(1.1)',
  },
  ':active': {
    transform: 'scale(0.95)',
  }
});

// スクロール可能コンテンツエリアのスタイル
export const scrollableContent = style({
    flex: '1',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    padding: '16px',
    minHeight: '0', // flex子要素のサイズ制限を解除
    maxHeight: '95%', // ← 追加: 親のサイズを超えないようにする
    // スクロールバーのスタイル設定
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(180, 160, 200, 0.6) rgba(245, 240, 250, 0.4)',
});