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
type Style<A extends keyof format.Templates> = Exclude<Required<format.Templates>[A][string], undefined>;
export declare class StyleHandler {
    protected templates: format.Templates;
    protected getStyle<A extends keyof format.Templates>(type: A, style: Style<A> | undefined, exclude: Array<string>): Style<A> | undefined;
    constructor(templates: format.Templates | undefined);
    getBoxStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined;
    getHorizontalStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined;
    getTextStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined;
    getVerticalStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined;
}
export {};
