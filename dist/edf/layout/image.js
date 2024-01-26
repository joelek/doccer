"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageNode = void 0;
const content = require("../../pdf/content");
const shared_1 = require("./shared");
class ImageNode extends shared_1.ChildNode {
    style;
    entry;
    constructor(image_handler, style) {
        super(style);
        style = style ?? {};
        let image = style.image ?? "default";
        let fit = style.fit ?? "contain";
        this.entry = image_handler.getEntry(image);
        this.style = {
            image,
            fit
        };
    }
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
    createBoxSegment(segment_size, segment_left, target_size) {
        let image_width = shared_1.AbsoluteLength.getComputedLength(this.entry.width, "px");
        let image_height = shared_1.AbsoluteLength.getComputedLength(this.entry.height, "px");
        let box_width = image_width;
        let box_height = image_height;
        if (target_size.w != null && target_size.h != null) {
            box_width = target_size.w;
            box_height = target_size.h;
        }
        else if (target_size.w != null) {
            box_width = target_size.w;
            box_height = image_width > 0 ? target_size.w * image_height / image_width : 0;
        }
        else if (target_size.h != null) {
            box_width = image_height > 0 ? target_size.h * image_width / image_height : 0;
            box_height = target_size.h;
        }
        let scaled_image_width = box_width;
        let scaled_image_height = box_height;
        let one = image_width * box_height;
        let two = box_width * image_height;
        let box_has_wider_proportions_than_image = one > two;
        if (this.style.fit === "contain") {
            if (box_has_wider_proportions_than_image) {
                scaled_image_width = box_width;
                scaled_image_height = image_width > 0 ? box_width * image_height / image_width : 0;
            }
            else {
                scaled_image_width = image_height > 0 ? box_height * image_width / image_height : 0;
                scaled_image_height = box_height;
            }
        }
        else if (this.style.fit === "cover") {
            if (box_has_wider_proportions_than_image) {
                scaled_image_width = image_height > 0 ? box_height * image_width / image_height : 0;
                scaled_image_height = box_height;
            }
            else {
                scaled_image_width = box_width;
                scaled_image_height = image_width > 0 ? box_width * image_height / image_width : 0;
            }
        }
        let sx = scaled_image_width;
        let sy = scaled_image_height;
        let dx = (box_width - scaled_image_width) * 0.5;
        let dy = (box_height - scaled_image_height) * 0.5;
        let context = content.createContext();
        context.concatenateMatrix(sx, 0, 0, sy, dx, dy - box_height);
        context.invokeNamedXObject(`I${this.entry.id}`);
        return {
            size: {
                w: box_width,
                h: box_height
            },
            prefix: context.getCommands()
        };
    }
    createSegments(segment_size, segment_left, target_size, options) {
        if (target_size == null) {
            target_size = shared_1.Node.getTargetSize(this, segment_size);
        }
        options = options ?? {};
        segment_left = this.getSegmentLeft(segment_left);
        let push_segments = this.getPushSegments(segment_size, segment_left);
        if (push_segments.length > 0) {
            segment_left = { ...segment_size };
        }
        let segments = [];
        let current_segment = {
            size: {
                w: 0,
                h: 0
            },
            atoms: []
        };
        let positioned_image = {
            ...this.createBoxSegment(segment_size, segment_left, target_size),
            position: {
                x: 0,
                y: 0
            }
        };
        current_segment.atoms.push(positioned_image);
        current_segment.size.w = Math.max(current_segment.size.w, positioned_image.position.x + positioned_image.size.w);
        current_segment.size.h = Math.max(current_segment.size.h, positioned_image.position.y + positioned_image.size.h);
        segments.push(current_segment);
        for (let segment of segments) {
            shared_1.Size.constrain(segment.size, target_size);
        }
        for (let segment of segments) {
            let path = shared_1.Path.createRectangle(segment.size);
            segment.prefix = this.createPrefixCommands(path);
            segment.suffix = this.createSuffixCommands(path);
        }
        return [
            ...push_segments,
            ...segments
        ];
    }
}
exports.ImageNode = ImageNode;
;
