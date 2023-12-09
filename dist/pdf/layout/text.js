"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNode = void 0;
const content = require("../content");
const content_1 = require("../content");
const shared_1 = require("./shared");
class TextNode extends shared_1.ChildNode {
    content;
    typesetter;
    style;
    createPrefixCommands(size) {
        let context = content.createContext();
        context.beginTextObject();
        context.setTextFontAndSize("F1", this.style.font_size);
        context.setTextLeading(this.style.line_height);
        if (this.style.letter_spacing > 0) {
            context.setCharacterSpacing(this.style.letter_spacing);
        }
        if (this.style.word_spacing > 0) {
            context.setWordSpacing(this.style.word_spacing);
        }
        if (this.style.color !== "transparent") {
            context.setfillColorRGB(...this.style.color);
        }
        else {
            context.setTextRenderingMode(content_1.TextRenderingMode.INVISIBLE);
        }
        let offset = this.getLineOffsetY();
        if (offset < 0 || offset > 0) {
            context.concatenateMatrix(1, 0, 0, 1, 0, offset);
        }
        return [
            ...super.createPrefixCommands(size),
            ...context.getCommands()
        ];
    }
    createSuffixCommands(size) {
        let context = content.createContext();
        context.endTextObject();
        return [
            ...context.getCommands(),
            ...super.createSuffixCommands(size)
        ];
    }
    getColumnWidth(target_size) {
        return Math.max(0, ((target_size.w ?? Infinity) - (this.style.columns - 1) * this.style.gutter) / this.style.columns);
    }
    getLineOffsetX(column_width, line_width) {
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
    getLineOffsetY() {
        if (this.style.line_anchor === "meanline") {
            return (0 - this.typesetter.getCharacterBox("x").y_max) * this.style.font_size;
        }
        if (this.style.line_anchor === "capline") {
            return (0 - this.typesetter.getCharacterBox("I").y_max) * this.style.font_size;
        }
        if (this.style.line_anchor === "topline") {
            return (0 - this.typesetter.getCharacterBox("").y_max) * this.style.font_size;
        }
        if (this.style.line_anchor === "bottomline") {
            return (0 - 1 + this.typesetter.getCharacterBox("").y_min) * this.style.font_size;
        }
        if (this.style.line_anchor === "baseline") {
            return (0 - 1) * this.style.font_size;
        }
        return 0;
    }
    getTransformedContent() {
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
    getLines(target_width) {
        let content = this.getTransformedContent();
        let lines = this.style.white_space === "wrap"
            ? this.typesetter.wrapString(content, target_width / this.style.font_size)
            : this.typesetter.clampString(content, target_width / this.style.font_size);
        lines = lines.map((line) => {
            let line_string = line.line_string;
            let line_width = line.line_width * this.style.font_size;
            return {
                line_string,
                line_width
            };
        });
        return lines;
    }
    createLineSegments(segment_size, segment_left, target_size) {
        segment_left = this.getSegmentLeft(segment_left);
        let column_width = this.getColumnWidth(target_size);
        let lines = [];
        for (let line of this.getLines(column_width)) {
            let w = line.line_width;
            let h = this.style.font_size;
            let size = {
                w,
                h
            };
            let context = content.createContext();
            context.showText(line.line_string);
            lines.push({
                size: size,
                prefix: context.getCommands()
            });
        }
        return lines;
    }
    createColumnSegments(segment_size, segment_left, target_size) {
        segment_left = this.getSegmentLeft(segment_left);
        let columns = [];
        let current_column = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        let lines = this.createLineSegments(segment_size, segment_left, target_size);
        let max_lines_in_current_column = Math.ceil(lines.length / this.style.columns);
        let gap = 0;
        let line_index = 0;
        for (let line of lines) {
            if (current_column.size.h + gap + line.size.h <= segment_left.h && current_column.atoms.length < max_lines_in_current_column) {
            }
            else {
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
            let positioned_line = {
                ...line,
                position: {
                    x: 0,
                    y: current_column.size.h + gap
                }
            };
            current_column.atoms.push(positioned_line);
            current_column.size.w = Math.max(current_column.size.w, positioned_line.position.x + positioned_line.size.w);
            current_column.size.h = Math.max(current_column.size.h, positioned_line.position.y + positioned_line.size.h);
            gap = this.style.line_height - this.style.font_size;
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
    constructor(content, typesetter, style) {
        super(style);
        style = style ?? {};
        let color = style.color ?? "transparent";
        let columns = style.columns ?? 1;
        if (columns < 1 || !Number.isInteger(columns)) {
            throw new Error();
        }
        let font_size = style.font_size ?? 1;
        if (font_size < 1) {
            throw new Error();
        }
        let gutter = style.gutter ?? 0;
        if (gutter < 0) {
            throw new Error();
        }
        let letter_spacing = style.letter_spacing ?? 0;
        if (letter_spacing < 0) {
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
        if (word_spacing < 0) {
            throw new Error();
        }
        this.content = content;
        this.typesetter = typesetter.withOptions({
            letter_spacing: letter_spacing / font_size,
            word_spacing: word_spacing / font_size
        });
        this.style = {
            color,
            columns,
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
    createSegments(segment_size, segment_left, target_size) {
        if (target_size == null) {
            target_size = shared_1.Node.getTargetSize(this, segment_size);
        }
        segment_left = this.getSegmentLeft(segment_left);
        let target_column_width = this.getColumnWidth(target_size);
        let segments = [];
        let current_segment = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        let columns = this.createColumnSegments(segment_size, segment_left, target_size);
        let gap = 0;
        for (let column of columns) {
            if (current_segment.atoms.length < this.style.columns) {
            }
            else {
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
                gap = 0;
            }
            column.size.w = Number.isFinite(target_column_width) ? target_column_width : column.size.w;
            let positioned_column = {
                ...column,
                position: {
                    x: current_segment.size.w + gap,
                    y: 0
                }
            };
            current_segment.atoms.push(positioned_column);
            current_segment.size.w = Math.max(current_segment.size.w, positioned_column.position.x + positioned_column.size.w);
            current_segment.size.h = Math.max(current_segment.size.h, positioned_column.position.y + positioned_column.size.h);
            gap = this.style.gutter;
        }
        segments.push(current_segment);
        for (let segment of segments) {
            this.constrainSegmentSize(segment.size, target_size);
        }
        for (let segment of segments) {
            segment.prefix = this.createPrefixCommands(segment.size);
            segment.suffix = this.createSuffixCommands(segment.size);
        }
        return segments;
    }
}
exports.TextNode = TextNode;
;
