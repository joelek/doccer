import { Atom, ChildNode, CreateSegmentsOptions, Length, NodeStyle, ParentAtom, ParentNode, Path, Size } from "./shared";
export type VerticalStyle = {
    align_x: "left" | "center" | "right";
    align_y: "top" | "middle" | "bottom";
    gap: Length;
};
export declare class VerticalNode extends ParentNode {
    protected style: VerticalStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected getFractions(): Size;
    protected getSegmentsNone(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getSegmentsAuto(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    protected getSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom>;
    constructor(style?: Partial<NodeStyle & VerticalStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
