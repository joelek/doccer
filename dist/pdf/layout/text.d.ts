import * as truetype from "../../truetype";
import { Atom, ChildNode, NodeStyle, Size } from "./shared";
export type TextStyle = {
    color: "transparent" | [number, number, number];
    columns: number;
    font_size: number;
    gutter: number;
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
    protected style: TextStyle;
    protected createPrefixCommands(size: Size): Array<string>;
    protected createSuffixCommands(size: Size): Array<string>;
    protected getColumnWidth(target_size: Partial<Size>): number;
    protected getLineOffsetX(column_width: number, line_width: number): number;
    protected getLineOffsetY(): number;
    protected getTransformedContent(): string;
    protected getLines(target_width: number): Array<truetype.MeasuredLine>;
    protected createLineSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>): Array<Atom>;
    protected createColumnSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>): Array<Atom>;
    constructor(content: string, typesetter: truetype.Typesetter, style?: Partial<NodeStyle & TextStyle>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom>;
}
