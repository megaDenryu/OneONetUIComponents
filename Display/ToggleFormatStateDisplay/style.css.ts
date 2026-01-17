
import { style } from '@vanilla-extract/css';
export const red_display = style({
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5%',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#d32f2f' // ホバー時の色を追加（オプション）
  }
});

export const green_display = style({
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5%',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#388E3C' // ホバー時の色を追加（オプション）
  }
});

export const blue_display = style({
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5%',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    ':hover': {
        backgroundColor: '#1976D2'
    }
});