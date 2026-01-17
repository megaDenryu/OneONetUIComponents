import { style, styleVariants } from '@vanilla-extract/css';

// ========== EnumSelectInput スタイル ==========
export const select_container = style({
    display: 'inline-block',
    position: 'relative'
});

export const select_input = style({
    padding: '8px 32px 8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    ':hover': {
        borderColor: '#2196F3'
    },
    ':focus': {
        borderColor: '#2196F3',
        boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
    },
    ':disabled': {
        backgroundColor: '#f5f5f5',
        cursor: 'not-allowed',
        opacity: 0.6
    }
});

export const select_width = styleVariants({
    small: { width: '120px' },
    medium: { width: '200px' },
    large: { width: '300px' },
    full: { width: '100%' }
});

// ========== EnumRadioGroupInput スタイル ==========
export const radio_group_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
});

export const radio_group_horizontal = style({
    flexDirection: 'row',
    gap: '16px'
});

export const radio_option = style({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#f5f5f5'
    }
});

export const radio_input = style({
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    accentColor: '#2196F3'
});

export const radio_label = style({
    cursor: 'pointer',
    fontSize: '14px',
    userSelect: 'none'
});

export const radio_icon = style({
    fontSize: '16px',
    marginRight: '4px'
});

export const radio_disabled = style({
    opacity: 0.5,
    cursor: 'not-allowed',
    ':hover': {
        backgroundColor: 'transparent'
    }
});

// ========== EnumButtonGroupInput スタイル ==========
export const button_group_container = style({
    display: 'inline-flex',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid #ddd'
});

export const button_group_vertical = style({
    flexDirection: 'column'
});

export const enum_button = style({
    padding: '8px 16px',
    border: 'none',
    borderRight: '1px solid #ddd',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    outline: 'none',
    ':hover': {
        backgroundColor: '#f5f5f5'
    },
    ':active': {
        transform: 'scale(0.98)'
    },
    ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        backgroundColor: 'white'
    },
    selectors: {
        '&:last-child': {
            borderRight: 'none'
        }
    }
});

export const enum_button_selected = style({
    backgroundColor: '#2196F3',
    color: 'white',
    fontWeight: '600',
    ':hover': {
        backgroundColor: '#1976D2'
    },
    ':disabled': {
        backgroundColor: '#2196F3'
    }
});

export const enum_button_icon = style({
    fontSize: '16px'
});
