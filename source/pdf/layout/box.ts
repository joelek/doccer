import * as content from "../content";
import { Atom, ChildNode, Length, Node, NodeStyle, ParentAtom, ParentNode, PositionedAtom, Size } from "./shared";

export type BoxStyle = {
	background_color: "transparent" | [number, number, number];
	border_color: "transparent" | [number, number, number];
	border_radius: number;
	border_width: number;
	padding: Length;
};

export class BoxNode extends ParentNode {
	protected style: BoxStyle;

	protected appendNodeShape(context: content.Context, size: Size, border_radius?: number): void {
		let br = border_radius ?? this.style.border_radius;
		if (br === 0) {
			super.appendNodeShape(context, size);
		} else {
			let w = Math.max(br + br, size.w);
			let h = Math.max(br + br, size.h);
			let f = (Math.SQRT2 - 1) * 4 / 3;
			let c1 = br * f;
			let c2 = br - c1;
			let x1 = 0;
			let x2 = c2;
			let x3 = br;
			let x4 = (w - br);
			let x5 = (w - c2);
			let x6 = w;
			let y1 = 0 - 0;
			let y2 = 0 - c2;
			let y3 = 0 - br;
			let y4 = 0 - (h - br);
			let y5 = 0 - (h - c2);
			let y6 = 0 - h;
			context.beginNewSubpath(x1, y3);
			context.appendLineSegment(x1, y4);
			context.appendCubicBezierCurve(x1, y5, x2, y6, x3, y6);
			context.appendLineSegment(x4, y6);
			context.appendCubicBezierCurve(x5, y6, x6, y5, x6, y4);
			context.appendLineSegment(x6, y3);
			context.appendCubicBezierCurve(x6, y2, x5, y1, x4, y1);
			context.appendLineSegment(x3, y1);
			context.appendCubicBezierCurve(x2, y1, x1, y2, x1, y3);
			context.closeSubpath();
		}
	}

	protected createPrefixCommands(size: Size): Array<string> {
		let context = content.createContext();
		if (this.style.background_color !== "transparent") {
			context.setfillColorRGB(...this.style.background_color);
			this.appendNodeShape(context, size);
			context.fillUsingNonZeroWindingNumberRule();
		}
		return [
			...super.createPrefixCommands(size),
			...context.getCommands()
		];
	}

	protected createSuffixCommands(size: Size): Array<string> {
		let context = content.createContext();
		if (this.style.border_color !== "transparent") {
			context.setStrokeColorRGB(...this.style.border_color);
		}
		if (this.style.border_width > 0) {
			let border_radius = Math.max(0, this.style.border_radius - this.style.border_width * 0.5);
			context.concatenateMatrix(1, 0, 0, 1, this.style.border_width * 0.5, 0 - this.style.border_width * 0.5);
			context.setStrokeWidth(this.style.border_width);
			this.appendNodeShape(context, {
				w: Math.max(0, size.w - this.style.border_width),
				h: Math.max(0, size.h - this.style.border_width)
			}, border_radius);
			context.strokePath();
		}
		return [
			...context.getCommands(),
			...super.createSuffixCommands(size)
		];
	}

	constructor(style?: Partial<NodeStyle & BoxStyle>, ...children: Array<ChildNode>) {
		super(style, ...children);
		style = style ?? {};
		let background_color = style.background_color ?? "transparent";
		let border_color = style.border_color ?? "transparent";
		let border_radius = style.border_radius ?? 0;
		if (border_radius < 0) {
			throw new Error();
		}
		let border_width = style.border_width ?? 0;
		if (border_width < 0) {
			throw new Error();
		}
		let padding = style.padding ?? [0];
		if (padding[0] < 0) {
			throw new Error();
		}
		this.style = {
			background_color,
			border_color,
			border_radius,
			border_width,
			padding
		};
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom> {
		if (target_size == null) {
			target_size = Node.getTargetSize(this, segment_size);
		}
		segment_left = this.getSegmentLeft(segment_left);
		let padding = Length.getComputedLength(this.style.padding, target_size.w);
		let inset_top = this.style.border_width + padding;
		let inset_right = this.style.border_width + padding;
		let inset_left = this.style.border_width + padding;
		let inset_bottom = this.style.border_width + padding;
		let content_segment_size: Size = {
			w: 0,
			h: Math.max(0, segment_size.h - inset_top - inset_bottom)
		};
		let content_segment_left: Size = {
			w: 0,
			h: Math.max(0, segment_left.h - inset_top - inset_bottom)
		};
		let content_target_size: Partial<Size> = {
			w: target_size.w == null ? undefined : Math.max(0, target_size.w - inset_left - inset_right),
			h: target_size.h == null ? undefined : Math.max(0, target_size.h - inset_top - inset_bottom)
		};
		let segments = [] as Array<ParentAtom>;
		let current_segment: ParentAtom = {
			size: {
				w: 0,
				h: 0
			},
			atoms: []
		};
		for (let child of this.children) {
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: Math.max(0, content_segment_left.h - current_segment.size.h)
			};
			let child_target_size = Node.getTargetSize(child, target_size);
			let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size);
			for (let row of rows) {
				if (current_segment.size.h + row.size.h <= content_segment_left.h) {
				} else {
					if (current_segment.atoms.length > 0) {
						segments.push(current_segment);
						current_segment = {
							size: {
								w: 0,
								h: 0
							},
							atoms: []
						};
					}
					content_segment_left = { ...content_segment_size };
				}
				let positioned_row: PositionedAtom = {
					...row,
					position: {
						x: 0,
						y: current_segment.size.h
					}
				};
				current_segment.atoms.push(positioned_row);
				current_segment.size.w = Math.max(current_segment.size.w, positioned_row.position.x + positioned_row.size.w);
				current_segment.size.h = Math.max(current_segment.size.h, positioned_row.position.y + positioned_row.size.h);
			}
		}
		segments.push(current_segment);
		for (let segment of segments) {
			Size.constrain(segment.size, content_target_size);
		}
		for (let segment of segments) {
			for (let row of segment.atoms) {
				row.position.x += inset_left;
				row.position.y += inset_top;
			}
			segment.size.w += inset_left + inset_right;
			segment.size.h += inset_top + inset_bottom;
		}
		for (let segment of segments) {
			segment.prefix = this.createPrefixCommands(segment.size);
			segment.suffix = this.createSuffixCommands(segment.size);
		}
		return segments;
	}
};
