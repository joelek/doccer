import * as format from "../format";
export declare class MissingTemplateError extends Error {
    protected template: string;
    protected type: string;
    constructor(template: string, type: string);
    toString(): string;
}
export declare class RecursiveTemplateError extends Error {
    protected template: string;
    protected type: string;
    constructor(template: string, type: string);
    toString(): string;
}
export declare class MissingColorError extends Error {
    protected color: string;
    constructor(color: string);
    toString(): string;
}
type Style<A extends keyof format.Templates> = Exclude<Required<format.Templates>[A][string], undefined>;
export declare class StyleHandler {
    protected templates: format.Templates;
    protected colors: format.Colors;
    protected getStyle<A extends keyof format.Templates>(type: A, style: Style<A> | undefined, exclude: Array<string>): Style<A> | undefined;
    protected getColor(color?: string | "transparent" | format.Color): "transparent" | format.Color | undefined;
    constructor(templates: format.Templates | undefined, colors: format.Colors | undefined);
    getBoxStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined;
    getHorizontalStyle(style?: format.HorizontalNodeStyle): format.HorizontalNodeStyle | undefined;
    getTextStyle(style?: format.TextNodeStyle): format.TextNodeStyle | undefined;
    getVerticalStyle(style?: format.VerticalNodeStyle): format.VerticalNodeStyle | undefined;
}
export {};
