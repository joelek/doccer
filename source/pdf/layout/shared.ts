import * as content from "../content";

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	w: number;
	h: number;
};

export const Size = {
	constrain(intrinsic_size: Size, target_size?: Partial<Size>): void {
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

export type Rect = Position & Size;

export const Rect = {
	getUnion(one: Rect, two: Rect): Rect {
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

export type Atom = {
	size: Size;
	position?: Position;
	prefix?: Array<string>;
	atoms?: Array<PositionedAtom>;
	suffix?: Array<string>;
};

export type PositionedAtom = Atom & {
	position: Position;
};

export type ParentAtom = Atom & {
	atoms: Array<PositionedAtom>;
};

export const Atom = {
	getPrefixCommands(atom: Atom): Array<string> {
		let context = content.createContext();
		context.saveGraphicsState();
		if (atom.position != null && (atom.position.x !== 0 || atom.position.y !== 0)) {
			context.concatenateMatrix(1, 0, 0, 1, atom.position.x, atom.position.y);
		}
		return context.getCommands();
	},

	getSuffixCommands(atom: Atom): Array<string> {
		let context = content.createContext();
		context.restoreGraphicsState();
		return context.getCommands();
	},

	getCommandsFromAtom(atom: Atom): Array<string> {
		let commands = [] as Array<string>;
		commands.push(...this.getPrefixCommands(atom));
		commands.push(...atom.prefix ?? []);
		commands.push(...this.getCommandsFromAtoms(atom.atoms ?? []));
		commands.push(...atom.suffix ?? []);
		commands.push(...this.getSuffixCommands(atom));
		return commands;
	},

	getCommandsFromAtoms(atoms: Array<Atom>): Array<string> {
		let commands = [] as Array<string>;
		for (let atom of atoms) {
			commands.push(...this.getCommandsFromAtom(atom));
		}
		return commands;
	},

	getContentRect(atom: ParentAtom): Rect {
		let rect: Rect | undefined;
		for (let subatom of atom.atoms) {
			if (rect == null) {
				rect = {
					...subatom.position,
					...subatom.size
				}
			} else {
				rect = Rect.getUnion(rect, {
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
		} else {
			return rect;
		}
	}
};

export type Length = number | [number, "%"?];

export const Length = {
	getComputedLength(length: Length, relative_to: number | undefined): number {
		if (typeof length === "number") {
			return length;
		} else {
			if (length[1] === "%") {
				if (relative_to == null) {
					throw new Error(`Unexpected relative length within intrinsic length!`);
				}
				return length[0] * 0.01 * relative_to;
			} else {
				return length[0];
			}
		}
	}
};

export type NodeLength = Length | "intrinsic" | "extrinsic";

export const NodeLength = {
	getComputedLength(length: NodeLength, relative_to: number | undefined): number | undefined {
		if (length === "intrinsic") {
			return;
		}
		if (length === "extrinsic") {
			if (relative_to == null) {
				throw new Error(`Unexpected relative length within intrinsic length!`);
			}
			return relative_to;
		}
		return Length.getComputedLength(length, relative_to);
	}
};

export type NodeStyle = {
	height: NodeLength;
	overflow: "hidden" | "visible";
	segmentation: "auto" | "none";
	width: NodeLength;
};

export abstract class Node {
	protected node_style: NodeStyle;

	protected appendNodeShape(context: content.Context, size: Size): void {
		let rect: Rect = {
			x: 0,
			y: 0,
			w: size.w,
			h: size.h
		};
		context.appendRectangle(rect.x, 0 - rect.y - rect.h, rect.w, rect.h);
	}

	protected createPrefixCommands(size: Size): Array<string> {
		let context = content.createContext();
		if (this.node_style.overflow === "hidden") {
			this.appendNodeShape(context, size);
			context.setClippingPathUsingNonZeroWindingNumberRule();
			context.endPath();
		}
		return context.getCommands();
	}

	protected createSuffixCommands(size: Size): Array<string> {
		let context = content.createContext();
		return context.getCommands();
	}

	protected getSegmentLeft(segment_left: Size): Size {
		if (this.node_style.segmentation === "auto") {
			return segment_left;
		} else {
			return {
				w: segment_left.w,
				h: Infinity
			};
		};
	}

	constructor(style?: Partial<NodeStyle>) {
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

	abstract createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom>;

	getHeight(): NodeLength {
		return this.node_style.height;
	}

	getWidth(): NodeLength {
		return this.node_style.width;
	}

	static getTargetSize(node: Node, parent_target_size?: Partial<Size>): Partial<Size> {
		let w = NodeLength.getComputedLength(node.getWidth(), parent_target_size?.w);
		let h = NodeLength.getComputedLength(node.getHeight(), parent_target_size?.h);
		return {
			w,
			h
		};
	}
};

export abstract class ChildNode extends Node {
	constructor(style?: Partial<NodeStyle>) {
		super(style);
	}
};

export abstract class ParentNode extends ChildNode {
	protected children: Array<ChildNode>;

	constructor(style?: Partial<NodeStyle>, ...children: Array<ChildNode>) {
		super(style);
		this.children = [...children];
	}
};
