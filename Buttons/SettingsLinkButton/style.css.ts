import { style } from '@vanilla-extract/css';

export const settings_link_button = style({
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    ':hover': {
        backgroundColor: '#0056b3',
        transform: 'translateY(-1px)'
    },
    ':active': {
        transform: 'translateY(0)'
    }
});

export const settings_link_button_secondary = style([settings_link_button, {
    backgroundColor: '#6c757d',
    ':hover': {
        backgroundColor: '#545b62'
    }
}]);

export const settings_link_button_warning = style([settings_link_button, {
    backgroundColor: '#ffc107',
    color: '#212529',
    ':hover': {
        backgroundColor: '#e0a800'
    }
}]);

export const settings_link_button_danger = style([settings_link_button, {
    backgroundColor: '#dc3545',
    ':hover': {
        backgroundColor: '#c82333'
    }
}]);

export const settings_link_icon = style({
    fontSize: '16px',
    lineHeight: '1'
});
