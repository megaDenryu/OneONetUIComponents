import { style, styleVariants } from '@vanilla-extract/css';

// ========================================
// ObjectInput Styles
// ========================================

export const object_input_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '4px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    width: '100%',
    boxSizing: 'border-box'
});

export const object_input_field_row = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '3px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    marginBottom: '8px',
    position: 'relative'
});

export const object_input_label = style({
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
});

export const object_input_required_mark = style({
    color: '#d32f2f',
    fontWeight: 'bold'
});

export const object_input_field_wrapper = style({
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
});

export const object_input_error_message = style({
    fontSize: '12px',
    color: '#d32f2f',
    marginTop: '4px',
    paddingLeft: '4px'
});

export const object_input_field_error = style({
    borderColor: '#d32f2f !important' as any,
    backgroundColor: '#ffebee !important' as any
});

// Layout variants
export const object_input_layout = styleVariants({
    vertical: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    horizontal: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '16px',
        alignItems: 'start'
    }
});

export const object_input_grid_field = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
});

export const object_input_grid_label = style({
    fontSize: '13px',
    fontWeight: '500',
    color: '#555'
});

// Nested object styles
export const object_input_nested = style({
    marginTop: '8px',
    paddingLeft: '12px',
    borderLeft: '3px solid #1976d2',
    position: 'relative',
    backgroundColor: '#f8f9ff'
});

export const object_input_section_title = style({
    fontSize: '16px',
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: '8px',
    paddingBottom: '4px',
    borderBottom: '2px solid #1976d2'
});

// Action buttons
export const object_input_actions = style({
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #ddd'
});

export const object_input_button = style({
    padding: '8px 16px',
    border: '1px solid #1976d2',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#1976d2',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
        backgroundColor: '#e3f2fd',
        borderColor: '#1565c0'
    },
    ':active': {
        transform: 'scale(0.98)'
    },
    ':disabled': {
        opacity: 0.4,
        cursor: 'not-allowed'
    }
});

export const object_input_submit_button = style([object_input_button, {
    backgroundColor: '#1976d2',
    color: '#fff',
    ':hover': {
        backgroundColor: '#1565c0',
        borderColor: '#0d47a1'
    }
}]);

export const object_input_reset_button = style([object_input_button, {
    borderColor: '#999',
    color: '#666',
    ':hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#666'
    }
}]);

// ========================================
// 追加のコンテナスタイル - setStyleCSSからvanilla extractへ移行
// ========================================

/** メインコンテナの基本スタイル - width: 100%, boxSizing: border-box, position: relative */
export const object_input_main_container = style({
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative'
});

/** フィールド行のフルスタイル - width: 100%, boxSizing: border-box */
export const object_input_field_row_full = style({
    width: '100%',
    boxSizing: 'border-box'
});

/** 入力コンテナのスタイル - width: 100%, minWidth: 0 */
export const object_input_input_container = style({
    width: '100%',
    minWidth: '0'
});

/** フィールドラッパーのフルスタイル - width: 100% */
export const object_input_field_wrapper_full = style({
    width: '100%'
});

/** ネストしたコンテナのフルスタイル - width: 100%, boxSizing: border-box */
export const object_input_nested_full = style({
    width: '100%',
    boxSizing: 'border-box'
});

/** エラーメッセージのフルスタイル - display: none, width: 100% */
export const object_input_error_message_full = style({
    display: 'none',
    width: '100%'
});

/** ヘルプテキストのスタイル */
export const object_input_help_text = style({
    fontSize: '12px',
    color: '#666',
    display: 'block',
    marginTop: '4px',
    lineHeight: '1.4'
});

/** エラーメッセージ表示時のスタイル */
export const object_input_error_message_visible = style({
    display: 'block'
});

/** エラーメッセージ非表示時のスタイル */
export const object_input_error_message_hidden = style({
    display: 'none'
});