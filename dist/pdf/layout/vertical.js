"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalNode = void 0;
const content = require("../content");
const shared_1 = require("./shared");
class VerticalNode extends shared_1.ParentNode {
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
                w = Math.max(w, width[0]);
            }
            let height = child.getHeight();
            if (shared_1.NodeLength.isFractional(height)) {
                h = h + height[0];
            }
        }
        return {
            w,
            h
        };
    }
    getSegmentsNone(segment_size, segment_left, target_size, options) {
        let gap = shared_1.Length.getComputedLength(this.style.gap, target_size.h);
        let fraction_size = {
            ...target_size
        };
        if (fraction_size.h != null) {
            fraction_size.h = Math.max(0, fraction_size.h - Math.max(0, this.children.length - 1) * gap);
        }
        let fractions = this.getFractions();
        if (fraction_size.w != null) {
            fraction_size.w /= fractions.w;
        }
        let segments = [];
        let current_segment = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        let child_row_arrays = [];
        for (let [index, child] of this.children.entries()) {
            let height = child.getHeight();
            if (shared_1.NodeLength.isFractional(height)) {
                continue;
            }
            let child_segment_size = {
                w: 0,
                h: segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: 0
            };
            let child_target_size = shared_1.Node.getTargetSize(child, target_size, fraction_size);
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
            if (!shared_1.NodeLength.isFractional(height)) {
                continue;
            }
            let child_segment_size = {
                w: 0,
                h: segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: 0
            };
            let child_target_size = shared_1.Node.getTargetSize(child, target_size, fraction_size);
            let child_atoms = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
            let child_height = child_atoms.reduce((sum, child_atom) => sum + child_atom.size.h, 0);
            child_row_arrays[index] = child_atoms;
        }
        let current_gap = 0;
        for (let child_row_array of child_row_arrays) {
            for (let child_row of child_row_array) {
                let positioned_row = {
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
    getSegmentsAuto(segment_size, segment_left, target_size, options) {
        let gap = shared_1.Length.getComputedLength(this.style.gap, target_size.h);
        let fraction_size = {
            ...target_size
        };
        let fractions = this.getFractions();
        if (fraction_size.w != null) {
            fraction_size.w /= fractions.w;
        }
        let segments = [];
        let current_segment = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        let current_gap = 0;
        for (let child of this.children) {
            let child_segment_size = {
                w: 0,
                h: segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: Math.max(0, segment_left.h - (current_segment.size.h + current_gap))
            };
            let child_target_size = shared_1.Node.getTargetSize(child, target_size, fraction_size);
            let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
            for (let row of rows) {
                if (current_segment.size.h + current_gap + row.size.h <= segment_left.h) {
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
                        current_gap = 0;
                    }
                    segment_left = { ...segment_size };
                }
                let positioned_row = {
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
    getSegments(segment_size, segment_left, target_size, options) {
        if (this.node_style.segmentation === "auto") {
            return this.getSegmentsAuto(segment_size, segment_left, target_size, options);
        }
        else {
            return this.getSegmentsNone(segment_size, segment_left, target_size, options);
        }
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
        options = options ?? {};
        segment_left = this.getSegmentLeft(segment_left);
        let segments = this.getSegments(segment_size, segment_left, target_size, options);
        for (let segment of segments) {
            shared_1.Size.constrain(segment.size, target_size);
        }
        if (this.style.align_x === "center") {
            for (let segment of segments) {
                for (let row of segment.atoms) {
                    row.position.x = (segment.size.w - row.size.w) * 0.5;
                }
            }
        }
        else if (this.style.align_x === "right") {
            for (let segment of segments) {
                for (let row of segment.atoms) {
                    row.position.x = (segment.size.w - row.size.w);
                }
            }
        }
        if (this.style.align_y === "middle") {
            for (let segment of segments) {
                let rect = shared_1.Atom.getContentRect(segment);
                let delta = (segment.size.h - rect.h) * 0.5;
                for (let row of segment.atoms) {
                    row.position.y += delta;
                }
            }
        }
        else if (this.style.align_y === "bottom") {
            for (let segment of segments) {
                let rect = shared_1.Atom.getContentRect(segment);
                let delta = (segment.size.h - rect.h);
                for (let row of segment.atoms) {
                    row.position.y += delta;
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
exports.VerticalNode = VerticalNode;
;
