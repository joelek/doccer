"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxNode = void 0;
const content = require("../content");
const shared_1 = require("./shared");
class BoxNode extends shared_1.ParentNode {
    style;
    createPrefixCommands(path) {
        let context = content.createContext();
        if (this.style.background_color !== "transparent") {
            shared_1.Color.setFillColor(this.style.background_color, context);
            shared_1.Path.append(path, context);
            context.fillUsingNonZeroWindingNumberRule();
        }
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
    createBorderCommands(size, border_width, border_radius) {
        let context = content.createContext();
        if (this.style.border_color !== "transparent") {
            shared_1.Color.setStrokeColor(this.style.border_color, context);
        }
        if (border_width > 0) {
            let clamped_border_radius = Math.max(0, border_radius - border_width * 0.5);
            context.concatenateMatrix(1, 0, 0, 1, border_width * 0.5, 0 - border_width * 0.5);
            context.setStrokeWidth(border_width);
            let border_path = shared_1.Path.createRoundedRectangle({
                w: Math.max(0, size.w - border_width),
                h: Math.max(0, size.h - border_width)
            }, clamped_border_radius);
            shared_1.Path.append(border_path, context);
            context.strokePath();
        }
        return context.getCommands();
    }
    constructor(style, ...children) {
        super(style, ...children);
        style = style ?? {};
        let background_color = style.background_color ?? "transparent";
        let border_color = style.border_color ?? "transparent";
        let border_radius = style.border_radius ?? 0;
        if (!shared_1.Length.isValid(border_radius)) {
            throw new Error();
        }
        let border_width = style.border_width ?? 0;
        if (!shared_1.Length.isValid(border_width)) {
            throw new Error();
        }
        let padding = style.padding ?? 0;
        if (!shared_1.Length.isValid(padding)) {
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
    createSegments(segment_size, segment_left, target_size, options) {
        if (target_size == null) {
            target_size = shared_1.Node.getTargetSize(this, segment_size);
        }
        options = options ?? {};
        segment_left = this.getSegmentLeft(segment_left);
        let border_radius = shared_1.Length.getComputedLength(this.style.border_radius, target_size.w);
        let border_width = shared_1.Length.getComputedLength(this.style.border_width, target_size.w);
        let padding = shared_1.Length.getComputedLength(this.style.padding, target_size.w);
        let inset_top = border_width + padding;
        let inset_right = border_width + padding;
        let inset_left = border_width + padding;
        let inset_bottom = border_width + padding;
        let content_segment_size = {
            w: 0,
            h: Math.max(0, segment_size.h - inset_top - inset_bottom)
        };
        let content_segment_left = {
            w: 0,
            h: Math.max(0, segment_left.h - inset_top - inset_bottom)
        };
        let content_target_size = {
            w: target_size.w == null ? undefined : Math.max(0, target_size.w - inset_left - inset_right),
            h: target_size.h == null ? undefined : Math.max(0, target_size.h - inset_top - inset_bottom)
        };
        let segments = [];
        let current_segment = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        for (let child of this.children) {
            let child_segment_size = {
                w: 0,
                h: content_segment_size.h
            };
            let child_segment_left = {
                w: 0,
                h: Math.max(0, content_segment_left.h - current_segment.size.h)
            };
            let child_target_size = shared_1.Node.getTargetSize(child, content_target_size);
            let rows = child.createSegments(child_segment_size, child_segment_left, child_target_size, options);
            for (let row of rows) {
                if (current_segment.size.h + row.size.h <= content_segment_left.h) {
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
                    content_segment_left = { ...content_segment_size };
                }
                let positioned_row = {
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
            shared_1.Size.constrain(segment.size, content_target_size);
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
            let path = shared_1.Path.createRoundedRectangle(segment.size, border_radius);
            segment.prefix = this.createPrefixCommands(path);
            segment.suffix = [
                ...this.createBorderCommands(segment.size, border_width, border_radius),
                ...this.createSuffixCommands(path)
            ];
        }
        return segments;
    }
}
exports.BoxNode = BoxNode;
;
