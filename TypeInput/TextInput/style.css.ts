import { style, styleVariants } from '@vanilla-extract/css';

export const text_input_container = style({
    display: 'inline-block'
});

export const text_input_container_width = styleVariants({
    default: { width: '200px' },
    small: { width: '150px' },
    medium: { width: '300px' },
    large: { width: '400px' }
});

export const text_input_field = style({
    width: '100%',
    height: '32px',
    padding: '8px',
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

export const text_input_disabled = style({
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed'
});

export const text_input_height = styleVariants({
    small: { height: '28px' },
    default: { height: '32px' },
    large: { height: '40px' }
});

export const readonly_text_display = style({
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#333',
    userSelect: 'text',
    wordBreak: 'break-word',
    padding: '0',
    minHeight: '20px'
});

export const readonly_text_display_width = styleVariants({
    default: { width: 'auto' },
    small: { width: 'auto' },
    medium: { width: 'auto' },
    large: { width: 'auto' }
});
