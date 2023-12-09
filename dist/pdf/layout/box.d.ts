import * as content from "../content";
import { Atom, ChildNode, NodeStyle, ParentNode, Size } from "./shared";
export type BoxStyle = {
    background_color: "transparent" | [number, number, number];
    border_color: "transparent" | [number, number, number];
    border_radius: number;
    border_width: number;
    padding: number;
};
export declare class BoxNode extends ParentNode {
    protected style: BoxStyle;
    protected appendNodeShape(context: content.Context, size: Size, border_radius?: number): void;
    protected createPrefixCommands(size: Size): Array<string>;
    protected createSuffixCommands(size: Size): Array<string>;
    constructor(style?: Partial<NodeStyle & BoxStyle>, ...children: Array<ChildNode>);
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom>;
}
