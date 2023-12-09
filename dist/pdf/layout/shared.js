"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentNode = exports.ChildNode = exports.Node = exports.Atom = exports.Rect = void 0;
const content = require("../content");
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
            context.concatenateMatrix(1, 0, 0, 1, atom.position.x, atom.position.y);
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
const Length = {
    getComputedLength(length, relative_to) {
        if (length === "intrinsic") {
            return;
        }
        if (length === "extrinsic") {
            if (relative_to == null) {
                throw new Error(`Unexpected relative length within intrinsic length!`);
            }
            return relative_to;
        }
        if (typeof length === "string") {
            if (relative_to == null) {
                throw new Error(`Unexpected relative length within intrinsic length!`);
            }
            return Math.max(0, Number.parseFloat(length.slice(0, -1))) * 0.01 * relative_to;
        }
        return length;
    }
};
class Node {
    node_style;
    appendNodeShape(context, size) {
        let rect = {
            x: 0,
            y: 0,
            w: size.w,
            h: size.h
        };
        context.appendRectangle(rect.x, 0 - rect.y - rect.h, rect.w, rect.h);
    }
    createPrefixCommands(size) {
        let context = content.createContext();
        if (this.node_style.overflow === "hidden") {
            this.appendNodeShape(context, size);
            context.setClippingPathUsingNonZeroWindingNumberRule();
            context.endPath();
        }
        return context.getCommands();
    }
    createSuffixCommands(size) {
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
    constrainSegmentSize(intrinsic_size, target_size) {
        if (target_size != null) {
            if (target_size.w != null) {
                intrinsic_size.w = target_size.w;
            }
            if (target_size.h != null) {
                intrinsic_size.h = target_size.h;
            }
        }
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
    static getTargetSize(node, parent_target_size) {
        let w = Length.getComputedLength(node.getWidth(), parent_target_size?.w);
        let h = Length.getComputedLength(node.getHeight(), parent_target_size?.h);
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
