import { Atom, ChildNode, CreateSegmentsOptions, NodeStyle, ParentNode, Path, Size } from "./shared";
import * as format from "../format";
export type BoxStyle = Required<format.BoxStyle>;
export declare class BoxNode extends ParentNode {
    protected style: BoxStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected createBorderCommands(size: Size, border_width: number, border_radius: number): Array<string>;
    constructor(style?: Partial<NodeStyle & BoxStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
