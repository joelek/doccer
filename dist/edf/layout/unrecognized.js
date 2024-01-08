"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrecognizedNode = void 0;
const shared_1 = require("./shared");
class UnrecognizedNode extends shared_1.ParentNode {
    constructor(style) {
        super(style);
    }
    createSegments(segment_size, segment_left, target_size, options) {
        segment_left = this.getSegmentLeft(segment_left);
        target_size = target_size ?? shared_1.Node.getTargetSize(this, segment_size);
        options = options ?? {};
        let segments = [];
        segments.push({
            size: {
                w: 0,
                h: 0
            }
        });
        for (let segment of segments) {
            shared_1.Size.constrain(segment.size, target_size);
        }
        return segments;
    }
}
exports.UnrecognizedNode = UnrecognizedNode;
;
