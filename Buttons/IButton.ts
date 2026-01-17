import { HtmlElementProxy } from "SengenUI/index";


export interface IButton {
    dom: HtmlElementProxy;
    onClick(): void;
    addOnClickEvent(f: (() => void)): void;
    delete(): void;
}
