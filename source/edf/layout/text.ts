import * as content from "../../pdf/content";
import { TextRenderingMode } from "../../pdf/content";
import { AbsoluteLength, Atom, ChildNode, Color, CreateSegmentsOptions, Length, Node, NodeStyle, ParentAtom, Path, PositionedAtom, Size } from "./shared";
import { MeasuredLine, Typesetter } from "../fonts";
import * as format from "../format";

export type TextStyle = Required<format.TextStyle>;

export class TextNode extends ChildNode {
	protected content: string;
	protected typesetter: Typesetter;
	protected type_id: number;
	protected style: TextStyle;

	protected createPrefixCommands(path: Path): Array<string> {
		let font_size = AbsoluteLength.getComputedLength(this.style.font_size, undefined);
		let line_height = AbsoluteLength.getComputedLength(this.style.line_height, undefined);
		let letter_spacing = AbsoluteLength.getComputedLength(this.style.letter_spacing, undefined);
		let word_spacing = AbsoluteLength.getComputedLength(this.style.word_spacing, undefined);
		let context = content.createContext();
		context.beginTextObject();
		context.setTextFontAndSize(`F${this.type_id}`, font_size);
		context.setTextLeading(line_height);
		if (letter_spacing > 0) {
			context.setCharacterSpacing(letter_spacing);
		}
		if (word_spacing > 0) {
			context.setWordSpacing(word_spacing);
		}
		if (typeof this.style.color !== "string") {
			Color.setFillColor(this.style.color, context);
		} else {
			context.setTextRenderingMode(TextRenderingMode.INVISIBLE);
		}
		let offset = this.getLineOffsetY();
		if (offset < 0 || offset > 0) {
			context.concatenateMatrix(1, 0, 0, 1, 0, offset);
		}
		return [
			...super.createPrefixCommands(path),
			...context.getCommands()
		];
	}

	protected createSuffixCommands(path: Path): Array<string> {
		let context = content.createContext();
		context.endTextObject();
		return [
			...context.getCommands(),
			...super.createSuffixCommands(path)
		];
	}

	protected getColumnWidth(target_size: Partial<Size>): number {
		let gutter = Length.getComputedLength(this.style.gutter, target_size.w);
		return Math.max(0, ((target_size.w ?? Infinity) - (this.style.columns - 1) * gutter) / this.style.columns);
	}

	protected getLineOffsetX(column_width: number, line_width: number): number {
		if (this.style.text_align === "start") {
			return 0;
		}
		if (this.style.text_align === "center") {
			return (column_width - line_width) * 0.5;
		}
		if (this.style.text_align === "end") {
			return (column_width - line_width);
		}
		return 0;
	}

	protected getLineOffsetY(): number {
		let font_size = AbsoluteLength.getComputedLength(this.style.font_size, undefined);
		if (this.style.line_anchor === "meanline") {
			return (0 - this.typesetter.getXHeight()) * font_size;
		}
		if (this.style.line_anchor === "capline") {
			return (0 - this.typesetter.getCapHeight()) * font_size;
		}
		if (this.style.line_anchor === "topline") {
			return (0 - this.typesetter.getAscent()) * font_size;
		}
		if (this.style.line_anchor === "bottomline") {
			return (0 - 1 + this.typesetter.getDescent()) * font_size;
		}
		if (this.style.line_anchor === "baseline") {
			return (0 - 1) * font_size;
		}
		return 0;
	}

	protected getTransformedContent(): string {
		if (this.style.text_transform === "none") {
			return this.content;
		}
		if (this.style.text_transform === "uppercase") {
			return this.content.toUpperCase();
		}
		if (this.style.text_transform === "lowercase") {
			return this.content.toLowerCase();
		}
		return this.content;
	}

	protected getLines(target_width: number): Array<MeasuredLine> {
		let font_size = AbsoluteLength.getComputedLength(this.style.font_size, undefined);
		let content = this.getTransformedContent();
		let lines = this.style.white_space === "wrap"
			? this.typesetter.wrapString(content, target_width / font_size)
			: this.typesetter.clampString(content, target_width / font_size);
		lines = lines.map((line) => {
			let line_string = line.line_string;
			let line_width = line.line_width * font_size;
			return {
				line_string,
				line_width
			};
		});
		return lines;
	}

	protected createLineSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<Atom> {
		let font_size = AbsoluteLength.getComputedLength(this.style.font_size, undefined);
		segment_left = this.getSegmentLeft(segment_left);
		let column_width = this.getColumnWidth(target_size);
		let lines = [] as Array<Atom>;
		for (let line of this.getLines(column_width)) {
			let w = line.line_width;
			let h = font_size;
			let size: Size = {
				w,
				h
			};
			let context = content.createContext();
			if (options?.text_operand === "bytestring") {
				context.showText(this.typesetter.getGlyphIndexArray(line.line_string));
			} else {
				context.showText(line.line_string);
			}
			lines.push({
				size: size,
				prefix: context.getCommands()
			});
		}
		return lines;
	}

