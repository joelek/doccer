import * as content from "../content";
import { Atom, ChildNode, Length, Node, NodeStyle, ParentAtom, ParentNode, Path, PositionedAtom, Size } from "./shared";

export type BoxStyle = {
	background_color: "transparent" | [number, number, number];
	border_color: "transparent" | [number, number, number];
	border_radius: number;
	border_width: number;
	padding: Length;
};

export class BoxNode extends ParentNode {
	protected style: BoxStyle;

	protected createPrefixCommands(path: Path): Array<string> {
		let context = content.createContext();
		if (this.style.background_color !== "transparent") {
			context.setfillColorRGB(...this.style.background_color);
			Path.append(path, context);
			context.fillUsingNonZeroWindingNumberRule();
		}
		return [
			...super.createPrefixCommands(path),
			...context.getCommands()
		];
	}

	protected createSuffixCommands(path: Path): Array<string> {
		let context = content.createContext();
		return [
			...context.getCommands(),
			...super.createSuffixCommands(path)
		];
	}

	protected createBorderCommands(size: Size): Array<string> {
		let context = content.createContext();
		if (this.style.border_color !== "transparent") {
			context.setStrokeColorRGB(...this.style.border_color);
		}
		if (this.style.border_width > 0) {
			let border_radius = Math.max(0, this.style.border_radius - this.style.border_width * 0.5);
			context.concatenateMatrix(1, 0, 0, 1, this.style.border_width * 0.5, 0 - this.style.border_width * 0.5);
			context.setStrokeWidth(this.style.border_width);
			let border_path = Path.createRoundedRectangle({
				w: Math.max(0, size.w - this.style.border_width),
				h: Math.max(0, size.h - this.style.border_width)
			}, border_radius);
			Path.append(border_path, context);
			context.strokePath();
		}
		return context.getCommands();
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
			let path = Path.createRoundedRectangle(segment.size, this.style.border_radius);
			segment.prefix = this.createPrefixCommands(path);
			segment.suffix = [
				...this.createBorderCommands(segment.size),
				...this.createSuffixCommands(path)
			];
		}
		return segments;
	}
};
