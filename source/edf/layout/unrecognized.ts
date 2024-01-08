import * as format from "../format";
import { Atom, CreateSegmentsOptions, Node, ParentNode, Size } from "./shared";

export type UnrecognizedStyle = Required<format.UnrecognizedStyle>;

export class UnrecognizedNode extends ParentNode {
	constructor(style?: Partial<format.NodeStyle & UnrecognizedStyle>) {
		super(style);
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom> {
		segment_left = this.getSegmentLeft(segment_left);
		target_size = target_size ?? Node.getTargetSize(this, segment_size);
		options = options ?? {};
		let segments = [] as Array<Atom>;
		segments.push({
			size: {
				w: 0,
				h: 0
			}
		})
		for (let segment of segments) {
			Size.constrain(segment.size, target_size);
		}
		return segments;
	}
};
