"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalLayoutNode = void 0;
const content = require("../content");
const shared_1 = require("./shared");
class VerticalLayoutNode extends shared_1.ParentNode {
    style;
    createPrefixCommands(size) {
        let context = content.createContext();
        return [
            ...super.createPrefixCommands(size),
            ...context.getCommands()
        ];
    }
    createSuffixCommands(size) {
        let context = content.createContext();
        return [
            ...context.getCommands(),
            ...super.createSuffixCommands(size)
        ];
    }
    constructor(style, ...children) {
        super(style, ...children);
        style = style ?? {};
        let align_x = style.align_x ?? "left";
        let align_y = style.align_y ?? "top";
        let gap = style.gap ?? 0;
        if (gap < 0) {
            throw new Error();
        }
        this.style = {
            align_x,
            align_y,
            gap
        };
    }
    createSegments(segment_size, segment_left, target_size) {
        if (target_size == null) {
            target_size = shared_1.Node.getTargetSize(this, segment_size);
        }
        segment_left = this.getSegmentLeft(segment_left);
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
        let segments = [];
        let current_segment = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        let gap = 0;
        for (let child of this.children) {
            let child_segment_size = {
                w: 0,
                h: content_segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: Math.max(0, content_segment_left.h - (current_segment.size.h + gap))
            };
            let child_target_size = shared_1.Node.getTargetSize(child, content_target_size);
            let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size);
            for (let row of rows) {
                if (current_segment.size.h + gap + row.size.h <= content_segment_left.h) {
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
                        gap = 0;
                    }
                    content_segment_left = { ...content_segment_size };
                }
                let positioned_row = {
                    ...row,
                    position: {
                        x: 0,
                        y: current_segment.size.h + gap
                    }
                };
                current_segment.atoms.push(positioned_row);
                gap = this.style.gap;
                current_segment.size.w = Math.max(current_segment.size.w, positioned_row.position.x + positioned_row.size.w);
                current_segment.size.h = Math.max(current_segment.size.h, positioned_row.position.y + positioned_row.size.h);
            }
        }
        segments.push(current_segment);
        for (let segment of segments) {
            this.constrainSegmentSize(segment.size, content_target_size);
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
            segment.prefix = this.createPrefixCommands(segment.size);
            segment.suffix = this.createSuffixCommands(segment.size);
        }
        return segments;
    }
}
exports.VerticalLayoutNode = VerticalLayoutNode;
;
