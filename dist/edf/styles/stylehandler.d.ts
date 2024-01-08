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
    protected default_unit: format.AbsoluteUnit | undefined;
    protected getStyle<A extends keyof format.Templates>(type: A, style: Style<A> | undefined, exclude: Array<string>): Style<A> | undefined;
    protected getColor(color: string | "transparent" | format.Color | undefined): "transparent" | format.Color | undefined;
    protected getLength(length: format.Length | undefined): format.Length | undefined;
    protected getAbsoluteLength(length: format.AbsoluteLength | undefined): format.AbsoluteLength | undefined;
    constructor(templates: format.Templates | undefined, colors: format.Colors | undefined, default_unit: format.AbsoluteUnit | undefined);
    getBoxStyle(style: format.BoxNodeStyle | undefined): format.BoxNodeStyle | undefined;
    getTextStyle(style: format.TextNodeStyle | undefined): format.TextNodeStyle | undefined;
    getUnrecognizedStyle(style: format.UnrecognizedNodeStyle | undefined, type: string): format.UnrecognizedNodeStyle | undefined;
}
export {};
