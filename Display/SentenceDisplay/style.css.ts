import { style } from '@vanilla-extract/css';

export const sentence_display_container = style({
    position: 'relative',
    backgroundColor: 'rgb(255, 255, 255)',
    border: '2px solid #9370DB',
    borderRadius: '15px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
});

export const sentence_display_header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd'
});

export const sentence_display_title = style({
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
});

export const sentence_display_content = style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: '20px',
    overflowY: 'auto'
});
