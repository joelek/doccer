import { Atom, ChildNode, CreateSegmentsOptions, NodeStyle, ParentNode, Path, Size } from "./shared";
import * as format from "../format";
export type HorizontalStyle = Required<format.HorizontalStyle>;
export declare class HorizontalNode extends ParentNode {
    protected style: HorizontalStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected getFractions(): Size;
    constructor(style?: Partial<NodeStyle & HorizontalStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
