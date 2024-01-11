import * as truetype from "../../truetype";
export type MeasuredLine = {
    line_string: string;
    line_width: number;
};
export type Options = {
    letter_spacing: number;
    word_spacing: number;
};
export type Box = {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
};
export type GlyphData = {
    index: number;
    box: Box;
};
export declare class Typesetter {
    protected widths: Map<string, number>;
    protected fallback_width: number;
    protected kernings: Map<string, number>;
    protected glyph_data: Map<string, GlyphData>;
    protected fallback_box: Box;
    protected scale_factor: number;
    protected italic_angle: number;
    protected postscript_name?: string;
    protected font_family?: string;
    protected font_weight?: number;
    protected options: Options;
    protected getCharacterBox(character: string): Box;
    protected getWidth(character: string): number;
    protected getKerning(prefix: string, suffix: string): number;
    protected segmentIntoLines(string: string): Array<string>;
    protected segmentIntoCharacters(string: string): Array<string>;
    protected segmentIntoWords(string: string): Array<string>;
    constructor(widths: Map<string, number>, fallback_width: number, kernings?: Map<string, number>, glyph_data?: Map<string, GlyphData>, fallback_box?: Box, scale_factor?: number, italic_angle?: number, postscript_name?: string, font_family?: string, font_weight?: number, options?: Partial<Options>);
    clampString(string: string, target_width: number): Array<MeasuredLine>;
    getAscent(): number;
    getCapHeight(): number;
    getDescent(): number;
    getFontFamily(): string | undefined;
    getFontStyle(): "italic" | "normal";
    getFontWeight(): number | undefined;
    getItalicAngle(): number;
    getPostscriptName(): string | undefined;
    getStemWidth(): number;
    getXHeight(): number;
    getGlyphIndexArray(string: string): Uint8Array;
    measureString(string: string): number;
    withOptions(options: Partial<Options>): Typesetter;
    wrapString(string: string, target_width: number): Array<MeasuredLine>;
    wrapStringUsingLineBreaks(string: string): Array<MeasuredLine>;
    static createFromFont(font: truetype.TrueTypeData): Typesetter;
}
export type FontHandlerEntry = {
    typesetter: Typesetter;
    type_id: number;
};
export declare class FontHandler {
    protected entries: Map<string, FontHandlerEntry>;
    protected type_id: number;
    protected default_font: string | undefined;
    constructor(default_font: string | undefined);
    addTypesetter(key: string, typesetter: Typesetter): FontHandler;
    getDefaultFont(): string | undefined;
    getTypesetter(key: string): Typesetter;
    getTypeId(key: string): number;
}
