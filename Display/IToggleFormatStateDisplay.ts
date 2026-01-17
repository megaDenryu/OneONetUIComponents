import { HtmlElementProxy } from "SengenUI/index";

import { z, ZodEnum } from "zod";

import { ColorEnum } from "./ToggleFormatStateDisplay/ToggleFormatStateDisplay";

export interface IToggleFormatStateDisplay<T extends ZodEnum<any>> {
    setState(newState: z.infer<T>): void;
    getState(): z.infer<T>;
    setColor(newColor: z.infer<typeof ColorEnum>): void;
    getColor(): z.infer<typeof ColorEnum>;
    delete(): void;
}
