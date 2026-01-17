import { style, keyframes } from '@vanilla-extract/css';

export const resizable_rectangle_container = style({
    position: 'relative'
});

export const resizable_rectangle = style({
    position: 'absolute',
    left: '10px',
    top: '10px',
    border: '2px solid #333',
    backgroundColor: 'rgba(200, 200, 255, 0.3)',
    boxSizing: 'border-box'
});

export const resize_handle = style({
    position: 'absolute',
    backgroundColor: '#007bff',
    opacity: 0,
    ':hover': {
        opacity: 0.7
    },
    ":active": { 
        opacity: 1.0
    }
});

export const 左右ハンドルbase = style({
    position: 'absolute',
    cursor: 'e-resize',
    opacity: 0.1,
});

export const 左右ハンドル色青 = style({
    backgroundColor: '#007bff',
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

export const 左右ハンドル色赤 = style({
    backgroundColor: 'red',
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

export const 左右ハンドル色紫 = style({
    backgroundColor: 'purple',
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

const randomColorAnimation = keyframes({
    '0%': { backgroundColor: '#ff0000' },   // 赤
    '16.67%': { backgroundColor: '#ff8000' }, // オレンジ
    '33.33%': { backgroundColor: '#ffff00' }, // 黄色
    '50%': { backgroundColor: '#00ff00' },    // 緑
    '66.67%': { backgroundColor: '#0080ff' }, // 青
    '83.33%': { backgroundColor: '#8000ff' }, // 紫
    '100%': { backgroundColor: '#ff0000' }    // 赤（ループ）
});

export const 左右ハンドルランダムカラー = style({
    animation: `${randomColorAnimation} 3s infinite linear`,
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});


export const resize_handle_top = style({
    cursor: 'n-resize'
});

export const resize_handle_bottom = style({
    cursor: 's-resize'
});

export const resize_handle_left = style({
    cursor: 'w-resize'
});

export const resize_handle_right = style({
    cursor: 'e-resize'
});

export const resize_handle_corner = style({});

export const resize_handle_top_left = style({
    cursor: 'nw-resize'
});

export const resize_handle_top_right = style({
    cursor: 'ne-resize'
});

export const resize_handle_bottom_left = style({
    cursor: 'sw-resize'
});

export const resize_handle_bottom_right = style({
    cursor: 'se-resize'
});

export const handle_sample_view = style({
    height: "30vh",
    width: "10px",
    

});

export const ハンドル形状縦フル = style({
    height: "100%",
    width: "10px", 
});

// 上下ハンドル用スタイル
export const 上下ハンドルbase = style({
    position: 'absolute',
    cursor: 'n-resize',
    opacity: 0.1,
});

export const 上下ハンドル色青 = style({
    backgroundColor: '#007bff',
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

export const 上下ハンドル色赤 = style({
    backgroundColor: 'red',
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

export const 上下ハンドル色紫 = style({
    backgroundColor: 'purple',
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

export const 上下ハンドルランダムカラー = style({
    animation: `${randomColorAnimation} 3s infinite linear`,
    ':hover': {opacity: 0.7},
    ":active": { opacity: 1.0}
});

export const ハンドル形状横フル = style({
    height: "10px",
    width: "100%", 
});