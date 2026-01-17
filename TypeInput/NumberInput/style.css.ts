import { style } from "@vanilla-extract/css";

export const slider_container = style({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%"
});

export const slider_track = style({
    flex: 1
});

export const slider_value = style({
    minWidth: "48px",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums"
});

export const stepper_container = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
});

export const stepper_button = style({
    minWidth: "32px",
    height: "32px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px"
});

export const stepper_input = style({
    width: "96px",
    textAlign: "center"
});