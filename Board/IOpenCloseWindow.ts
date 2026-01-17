
export interface IOpenCloseWindow {
    isOpen(): boolean;
    open(): void;
    close(): void;

}

export interface IOpenCloseToggleWindow extends IOpenCloseWindow {
    toggle(): void;
}