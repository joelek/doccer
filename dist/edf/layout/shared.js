"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentNode = exports.ChildNode = exports.Node = exports.NodeLength = exports.Length = exports.AbsoluteLength = exports.Atom = exports.Rect = exports.Size = exports.Path = exports.Color = void 0;
const content = require("../../pdf/content");
exports.Color = {
    setFillColor(color, context) {
        if ("i" in color) {
            context.setFillColorGrayscale(color.i);
        }
        else if ("r" in color && "g" in color && "b" in color) {
            context.setfillColorRGB(color.r, color.g, color.b);
        }
        else if ("c" in color && "m" in color && "y" in color && "k" in color) {
            context.setFillColorCMYK(color.c, color.m, color.y, color.k);
        }
    },
    setStrokeColor(color, context) {
        if ("i" in color) {
            context.setStrokeColorGrayscale(color.i);
        }
        else if ("r" in color && "g" in color && "b" in color) {
            context.setStrokeColorRGB(color.r, color.g, color.b);
        }
        else if ("c" in color && "m" in color && "y" in color && "k" in color) {
            context.setStrokeColorCMYK(color.c, color.m, color.y, color.k);
        }
    }
};
exports.Path = {
    append(path, context) {
        context.beginNewSubpath(path.start.x, path.start.y);
        for (let [cp0, cp1, ep] of path.segments) {
            if (cp0 === 0) {
                if (cp1 === 0) {
                    context.appendLineSegment(ep.x, ep.y);
                }
                else {
                    context.appendCubicBezierCurveWithReplicatedInitalPoint(cp1.x, cp1.y, ep.x, ep.y);
                }
            }
            else {
                if (cp1 === 0) {
                    context.appendCubicBezierCurveWithReplicatedFinalPoint(cp0.x, cp0.y, ep.x, ep.y);
                }
                else {
                    context.appendCubicBezierCurve(cp0.x, cp0.y, cp1.x, cp1.y, ep.x, ep.y);
                }
            }
        }
        if (path.closed) {
            context.closeSubpath();
        }
    },
    createRectangle(size) {
        let x1 = 0;
        let x2 = size.w;
        let y1 = 0;
        let y2 = 0 - size.h;
        let path = {
            start: {
                x: x1,
                y: y1
            },
            segments: [
                [0, 0, { x: x1, y: y2 }],
                [0, 0, { x: x2, y: y2 }],
                [0, 0, { x: x2, y: y1 }]
            ],
            closed: true
        };
        return path;
    },
    createRoundedRectangle(size, border_radius) {
        border_radius = Math.min(border_radius, size.h * 0.5);
        border_radius = Math.min(border_radius, size.w * 0.5);
        if (border_radius === 0) {
            return this.createRectangle(size);
        }
        let f = (Math.SQRT2 - 1) * 4 / 3;
        let c1 = border_radius * f;
        let c2 = border_radius - c1;
        let x1 = 0;
        let x2 = c2;
        let x3 = border_radius;
        let x4 = (size.w - border_radius);
        let x5 = (size.w - c2);
        let x6 = size.w;
        let y1 = 0 - 0;
        let y2 = 0 - c2;
        let y3 = 0 - border_radius;
        let y4 = 0 - (size.h - border_radius);
        let y5 = 0 - (size.h - c2);
        let y6 = 0 - size.h;
        let path = {
            start: {
                x: x1,
                y: y4
            },
            segments: [
                [{ x: x1, y: y5 }, { x: x2, y: y6 }, { x: x3, y: y6 }],
                [0, 0, { x: x4, y: y6 }],
                [{ x: x5, y: y6 }, { x: x6, y: y5 }, { x: x6, y: y4 }],
                [0, 0, { x: x6, y: y3 }],
                [{ x: x6, y: y2 }, { x: x5, y: y1 }, { x: x4, y: y1 }],
                [0, 0, { x: x3, y: y1 }],
                [{ x: x2, y: y1 }, { x: x1, y: y2 }, { x: x1, y: y3 }]
            ],
            closed: true
        };
        return path;
    }
};
exports.Size = {
    constrain(intrinsic_size, target_size) {
        if (target_size != null) {
            if (target_size.w != null) {
                intrinsic_size.w = target_size.w;
            }
            if (target_size.h != null) {
                intrinsic_size.h = target_size.h;
            }
        }
    }
};
exports.Rect = {
    getUnion(one, two) {
        let x = Math.min(one.x, two.x);
        let y = Math.min(one.y, two.y);
        let w = Math.max(one.x + one.w, two.x + two.w) - x;
        let h = Math.max(one.y + one.h, two.y + two.h) - y;
        return {
            x,
            y,
            w,
            h
        };
    }
};
exports.Atom = {
    getPrefixCommands(atom) {
        let context = content.createContext();
        context.saveGraphicsState();
        if (atom.position != null && (atom.position.x !== 0 || atom.position.y !== 0)) {
            context.concatenateMatrix(1, 0, 0, 1, atom.position.x, 0 - atom.position.y);
        }
        return context.getCommands();
    },
    getSuffixCommands(atom) {
        let context = content.createContext();
        context.restoreGraphicsState();
        return context.getCommands();
    },
    getCommandsFromAtom(atom) {
        let commands = [];
        commands.push(...this.getPrefixCommands(atom));
        commands.push(...atom.prefix ?? []);
        commands.push(...this.getCommandsFromAtoms(atom.atoms ?? []));
        commands.push(...atom.suffix ?? []);
        commands.push(...this.getSuffixCommands(atom));
        return commands;
    },
    getCommandsFromAtoms(atoms) {
        let commands = [];
        for (let atom of atoms) {
            commands.push(...this.getCommandsFromAtom(atom));
        }
        return commands;
    },
    getContentRect(atom) {
        let rect;
        for (let subatom of atom.atoms) {
            if (rect == null) {
                rect = {
                    ...subatom.position,
                    ...subatom.size
                };
            }
            else {
                rect = exports.Rect.getUnion(rect, {
                    ...subatom.position,
                    ...subatom.size
                });
            }
        }
        if (rect == null) {
            return {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
        }
        else {
            return rect;
        }
    }
};
const DPI72_POINTS_PER_PT = 1 / 1;
const DPI72_POINTS_PER_IN = 72 / 1;
const DPI72_POINTS_PER_PC = 72 / 12;
const DPI72_POINTS_PER_MM = 72 / 25.4;
const DPI72_POINTS_PER_CM = 72 / 2.54;
exports.AbsoluteLength = {
    getComputedLength(length, default_unit) {
        if (typeof length === "number") {
            if (default_unit == null) {
                return length;
            }
            length = [length, default_unit];
        }
        let value = length[0];
        let unit = length[1];
        if (unit === "pt") {
            return value * DPI72_POINTS_PER_PT;
        }
        if (unit === "in") {
            return value * DPI72_POINTS_PER_IN;
        }
        if (unit === "pc") {
            return value * DPI72_POINTS_PER_PC;
        }
        if (unit === "mm") {
            return value * DPI72_POINTS_PER_MM;
        }
        if (unit === "cm") {
            return value * DPI72_POINTS_PER_CM;
        }
        throw new Error(`Unexpected absolute unit!`);
    },
    isValid(length, min_value = 0) {
        if (typeof length === "number") {
            return length >= min_value;
        }
        else {
            return length[0] >= min_value;
        }
    }
};
exports.Length = {
    getComputedLength(length, relative_to) {
        if (typeof length === "number") {
            return length;
        }
        if (length[1] === "%") {
            if (relative_to == null) {
                throw new Error(`Unexpected relative length within intrinsic length!`);
            }
            return length[0] * 0.01 * relative_to;
        }
        return exports.AbsoluteLength.getComputedLength(length, undefined);
    },
    isValid(length, min_value = 0) {
        if (typeof length === "number") {
            return length >= min_value;
        }
        else {
            return length[0] >= min_value;
        }
    }
};
exports.NodeLength = {
    getComputedLength(length, relative_to, fraction_length) {
        if (length === "intrinsic") {
            return;
        }
        if (length === "extrinsic") {
            if (relative_to == null) {
                throw new Error(`Unexpected relative length within intrinsic length!`);
            }
            return relative_to;
        }
        if (Array.isArray(length) && length[1] === "fr") {
            if (fraction_length == null) {
                throw new Error(`Unexpected fractional length within intrinsic length!`);
            }
            return length[0] * fraction_length;
        }
        return exports.Length.getComputedLength(length, relative_to);
    },
    isFractional(length) {
        return Array.isArray(length) && length[1] === "fr";
    }
};
class Node {
    node_style;
    createPrefixCommands(path) {
        let context = content.createContext();
        if (this.node_style.overflow === "hidden") {
            exports.Path.append(path, context);
            context.setClippingPathUsingNonZeroWindingNumberRule();
            context.endPath();
        }
        return context.getCommands();
    }
    createSuffixCommands(path) {
        let context = content.createContext();
        return context.getCommands();
    }
    getSegmentLeft(segment_left) {
        if (this.node_style.segmentation === "auto") {
            return segment_left;
        }
        else {
            return {
                w: segment_left.w,
                h: Infinity
            };
        }
        ;
    }
    constructor(style) {
        style = style ?? {};
        let height = style.height ?? "intrinsic";
        let overflow = style.overflow ?? "visible";
        let segmentation = style.segmentation ?? (height === "intrinsic" ? "auto" : "none");
        if (segmentation === "auto" && height !== "intrinsic") {
            throw new Error();
        }
        let width = style.width ?? "intrinsic";
        this.node_style = {
            height,
            overflow,
            segmentation,
            width
        };
    }
    getHeight() {
        return this.node_style.height;
    }
    getWidth() {
        return this.node_style.width;
    }
    static getTargetSize(node, parent_target_size, fraction_size) {
        let w = exports.NodeLength.getComputedLength(node.getWidth(), parent_target_size.w, fraction_size?.w);
        let h = exports.NodeLength.getComputedLength(node.getHeight(), parent_target_size.h, fraction_size?.h);
        return {
            w,
            h
        };
    }
}
exports.Node = Node;
;
class ChildNode extends Node {
    constructor(style) {
        super(style);
    }
}
exports.ChildNode = ChildNode;
;
class ParentNode extends ChildNode {
    children;
    constructor(style, ...children) {
        super(style);
        this.children = [...children];
    }
}
exports.ParentNode = ParentNode;
;
