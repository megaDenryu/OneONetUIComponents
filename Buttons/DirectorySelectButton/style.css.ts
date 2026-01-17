import { style } from '@vanilla-extract/css';

export const directory_select_container = style({
    display: 'inline-block',
    position: 'relative'
});

export const hidden_directory_input = style({
    display: 'none'
});

export const disabled_button = style({
    opacity: '0.6',
    cursor: 'not-allowed',
    pointerEvents: 'none'
});

export const enabled_button = style({
    opacity: '1',
    cursor: 'pointer',
    pointerEvents: 'auto'
});
