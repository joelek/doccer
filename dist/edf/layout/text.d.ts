import { Atom, ChildNode, CreateSegmentsOptions, NodeStyle, Path, Size } from "./shared";
import { MeasuredLine, Typesetter } from "../fonts";
import * as format from "../format";
export type TextStyle = Required<format.TextStyle>;
export declare class TextNode extends ChildNode {
    protected content: string;
    protected typesetter: Typesetter;
    protected type_id: number;
    protected style: TextStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected getColumnWidth(target_size: Partial<Size>): number;
    protected getLineOffsetX(column_width: number, line_width: number): number;
    protected getLineOffsetY(): number;
    protected getTransformedContent(): string;
    protected getLines(target_width: number): Array<MeasuredLine>;
    protected createLineSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<Atom>;
    protected createColumnSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<Atom>;
    constructor(content: string, typesetter: Typesetter, type_id: number, style?: Partial<NodeStyle & TextStyle>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
