import * as content from "../../pdf/content";
import { Atom, ChildNode, Color, CreateSegmentsOptions, Length, Node, NodeLength, NodeStyle, ParentAtom, ParentNode, Path, PositionedAtom, Size } from "./shared";
import * as format from "../format";

export type BoxStyle = Required<format.BoxStyle>;

export class BoxNode extends ParentNode {
	protected style: BoxStyle;

	protected createPrefixCommands(path: Path): Array<string> {
		let context = content.createContext();
		if (typeof this.style.background_color !== "string") {
			Color.setFillColor(this.style.background_color, context);
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

	protected createBorderCommands(size: Size, border_width: number, border_radius: number): Array<string> {
		let context = content.createContext();
		if (typeof this.style.border_color !== "string") {
			Color.setStrokeColor(this.style.border_color, context);
		}
		if (border_width > 0) {
			let clamped_border_radius = Math.max(0, border_radius - border_width * 0.5);
			context.concatenateMatrix(1, 0, 0, 1, border_width * 0.5, 0 - border_width * 0.5);
			context.setStrokeWidth(border_width);
			let border_path = Path.createRoundedRectangle({
				w: Math.max(0, size.w - border_width),
				h: Math.max(0, size.h - border_width)
			}, clamped_border_radius);
			Path.append(border_path, context);
			context.strokePath();
		}
		return context.getCommands();
	}

	protected getHorizontalFractions(): Size {
		let w = 0;
		let h = 0;
		for (let child of this.children) {
			let width = child.getWidth();
			if (NodeLength.isFractional(width)) {
				w = w + width[0];
			}
			let height = child.getHeight();
			if (NodeLength.isFractional(height)) {
				h = Math.max(h, height[0]);
			}
		}
		return {
			w,
			h
		};
	}

	protected getVerticalFractions(): Size {
		let w = 0;
		let h = 0;
		for (let child of this.children) {
			let width = child.getWidth();
			if (NodeLength.isFractional(width)) {
				w = Math.max(w, width[0]);
			}
			let height = child.getHeight();
			if (NodeLength.isFractional(height)) {
				h = h + height[0];
			}
		}
		return {
			w,
			h
		};
	}

	protected getHorizontalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		let gap = Length.getComputedLength(this.style.gap, content_target_size.w);
		let column_rows = [] as Array<Array<Atom>>;
		let column_widths = [] as Array<number>;
		let max_column_rows = 0;
		let fraction_size: Partial<Size> = {
			w: content_target_size.w,
			h: content_target_size.h
		};
		if (fraction_size.w != null) {
			fraction_size.w = Math.max(0, fraction_size.w - Math.max(0, this.children.length - 1) * gap);
		}
		let fractions = this.getHorizontalFractions();
		if (fraction_size.h != null) {
			fraction_size.h /= fractions.h;
		}
		for (let [index, child] of this.children.entries()) {
			let width = child.getWidth();
			if (NodeLength.isFractional(width)) {
				continue;
			}
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: content_segment_left.h
			};
			let child_target_size = Node.getTargetSize(child, content_target_size, fraction_size);
			let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
			column_rows[index] = rows;
			let column_width = rows.reduce((max, row) => Math.max(max, row.size.w), 0);
			column_widths[index] = column_width;
			if (fraction_size.w != null) {
				fraction_size.w = Math.max(0, fraction_size.w - column_width);
			}
			max_column_rows = Math.max(max_column_rows, rows.length);
		}
		if (fraction_size.w != null) {
			fraction_size.w /= fractions.w;
		}
		for (let [index, child] of this.children.entries()) {
			let width = child.getWidth();
			if (!NodeLength.isFractional(width)) {
				continue;
			}
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: content_segment_left.h
			};
			let child_target_size = Node.getTargetSize(child, content_target_size, fraction_size);
			let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
			column_rows[index] = rows;
			max_column_rows = Math.max(max_column_rows, rows.length);
			let column_width = rows.reduce((max, row) => Math.max(max, row.size.w), 0);
			column_widths[index] = column_width;
		}
		let rows = [] as Array<Array<Array<Atom>>>;
		if (this.node_style.segmentation === "auto") {
			for (let i = 0; i < Math.max(1, max_column_rows); i++) {
				let row = [] as Array<Array<Atom>>;
				for (let j = 0; j < column_rows.length; j++) {
					row.push(column_rows[j].slice(i, i + 1));
				}
				rows.push(row);
			}
		} else {
			rows.push(column_rows);
		}
		let segments = [] as Array<ParentAtom>;
		let current_segment: ParentAtom = {
			size: {
				w: 0,
				h: 0
			},
			atoms: []
		};
		for (let columns of rows) {
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
			let current_gap = 0;
			for (let [index, column_rows] of columns.entries()) {
				let column_width = column_widths[index];
				let column: ParentAtom & PositionedAtom = {
					size: {
						w: column_width,
						h: 0
					},
					position: {
						x: current_segment.size.w + current_gap,
						y: 0
					},
					atoms: []
				};
				for (let column_row of column_rows) {
					let positioned_column_row: PositionedAtom = {
						...column_row,
						position: {
							x: 0,
							y: column.size.h
						}
					};
					column.atoms.push(positioned_column_row);
					column.size.w = Math.max(column.size.w, positioned_column_row.position.x + positioned_column_row.size.w);
					column.size.h = Math.max(column.size.h, positioned_column_row.position.y + positioned_column_row.size.h);
				}
				current_segment.atoms.push(column);
				current_segment.size.w = Math.max(current_segment.size.w, column.position.x + column.size.w);
				current_segment.size.h = Math.max(current_segment.size.h, column.position.y + column.size.h);
				current_gap = gap;
			}
		}
		segments.push(current_segment);
		return segments;
	}

	protected getVerticalContentSegmentsAuto(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		let gap = Length.getComputedLength(this.style.gap, content_target_size.h);
		let fraction_size: Partial<Size> = {
			...content_target_size
		};
		let fractions = this.getVerticalFractions();
		if (fraction_size.w != null) {
			fraction_size.w /= fractions.w;
		}
		let segments = [] as Array<ParentAtom>;
		let current_segment: ParentAtom = {
			size: {
				w: 0,
				h: 0
			},
			atoms: []
		};
		let current_gap = 0;
		for (let child of this.children) {
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: Math.max(0, content_segment_left.h - (current_segment.size.h + current_gap))
			};
			let child_target_size = Node.getTargetSize(child, content_target_size, fraction_size);
			let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
			for (let row of rows) {
				if (current_segment.size.h + current_gap + row.size.h <= content_segment_left.h) {
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
						current_gap = 0;
					}
					content_segment_left = { ...content_segment_size };
				}
				let positioned_row: PositionedAtom = {
					...row,
					position: {
						x: 0,
						y: current_segment.size.h + current_gap
					}
				};
				current_segment.atoms.push(positioned_row);
				current_gap = gap;
				current_segment.size.w = Math.max(current_segment.size.w, positioned_row.position.x + positioned_row.size.w);
				current_segment.size.h = Math.max(current_segment.size.h, positioned_row.position.y + positioned_row.size.h);
			}
		}
		segments.push(current_segment);
		return segments;
	}

	protected getVerticalContentSegmentsNone(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		let gap = Length.getComputedLength(this.style.gap, content_target_size.h);
		let fraction_size: Partial<Size> = {
			...content_target_size
		};
		if (fraction_size.h != null) {
			fraction_size.h = Math.max(0, fraction_size.h - Math.max(0, this.children.length - 1) * gap);
		}
		let fractions = this.getVerticalFractions();
		if (fraction_size.w != null) {
			fraction_size.w /= fractions.w;
		}
		let segments = [] as Array<ParentAtom>;
		let current_segment: ParentAtom = {
			size: {
				w: 0,
				h: 0
			},
			atoms: []
		};
		let child_row_arrays = [] as Array<Array<Atom>>;
		for (let [index, child] of this.children.entries()) {
			let height = child.getHeight();
			if (NodeLength.isFractional(height)) {
				continue;
			}
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: 0
			};
			let child_target_size = Node.getTargetSize(child, content_target_size, fraction_size);
			let child_atoms = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
			let child_height = child_atoms.reduce((sum, child_atom) => sum + child_atom.size.h, 0);
			child_row_arrays[index] = child_atoms;
			if (fraction_size.h != null) {
				fraction_size.h = Math.max(0, fraction_size.h - child_height);
			}
		}
		if (fraction_size.h != null) {
			fraction_size.h /= fractions.h;
		}
		for (let [index, child] of this.children.entries()) {
			let height = child.getHeight();
			if (!NodeLength.isFractional(height)) {
				continue;
			}
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: 0
			};
			let child_target_size = Node.getTargetSize(child, content_target_size, fraction_size);
			let child_atoms = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
			let child_height = child_atoms.reduce((sum, child_atom) => sum + child_atom.size.h, 0);
			child_row_arrays[index] = child_atoms;
		}
		let current_gap = 0;
		for (let child_row_array of child_row_arrays) {
			for (let child_row of child_row_array) {
				let positioned_row: PositionedAtom = {
					...child_row,
					position: {
						x: 0,
						y: current_segment.size.h + current_gap
					}
				};
				current_segment.atoms.push(positioned_row);
				current_gap = gap;
				current_segment.size.w = Math.max(current_segment.size.w, positioned_row.position.x + positioned_row.size.w);
				current_segment.size.h = Math.max(current_segment.size.h, positioned_row.position.y + positioned_row.size.h);
			}
		}
		segments.push(current_segment);
		return segments;
	}

	protected getVerticalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		if (this.node_style.segmentation === "auto") {
			return this.getVerticalContentSegmentsAuto(content_segment_size, content_segment_left, content_target_size, options);
		} else {
			return this.getVerticalContentSegmentsNone(content_segment_size, content_segment_left, content_target_size, options);
		}
	}

	protected getConstrainedAndAlignedHorizontalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		let segments = this.getHorizontalContentSegments(content_segment_size, content_segment_left, content_target_size, options);
		for (let segment of segments) {
			Size.constrain(segment.size, content_target_size);
		}
		if (this.style.align_x === "center") {
			for (let segment of segments) {
				let rect = Atom.getContentRect(segment);
				let delta = (segment.size.w - rect.w) * 0.5;
				for (let row of segment.atoms) {
					row.position.x += delta;
				}
			}
		} else if (this.style.align_x === "right") {
			for (let segment of segments) {
				let rect = Atom.getContentRect(segment);
				let delta = (segment.size.w - rect.w);
				for (let row of segment.atoms) {
					row.position.x += delta;
				}
			}
		}
		if (this.style.align_y === "middle") {
			for (let segment of segments) {
				for (let column of segment.atoms) {
					column.position.y = (segment.size.h - column.size.h) * 0.5;
				}
			}
		} else if (this.style.align_y === "bottom") {
			for (let segment of segments) {
				for (let column_atom of segment.atoms) {
					column_atom.position.y = (segment.size.h - column_atom.size.h);
				}
			}
		}
		return segments;
	}

	protected getConstrainedAndAlignedVerticalContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		let segments = this.getVerticalContentSegments(content_segment_size, content_segment_left, content_target_size, options);
		for (let segment of segments) {
			Size.constrain(segment.size, content_target_size);
		}
		if (this.style.align_x === "center") {
			for (let segment of segments) {
				for (let row of segment.atoms) {
					row.position.x = (segment.size.w - row.size.w) * 0.5;
				}
			}
		} else if (this.style.align_x === "right") {
			for (let segment of segments) {
				for (let row of segment.atoms) {
					row.position.x = (segment.size.w - row.size.w);
				}
			}
		}
		if (this.style.align_y === "middle") {
			for (let segment of segments) {
				let rect = Atom.getContentRect(segment);
				let delta = (segment.size.h - rect.h) * 0.5;
				for (let row of segment.atoms) {
					row.position.y += delta;
				}
			}
		} else if (this.style.align_y === "bottom") {
			for (let segment of segments) {
				let rect = Atom.getContentRect(segment);
				let delta = (segment.size.h - rect.h);
				for (let row of segment.atoms) {
					row.position.y += delta;
				}
			}
		}
		return segments;
	}

	protected getContentSegments(content_segment_size: Size, content_segment_left: Size, content_target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<ParentAtom> {
		if (this.style.layout === "horizontal") {
			return this.getConstrainedAndAlignedHorizontalContentSegments(content_segment_size, content_segment_left, content_target_size, options);
		} else {
			return this.getConstrainedAndAlignedVerticalContentSegments(content_segment_size, content_segment_left, content_target_size, options);
		}
	}

	constructor(style?: Partial<NodeStyle & BoxStyle>, ...children: Array<ChildNode>) {
		super(style, ...children);
		style = style ?? {};
		let align_x = style.align_x ?? "left";
		let align_y = style.align_y ?? "top";
		let background_color = style.background_color ?? "transparent";
		let border_color = style.border_color ?? "transparent";
		let border_radius = style.border_radius ?? 0;
		if (!Length.isValid(border_radius)) {
			throw new Error();
		}
		let border_width = style.border_width ?? 0;
		if (!Length.isValid(border_width)) {
			throw new Error();
		}
		let gap = style.gap ?? 0;
		if (!Length.isValid(gap)) {
			throw new Error();
		}
		let layout = style.layout ?? "vertical";
		let padding = style.padding ?? 0;
		if (!Length.isValid(padding)) {
			throw new Error();
		}
		this.style = {
			align_x,
			align_y,
			background_color,
			border_color,
			border_radius,
			border_width,
			gap,
			layout,
			padding
		};
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom> {
		segment_left = this.getSegmentLeft(segment_left);
		let push_segments = this.getPushSegments(segment_size, segment_left);
		if (push_segments.length > 0) {
			segment_left = { ...segment_size };
		}
		target_size = target_size ?? Node.getTargetSize(this, segment_size);
		options = options ?? {};
		let border_radius = Length.getComputedLength(this.style.border_radius, target_size.w);
		let border_width = Length.getComputedLength(this.style.border_width, target_size.w);
		let padding = Length.getComputedLength(this.style.padding, target_size.w);
		let inset_top = border_width + padding;
		let inset_right = border_width + padding;
		let inset_left = border_width + padding;
		let inset_bottom = border_width + padding;
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
		let segments = this.getContentSegments(content_segment_size, content_segment_left, content_target_size, options);
		for (let segment of segments) {
			for (let row of segment.atoms) {
				row.position.x += inset_left;
				row.position.y += inset_top;
			}
			segment.size.w += inset_left + inset_right;
			segment.size.h += inset_top + inset_bottom;
		}
		for (let segment of segments) {
			let path = Path.createRoundedRectangle(segment.size, border_radius);
			segment.prefix = this.createPrefixCommands(path);
			segment.suffix = [
				...this.createBorderCommands(segment.size, border_width, border_radius),
				...this.createSuffixCommands(path)
			];
		}
		return [
			...push_segments,
			...segments
		];
	}
};
