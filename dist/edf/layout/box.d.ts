import { Atom, ChildNode, CreateSegmentsOptions, NodeStyle, ParentAtom, ParentNode, Path, Size } from "./shared";
import * as format from "../format";
export type BoxStyle = Required<format.BoxStyle>;
export declare class BoxNode extends ParentNode {
    protected style: BoxStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected createBorderCommands(size: Size, border_width: number, border_radius: number): Array<string>;
    protected getHorizontalFractions(): Size;
    protected getVerticalFractions(): Size;
    protected getHorizontalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getVerticalContentSegmentsAuto(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getVerticalContentSegmentsNone(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getVerticalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getConstrainedAndAlignedHorizontalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getConstrainedAndAlignedVerticalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    constructor(style?: Partial<NodeStyle & BoxStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
