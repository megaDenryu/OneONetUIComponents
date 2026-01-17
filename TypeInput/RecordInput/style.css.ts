import { style, styleVariants } from '@vanilla-extract/css';

// ========================================
// RecordInput Styles
// ========================================

export const record_input_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    width: '100%',
    boxSizing: 'border-box'
});

export const record_section_title = style({
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '2px solid #007bff'
});

export const record_entries_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '4px'
});

export const record_entry_row = style({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '12px',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    ':hover': {
        borderColor: '#999',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
});

export const record_entry_row_table = style({
    display: 'grid',
    gridTemplateColumns: '80px 1fr auto', // デフォルト値（実際は動的に上書き）
    gap: '12px',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#f5f5f5'
    }
});

export const record_entry_key_wrapper = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
});

export const record_entry_value_wrapper = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
});

export const record_entry_label = style({
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '2px'
});

export const record_entry_actions = style({
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
});

export const record_delete_button = style({
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
        backgroundColor: '#d32f2f',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)'
    },
    ':active': {
        transform: 'translateY(0)',
        boxShadow: 'none'
    }
});

export const record_add_button = style({
    padding: '10px 16px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    alignSelf: 'flex-start',
    ':hover': {
        backgroundColor: '#45a049',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)'
    },
    ':active': {
        transform: 'translateY(0)',
        boxShadow: 'none'
    },
    ':disabled': {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none'
    }
});

export const record_empty_message = style({
    padding: '24px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    fontStyle: 'italic'
});

export const record_table_header = style({
    display: 'grid',
    gridTemplateColumns: '80px 1fr auto', // デフォルト値（実際は動的に上書き）
    gap: '12px',
    padding: '12px',
    backgroundColor: '#e3f2fd',
    borderBottom: '2px solid #2196f3',
    fontWeight: '600',
    fontSize: '14px',
    color: '#1565c0',
    borderRadius: '6px 6px 0 0'
});

export const record_error_message = style({
    fontSize: '12px',
    color: '#d32f2f',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
});

export const record_validation_error = style({
    border: '1px solid #d32f2f',
    backgroundColor: '#ffebee'
});