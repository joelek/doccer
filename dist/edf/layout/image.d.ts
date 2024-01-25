import * as format from "../format";
import { ImageHandler, ImageHandlerEntry } from "../images";
import { Atom, ChildNode, CreateSegmentsOptions, NodeStyle, Path, Size } from "./shared";
export type ImageStyle = Required<format.ImageStyle>;
export declare class ImageNode extends ChildNode {
    protected style: ImageStyle;
    protected entry: ImageHandlerEntry;
    constructor(image_handler: ImageHandler, style?: Partial<NodeStyle & ImageStyle>);
    protected createPrefixCommands(path: Path): Array<string>;
    protected createSuffixCommands(path: Path): Array<string>;
    protected createBoxSegment(segment_size: Size, segment_left: Size, target_size: Partial<Size>): Atom;
    createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;
}
