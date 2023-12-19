"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalNode = void 0;
const content = require("../../pdf/content");
const shared_1 = require("./shared");
class HorizontalNode extends shared_1.ParentNode {
    style;
    createPrefixCommands(path) {
        let context = content.createContext();
        return [
            ...super.createPrefixCommands(path),
            ...context.getCommands()
        ];
    }
    createSuffixCommands(path) {
        let context = content.createContext();
        return [
            ...context.getCommands(),
            ...super.createSuffixCommands(path)
        ];
    }
    getFractions() {
        let w = 0;
        let h = 0;
        for (let child of this.children) {
            let width = child.getWidth();
            if (shared_1.NodeLength.isFractional(width)) {
                w = w + width[0];
            }
            let height = child.getHeight();
            if (shared_1.NodeLength.isFractional(height)) {
                h = Math.max(h, height[0]);
            }
        }
        return {
            w,
            h
        };
    }
    constructor(style, ...children) {
        super(style, ...children);
        style = style ?? {};
        let align_x = style.align_x ?? "left";
        let align_y = style.align_y ?? "top";
        let gap = style.gap ?? 0;
        if (!shared_1.Length.isValid(gap)) {
            throw new Error();
        }
        this.style = {
            align_x,
            align_y,
            gap
        };
    }
    createSegments(segment_size, segment_left, target_size, options) {
        if (target_size == null) {
            target_size = shared_1.Node.getTargetSize(this, segment_size);
        }
        segment_left = this.getSegmentLeft(segment_left);
        let gap = shared_1.Length.getComputedLength(this.style.gap, target_size.w);
        let content_segment_size = {
            w: 0,
            h: Math.max(0, segment_size.h)
        };
        let content_segment_left = {
            w: 0,
            h: Math.max(0, segment_left.h)
        };
        let content_target_size = {
            w: target_size.w == null ? undefined : Math.max(0, target_size.w),
            h: target_size.h == null ? undefined : Math.max(0, target_size.h)
        };
        let column_rows = [];
        let column_widths = [];
        let max_column_rows = 0;
        let fraction_size = {
            w: content_target_size.w,
            h: content_target_size.h
        };
        if (fraction_size.w != null) {
            fraction_size.w = Math.max(0, fraction_size.w - Math.max(0, this.children.length - 1) * gap);
        }
        let fractions = this.getFractions();
        if (fraction_size.h != null) {
            fraction_size.h /= fractions.h;
        }
        for (let [index, child] of this.children.entries()) {
            let width = child.getWidth();
            if (shared_1.NodeLength.isFractional(width)) {
                continue;
            }
            let child_segment_size = {
                w: 0,
                h: content_segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: content_segment_left.h
            };
            let child_target_size = shared_1.Node.getTargetSize(child, content_target_size, fraction_size);
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
            if (!shared_1.NodeLength.isFractional(width)) {
                continue;
            }
            let child_segment_size = {
                w: 0,
                h: content_segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: content_segment_left.h
            };
            let child_target_size = shared_1.Node.getTargetSize(child, content_target_size, fraction_size);
            let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
            column_rows[index] = rows;
            max_column_rows = Math.max(max_column_rows, rows.length);
            let column_width = rows.reduce((max, row) => Math.max(max, row.size.w), 0);
            column_widths[index] = column_width;
        }
        let rows = [];
        if (this.node_style.segmentation === "auto") {
            for (let i = 0; i < Math.max(1, max_column_rows); i++) {
                let row = [];
                for (let j = 0; j < column_rows.length; j++) {
                    row.push(column_rows[j].slice(i, i + 1));
                }
                rows.push(row);
            }
        }
        else {
            rows.push(column_rows);
        }
        let segments = [];
        let current_segment = {
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
                let column = {
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
                    let positioned_column_row = {
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
        for (let segment of segments) {
            shared_1.Size.constrain(segment.size, content_target_size);
        }
        if (this.style.align_x === "center") {
            for (let segment of segments) {
                let rect = shared_1.Atom.getContentRect(segment);
                let delta = (segment.size.w - rect.w) * 0.5;
                for (let row of segment.atoms) {
                    row.position.x += delta;
                }
            }
        }
        else if (this.style.align_x === "right") {
            for (let segment of segments) {
                let rect = shared_1.Atom.getContentRect(segment);
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
        }
        else if (this.style.align_y === "bottom") {
            for (let segment of segments) {
                for (let column_atom of segment.atoms) {
                    column_atom.position.y = (segment.size.h - column_atom.size.h);
                }
            }
        }
        for (let segment of segments) {
            let path = shared_1.Path.createRectangle(segment.size);
            segment.prefix = this.createPrefixCommands(path);
            segment.suffix = this.createSuffixCommands(path);
        }
        return segments;
    }
}
exports.HorizontalNode = HorizontalNode;
;
