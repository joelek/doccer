import { Atom, ChildNode, NodeStyle, ParentNode, Size } from "./shared";
export type HorizontalLayoutStyle = {
    align_x: "left" | "center" | "right";
    align_y: "top" | "middle" | "bottom";
    gap: number;
};
export declare class HorizontalLayoutNode extends ParentNode {
    protected style: HorizontalLayoutStyle;
    protected createPrefixCommands(size: Size): Array<string>;
    protected createSuffixCommands(size: Size): Array<string>;
    constructor(style?: Partial<NodeStyle & HorizontalLayoutStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom>;
}
