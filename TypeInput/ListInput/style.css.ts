import { style, styleVariants } from '@vanilla-extract/css';

// ========================================
// ListEditorInput Styles
// ========================================

export const list_editor_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
});

export const list_items_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '4px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fafafa'
});

export const list_item_row = style({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '8px',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    ':hover': {
        borderColor: '#999',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }
});

export const list_item_drag_handle = style({
    cursor: 'grab',
    padding: '4px',
    color: '#999',
    fontSize: '16px',
    userSelect: 'none',
    ':active': {
        cursor: 'grabbing'
    },
    ':hover': {
        color: '#666'
    }
});

export const list_item_input_wrapper = style({
    flex: 1,
    minWidth: 0
});

export const list_item_actions = style({
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
});

export const list_action_button = style({
    padding: '4px 8px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    ':hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#999'
    },
    ':active': {
        transform: 'scale(0.95)'
    },
    ':disabled': {
        opacity: 0.4,
        cursor: 'not-allowed'
    }
});

export const list_delete_button = style([list_action_button, {
    color: '#d32f2f',
    ':hover': {
        backgroundColor: '#ffebee',
        borderColor: '#d32f2f'
    }
}]);

export const list_add_button = style({
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

export const list_empty_message = style({
    padding: '32px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    fontStyle: 'italic'
});

// ========================================
// MultiSelectInput Styles
// ========================================

export const multiselect_container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%'
});

export const multiselect_checkbox_group = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fafafa'
});

export const multiselect_checkbox_group_horizontal = style([multiselect_checkbox_group, {
    flexDirection: 'row',
    flexWrap: 'wrap'
}]);

export const multiselect_checkbox_item = style({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    ':hover': {
        borderColor: '#1976d2',
        backgroundColor: '#f5f9ff'
    }
});

export const multiselect_checkbox_item_checked = style([multiselect_checkbox_item, {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd'
}]);

export const multiselect_checkbox = style({
    cursor: 'pointer',
    width: '18px',
    height: '18px',
    accentColor: '#1976d2'
});

export const multiselect_label = style({
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    flex: 1
});

export const multiselect_icon = style({
    fontSize: '18px',
    lineHeight: 1
});

export const multiselect_button_group = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
});

export const multiselect_button_group_horizontal = style([multiselect_button_group, {
    flexDirection: 'row',
    flexWrap: 'wrap'
}]);

export const multiselect_button = style({
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    ':hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#999'
    },
    ':active': {
        transform: 'scale(0.98)'
    }
});

export const multiselect_button_selected = style([multiselect_button, {
    backgroundColor: '#1976d2',
    borderColor: '#1565c0',
    color: '#fff',
    fontWeight: '500',
    ':hover': {
        backgroundColor: '#1565c0',
        borderColor: '#0d47a1'
    }
}]);

export const multiselect_selected_count = style({
    marginTop: '8px',
    padding: '4px 8px',
    fontSize: '12px',
    color: '#666',
    textAlign: 'right'
});