import { Atom, ChildNode, CreateSegmentsOptions, Length, NodeStyle, ParentNode, Path, Size } from "./shared";
export type HorizontalStyle = {
    align_x: "left" | "center" | "right";
    align_y: "top" | "middle" | "bottom";
    gap: Length;
};
export declare class HorizontalNode extends ParentNode {
    protected style: HorizontalStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected getFractions(): Size;
    constructor(style?: Partial<NodeStyle & HorizontalStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
