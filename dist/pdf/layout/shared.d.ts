import * as content from "../content";
export type Position = {
    x: number;
    y: number;
};
export type Size = {
    w: number;
    h: number;
};
export type Rect = Position & Size;
export declare const Rect: {
    getUnion(one: Rect, two: Rect): Rect;
};
export type Atom = {
    size: Size;
    position?: Position;
    prefix?: Array<string>;
    atoms?: Array<PositionedAtom>;
    suffix?: Array<string>;
};
export type PositionedAtom = Atom & {
    position: Position;
};
export type ParentAtom = Atom & {
    atoms: Array<PositionedAtom>;
};
export declare const Atom: {
    getPrefixCommands(atom: Atom): Array<string>;
    getSuffixCommands(atom: Atom): Array<string>;
    getCommandsFromAtom(atom: Atom): Array<string>;
    getCommandsFromAtoms(atoms: Array<Atom>): Array<string>;
    getContentRect(atom: ParentAtom): Rect;
};
type Length = number | `${number}%` | "intrinsic" | "extrinsic";
declare const Length: {
    getComputedLength(length: Length, relative_to: number | undefined): number | undefined;
};
export type NodeStyle = {
    height: Length;
    overflow: "hidden" | "visible";
    segmentation: "auto" | "none";
    width: Length;
};
export declare abstract class Node {
    protected node_style: NodeStyle;
    protected appendNodeShape(context: content.Context, size: Size): void;
    protected createPrefixCommands(size: Size): Array<string>;
    protected createSuffixCommands(size: Size): Array<string>;
    protected getSegmentLeft(segment_left: Size): Size;
    protected constrainSegmentSize(intrinsic_size: Size, target_size?: Partial<Size>): void;
    constructor(style?: Partial<NodeStyle>);
    abstract createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom>;
    getHeight(): Length;
    getWidth(): Length;
    static getTargetSize(node: Node, parent_target_size?: Partial<Size>): Partial<Size>;
}
export declare abstract class ChildNode extends Node {
    constructor(style?: Partial<NodeStyle>);
}
export declare abstract class ParentNode extends ChildNode {
    protected children: Array<ChildNode>;
    constructor(style?: Partial<NodeStyle>, ...children: Array<ChildNode>);
}
export {};
