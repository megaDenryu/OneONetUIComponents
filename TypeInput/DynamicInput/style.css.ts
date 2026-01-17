import { style } from '@vanilla-extract/css';

// DynamicRecordInput用スタイル
export const dynamic_record_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
});

export const dynamic_entry_row = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #dee2e6',
    transition: 'all 0.2s ease',
    ':hover': {
        backgroundColor: '#e9ecef',
        borderColor: '#adb5bd'
    }
});

export const dynamic_entry_header = style({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
});

export const dynamic_entry_key = style({
    flex: '1',
    padding: '8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: '#fff',
    ':focus': {
        outline: 'none',
        borderColor: '#007bff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,0.25)'
    }
});

export const dynamic_type_selector = style({
    padding: '8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    minWidth: '150px',
    ':hover': {
        borderColor: '#007bff'
    },
    ':focus': {
        outline: 'none',
        borderColor: '#007bff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,0.25)'
    }
});

export const dynamic_delete_button = style({
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#c82333'
    }
});

export const dynamic_entry_value_wrapper = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingLeft: '8px'
});

export const dynamic_nested_container = style({
    marginLeft: '16px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #dee2e6'
});

export const dynamic_add_button = style({
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#218838'
    }
});

export const dynamic_empty_message = style({
    padding: '16px',
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic'
});

export const dynamic_section_title = style({
    fontSize: '16px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '12px'
});

// DynamicListInput用スタイル
export const dynamic_list_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
});

export const dynamic_list_item = style({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6'
});

export const dynamic_list_item_index = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600'
});

export const dynamic_list_item_content = style({
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
});

export const dynamic_list_item_controls = style({
    display: 'flex',
    gap: '4px'
});

export const dynamic_collapse_button = style({
    padding: '6px 12px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background-color 0.2s ease',
    ':hover': {
        backgroundColor: '#5a6268'
    }
});

export const dynamic_depth_indicator = style({
    position: 'relative',
    paddingLeft: '16px',
    ':before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '3px',
        backgroundColor: '#007bff',
        borderRadius: '2px'
    }
});
