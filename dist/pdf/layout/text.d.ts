import * as truetype from "../../truetype";
import { Atom, ChildNode, Color, CreateSegmentsOptions, Length, NodeStyle, Path, Size } from "./shared";
export type TextStyle = {
    color: "transparent" | Color;
    columns: number;
    font_size: number;
    gutter: Length;
    letter_spacing: number;
    line_anchor: "meanline" | "capline" | "topline" | "bottomline" | "baseline";
    line_height: number;
    orphans: number;
    text_align: "start" | "center" | "end";
    text_transform: "none" | "lowercase" | "uppercase";
    white_space: "wrap" | "nowrap";
    word_spacing: number;
};
export declare class TextNode extends ChildNode {
    protected content: string;
    protected typesetter: truetype.Typesetter;
    protected type_id: number;
    protected style: TextStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected getColumnWidth(target_size: Partial<Size>): number;
    protected getLineOffsetX(column_width: number, line_width: number): number;
    protected getLineOffsetY(): number;
    protected getTransformedContent(): string;
    protected getLines(target_width: number): Array<truetype.MeasuredLine>;
    protected createLineSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<Atom>;
    protected createColumnSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<Atom>;
    constructor(content: string, typesetter: truetype.Typesetter, type_id: number, style?: Partial<NodeStyle & TextStyle>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
