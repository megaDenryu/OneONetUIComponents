import { style, styleVariants } from '@vanilla-extract/css';

export const blindable_input_container = style({
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%' // コンテナ自体は幅いっぱいに広がるようにし、親要素で制御しやすくする
});

export const blindable_input_field = style({
    width: '100%',
    height: '32px',
    padding: '8px 40px 8px 8px', // 右側にボタンのスペースを確保
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
    ':focus': {
        borderColor: '#007bff',
        boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)'
    }
});

export const blindable_input_toggle_button = style({
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    ':hover': {
        color: '#333'
    }
});

export const blindable_input_disabled = style({
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed'
});

// 幅のバリエーション（TextInputと同じ）
export const blindable_input_container_width = styleVariants({
    default: { width: '200px' },
    small: { width: '150px' },
    medium: { width: '300px' },
    large: { width: '400px' },
    full: { width: '100%' }
});

// 高さのバリエーション
export const blindable_input_height = styleVariants({
    small: { height: '28px' },
    default: { height: '32px' },
    large: { height: '40px' }
});