	protected createColumnSegments(segment_size: Size, segment_left: Size, target_size: Partial<Size>, options: Partial<CreateSegmentsOptions>): Array<Atom> {
		let font_size = AbsoluteLength.getComputedLength(this.style.font_size, undefined);
		let line_height = AbsoluteLength.getComputedLength(this.style.line_height, undefined);
		segment_left = this.getSegmentLeft(segment_left);
		let columns = [] as Array<ParentAtom>;
		let current_column: ParentAtom = {
			size: {
				w: 0,
				h: 0
			},
			atoms: []
		};
		let lines = this.createLineSegments(segment_size, segment_left, target_size, options);
		let max_lines_in_current_column = Math.ceil(lines.length / this.style.columns);
		let gap = 0;
		let line_index = 0;
		for (let line of lines) {
			if (current_column.size.h + gap + line.size.h <= segment_left.h && current_column.atoms.length < max_lines_in_current_column) {
			} else {
				if (current_column.atoms.length > this.style.orphans - 1) {
					columns.push(current_column);
					current_column = {
						size: {
							w: 0,
							h: 0
						},
						atoms: []
					};
					gap = 0;
				}
				let column_index = columns.length % this.style.columns;
				if (column_index === 0) {
					max_lines_in_current_column = Math.ceil((lines.length - line_index) / this.style.columns);
					segment_left = { ...segment_size };
				}
			}
			let positioned_line: PositionedAtom = {
				...line,
				position: {
					x: 0,
					y: current_column.size.h + gap
				}
			};
			current_column.atoms.push(positioned_line);
			current_column.size.w = Math.max(current_column.size.w, positioned_line.position.x + positioned_line.size.w);
			current_column.size.h = Math.max(current_column.size.h, positioned_line.position.y + positioned_line.size.h);
			gap = line_height - font_size;
			line_index += 1;
		}
		columns.push(current_column);
		let target_column_width = this.getColumnWidth(target_size);
		for (let column of columns) {
			let column_width = Number.isFinite(target_column_width) ? target_column_width : column.size.w;
			for (let line of column.atoms) {
				line.position.x = this.getLineOffsetX(column_width, line.size.w);
			}
		}
		return columns;
	}

	constructor(content: string, typesetter: Typesetter, type_id: number, style?: Partial<NodeStyle & TextStyle>) {
		super(style);
		style = style ?? {};
		let color = style.color ?? "transparent";
		let columns = style.columns ?? 1;
		if (columns < 1 || !Number.isInteger(columns)) {
			throw new Error();
		}
		let font = style.font ?? "default";
		let font_size = style.font_size ?? 1;
		if (!Length.isValid(font_size, 1)) {
			throw new Error();
		}
		let gutter = style.gutter ?? 0;
		if (!Length.isValid(gutter)) {
			throw new Error();
		}
		let letter_spacing = style.letter_spacing ?? 0;
		if (!Length.isValid(letter_spacing)) {
			throw new Error();
		}
		let line_anchor = style.line_anchor ?? "capline";
		let line_height = style.line_height ?? font_size;
		if (line_height < font_size) {
			throw new Error();
		}
		let orphans = style.orphans ?? 1;
		if (orphans < 1 || !Number.isInteger(orphans)) {
			throw new Error();
		}
		let text_align = style.text_align ?? "start";
		let text_transform = style.text_transform ?? "none";
		let white_space = style.white_space ?? "wrap";
		let word_spacing = style.word_spacing ?? 0;
		if (!Length.isValid(word_spacing)) {
			throw new Error();
		}
		this.content = content;
		this.typesetter = typesetter.withOptions({
			letter_spacing: AbsoluteLength.getComputedLength(letter_spacing, undefined) / AbsoluteLength.getComputedLength(font_size, undefined),
			word_spacing: AbsoluteLength.getComputedLength(word_spacing, undefined) / AbsoluteLength.getComputedLength(font_size, undefined)
		});
		this.type_id = type_id;
		this.style = {
			color,
			columns,
			font,
			font_size,
			gutter,
			letter_spacing,
			line_anchor,
			line_height,
			orphans,
			text_align,
			text_transform,
			white_space,
			word_spacing
		};
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom> {
		if (target_size == null) {
			target_size = Node.getTargetSize(this, segment_size);
		}
		options = options ?? {};
		segment_left = this.getSegmentLeft(segment_left);
		let push_segments = this.getPushSegments(segment_size, segment_left);
		if (push_segments.length > 0) {
			segment_left = { ...segment_size };
		}
		let gutter = Length.getComputedLength(this.style.gutter, target_size.w);
		let target_column_width = this.getColumnWidth(target_size);
		let segments = [] as Array<ParentAtom>;
		let current_segment: ParentAtom = {
			size: {
				w: 0,
				h: 0
			},
			atoms: []
		};
		let columns = this.createColumnSegments(segment_size, segment_left, target_size, options);
		let current_gap = 0;
		for (let column of columns) {
			if (current_segment.atoms.length < this.style.columns) {
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
				segment_left = { ...segment_size };
				current_gap = 0;
			}
			column.size.w = Number.isFinite(target_column_width) ? target_column_width : column.size.w;
			let positioned_column: PositionedAtom = {
				...column,
				position: {
					x: current_segment.size.w + current_gap,
					y: 0
				}
			};
			current_segment.atoms.push(positioned_column);
			current_segment.size.w = Math.max(current_segment.size.w, positioned_column.position.x + positioned_column.size.w);
			current_segment.size.h = Math.max(current_segment.size.h, positioned_column.position.y + positioned_column.size.h);
			current_gap = gutter;
		}
		segments.push(current_segment);
		for (let segment of segments) {
			Size.constrain(segment.size, target_size);
		}
		for (let segment of segments) {
			let path = Path.createRectangle(segment.size);
			segment.prefix = this.createPrefixCommands(path);
			segment.suffix = this.createSuffixCommands(path);
		}
		return [
			...push_segments,
			...segments
		];
	}
};
