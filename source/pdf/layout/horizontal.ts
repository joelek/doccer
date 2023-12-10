import * as content from "../content";
import { Atom, ChildNode, Length, Node, NodeStyle, ParentAtom, ParentNode, PositionedAtom, Size } from "./shared";

export type HorizontalLayoutStyle = {
	align_x: "left" | "center" | "right";
	align_y: "top" | "middle" | "bottom";
	gap: Length;
};

export class HorizontalLayoutNode extends ParentNode {
	protected style: HorizontalLayoutStyle;

	protected createPrefixCommands(size: Size): Array<string> {
		let context = content.createContext();
		return [
			...super.createPrefixCommands(size),
			...context.getCommands()
		];
	}

	protected createSuffixCommands(size: Size): Array<string> {
		let context = content.createContext();
		return [
			...context.getCommands(),
			...super.createSuffixCommands(size)
		];
	}

	constructor(style?: Partial<NodeStyle & HorizontalLayoutStyle>, ...children: Array<ChildNode>) {
		super(style, ...children);
		style = style ?? {};
		let align_x = style.align_x ?? "left";
		let align_y = style.align_y ?? "top";
		let gap = style.gap ?? 0;
		if (typeof gap === "number") {
			if (gap < 0) {
				throw new Error();
			}
		} else {
			if (gap[0] < 0) {
				throw new Error();
			}
		}
		this.style = {
			align_x,
			align_y,
			gap
		};
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom> {
		if (target_size == null) {
			target_size = Node.getTargetSize(this, segment_size);
		}
		segment_left = this.getSegmentLeft(segment_left);
		let gap = Length.getComputedLength(this.style.gap, target_size.w);
		let content_segment_size: Size = {
			w: 0,
			h: Math.max(0, segment_size.h)
		};
		let content_segment_left: Size = {
			w: 0,
			h: Math.max(0, segment_left.h)
		};
		let content_target_size: Partial<Size> = {
			w: target_size.w == null ? undefined : Math.max(0, target_size.w),
			h: target_size.h == null ? undefined : Math.max(0, target_size.h)
		};
		let column_rows = [] as Array<Array<Atom>>;
		let max_column_rows = 0;
		for (let child of this.children) {
			let child_segment_size: Size = {
				w: 0,
				h: content_segment_size.h
			};
			let child_segment_left: Size = {
				w: 0,
				h: content_segment_left.h
			};
			let child_target_size = Node.getTargetSize(child, content_target_size);
			let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size);
			column_rows.push(rows);
			max_column_rows = Math.max(max_column_rows, rows.length);
		}
		let column_widths = [] as Array<number>;
		for (let column_row of column_rows) {
			let column_width = column_row.reduce((max, row) => Math.max(max, row.size.w), 0);
			column_widths.push(column_width);
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
			let index = 0;
			for (let column_rows of columns) {
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
				index += 1;
			}
		}
		segments.push(current_segment);
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
		for (let segment of segments) {
			segment.prefix = this.createPrefixCommands(segment.size);
			segment.suffix = this.createSuffixCommands(segment.size);
		}
		return segments;
	}
};
