import { Atom, ChildNode, NodeStyle, ParentNode, Size } from "./shared";
export type VerticalLayoutStyle = {
    align_x: "left" | "center" | "right";
    align_y: "top" | "middle" | "bottom";
    gap: number;
};
export declare class VerticalLayoutNode extends ParentNode {
    protected style: VerticalLayoutStyle;
    protected createPrefixCommands(size: Size): Array<string>;
    protected createSuffixCommands(size: Size): Array<string>;
    constructor(style?: Partial<NodeStyle & VerticalLayoutStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom>;
}
