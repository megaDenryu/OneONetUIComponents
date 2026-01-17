import { style } from "@vanilla-extract/css";

// === BoolCheckboxInput ===
export const checkbox_container = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    userSelect: "none"
});

export const checkbox_input = style({
    cursor: "pointer",
    width: "18px",
    height: "18px"
});

export const checkbox_label = style({
    cursor: "pointer",
    fontSize: "14px"
});

// === BoolToggleSwitchInput ===
export const toggle_container = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "12px"
});

export const toggle_switch = style({
    position: "relative",
    display: "inline-block",
    width: "48px",
    height: "24px",
    cursor: "pointer"
});

export const toggle_input = style({
    opacity: 0,
    width: 0,
    height: 0
});

export const toggle_slider = style({
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: "0.3s",
    borderRadius: "24px",
    ":before": {
        position: "absolute",
        content: '""',
        height: "18px",
        width: "18px",
        left: "3px",
        bottom: "3px",
        backgroundColor: "white",
        transition: "0.3s",
        borderRadius: "50%"
    }
});

export const toggle_slider_checked = style({
    backgroundColor: "#2196F3",
    ":before": {
        transform: "translateX(24px)"
    }
});

export const toggle_label = style({
    fontSize: "14px",
    userSelect: "none"
});

// === BoolRadioGroupInput ===
export const radio_group_container = style({
    display: "inline-flex",
    gap: "16px",
    alignItems: "center"
});

export const radio_option = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    userSelect: "none"
});

export const radio_input = style({
    cursor: "pointer",
    width: "16px",
    height: "16px"
});

export const radio_label = style({
    cursor: "pointer",
    fontSize: "14px"
});

// === BoolButtonToggleInput ===
export const button_toggle_container = style({
    display: "inline-block"
});

export const button_toggle = style({
    padding: "8px 16px",
    border: "2px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    userSelect: "none",
    ":hover": {
        backgroundColor: "#e8e8e8"
    },
    ":active": {
        transform: "scale(0.98)"
    }
});

export const button_toggle_active = style({
    backgroundColor: "#2196F3",
    borderColor: "#1976D2",
    color: "white",
    ":hover": {
        backgroundColor: "#1976D2"
    }
});
