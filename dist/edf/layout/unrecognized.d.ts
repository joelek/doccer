import * as format from "../format";
import { Atom, CreateSegmentsOptions, ParentNode, Size } from "./shared";
export type UnrecognizedStyle = Required<format.UnrecognizedStyle>;
export declare class UnrecognizedNode extends ParentNode {
    constructor(style?: Partial<format.NodeStyle & UnrecognizedStyle>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
