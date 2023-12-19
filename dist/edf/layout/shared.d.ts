import * as content from "../../pdf/content";
import * as format from "../format";
export type Color = format.Color;
export declare const Color: {
    setFillColor(color: Color, context: content.Context): void;
    setStrokeColor(color: Color, context: content.Context): void;
};
export type Position = {
    x: number;
    y: number;
};
export type PathSegment = [Position | 0, Position | 0, Position];
export type Path = {
    start: Position;
    segments: Array<PathSegment>;
    closed: boolean;
};
export declare const Path: {
    append(path: Path, context: content.Context): void;
    createRectangle(size: Size): Path;
    createRoundedRectangle(size: Size, border_radius: number): Path;
};
export type Size = {
    w: number;
    h: number;
};
export declare const Size: {
    constrain(intrinsic_size: Size, target_size?: Partial<Size>): void;
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
export type Length = format.Length;
export declare const Length: {
    getComputedLength(length: Length, relative_to: number | undefined): number;
    isValid(length: Length): boolean;
};
export type NodeLength = format.NodeLength;
export declare const NodeLength: {
    getComputedLength(length: NodeLength, relative_to: number | undefined, fraction_length: number | undefined): number | undefined;
    isFractional(length: NodeLength): length is [number, "fr"];
};
export type CreateSegmentsOptions = {
    text_operand: "bytestring" | "string";
};
export type NodeStyle = Required<format.NodeStyle>;
export declare abstract class Node {
    protected node_style: NodeStyle;
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected getSegmentLeft(segment_left: Size): Size;
    constructor(style?: Partial<NodeStyle>);
    abstract createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
    getHeight(): NodeLength;
    getWidth(): NodeLength;
    static getTargetSize(node: Node, parent_target_size: Partial<Size>, fraction_size?: Partial<Size>): Partial<Size>;
}
export declare abstract class ChildNode extends Node {
    constructor(style?: Partial<NodeStyle>);
}
export declare abstract class ParentNode extends ChildNode {
    protected children: Array<ChildNode>;
    constructor(style?: Partial<NodeStyle>, ...children: Array<ChildNode>);
}
