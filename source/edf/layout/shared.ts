import * as content from "../../pdf/content";
import * as format from "../format";

export type Color = format.Color;

export const Color = {
	setFillColor(color: Color, context: content.Context): void {
		if ("i" in color) {
			context.setFillColorGrayscale(color.i);
		} else if ("r" in color && "g" in color && "b" in color) {
			context.setfillColorRGB(color.r, color.g, color.b);
		} else if ("c" in color && "m" in color && "y" in color && "k" in color) {
			context.setFillColorCMYK(color.c, color.m, color.y, color.k);
		}
	},

	setStrokeColor(color: Color, context: content.Context): void {
		if ("i" in color) {
			context.setStrokeColorGrayscale(color.i);
		} else if ("r" in color && "g" in color && "b" in color) {
			context.setStrokeColorRGB(color.r, color.g, color.b);
		} else if ("c" in color && "m" in color && "y" in color && "k" in color) {
			context.setStrokeColorCMYK(color.c, color.m, color.y, color.k);
		}
	}
};

export type Position = {
	x: number;
	y: number;
};

export type PathSegment = [Position | 0, Position | 0, Position];

export type Path = {
	start: Position;
	segments: Array<PathSegment>;
	closed: boolean;
};

export const Path = {
	append(path: Path, context: content.Context): void {
		context.beginNewSubpath(path.start.x, path.start.y);
		for (let [cp0, cp1, ep] of path.segments) {
			if (cp0 === 0) {
				if (cp1 === 0) {
					context.appendLineSegment(ep.x, ep.y);
				} else {
					context.appendCubicBezierCurveWithReplicatedInitalPoint(cp1.x, cp1.y, ep.x, ep.y);
				}
			} else {
				if (cp1 === 0) {
					context.appendCubicBezierCurveWithReplicatedFinalPoint(cp0.x, cp0.y, ep.x, ep.y);
				} else {
					context.appendCubicBezierCurve(cp0.x, cp0.y, cp1.x, cp1.y, ep.x, ep.y);
				}
			}
		}
		if (path.closed) {
			context.closeSubpath();
		}
	},

	createRectangle(size: Size): Path {
		let x1 = 0;
		let x2 = size.w;
		let y1 = 0;
		let y2 = 0 - size.h;
		let path: Path = {
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

	createRoundedRectangle(size: Size, border_radius: number): Path {
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
		let path: Path = {
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
			context.concatenateMatrix(1, 0, 0, 1, atom.position.x, 0 - atom.position.y);
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

const DPI72_POINTS_PER_PT = 1 / 1;
const DPI72_POINTS_PER_IN = 72 / 1;
const DPI72_POINTS_PER_PC = 72 / 12;
const DPI72_POINTS_PER_MM = 72 / 25.4;
const DPI72_POINTS_PER_CM = 72 / 2.54;
const DPI72_POINTS_PER_PX = 72 / 96;

export type AbsoluteLength = format.AbsoluteLength;

export const AbsoluteLength = {
	getComputedLength(length: AbsoluteLength, default_unit: format.AbsoluteUnit | undefined): number {
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
		if (unit === "px") {
			return value * DPI72_POINTS_PER_PX;
		}
		throw new Error(`Unexpected absolute unit!`);
	},

	isValid(length: AbsoluteLength, min_value = 0): boolean {
		if (typeof length === "number") {
			return length >= min_value;
		} else {
			return length[0] >= min_value;
		}
	}
};

export type Length = format.Length;

export const Length = {
	getComputedLength(length: Length, relative_to: number | undefined): number {
		if (typeof length === "number") {
			return length;
		}
		if (length[1] === "%") {
			if (relative_to == null) {
				throw new Error(`Unexpected relative length within intrinsic length!`);
			}
			return length[0] * 0.01 * relative_to;
		}
		return AbsoluteLength.getComputedLength(length, undefined);
	},

	isValid(length: Length, min_value = 0): boolean {
		if (typeof length === "number") {
			return length >= min_value;
		} else {
			return length[0] >= min_value;
		}
	}
};

export type NodeLength = format.NodeLength;

export const NodeLength = {
	getComputedLength(length: NodeLength, relative_to: number | undefined, fraction_length: number | undefined): number | undefined {
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
		return Length.getComputedLength(length, relative_to);
	},

	isFractional(length: NodeLength): length is [number, "fr"] {
		return Array.isArray(length) && length[1] === "fr";
	}
};

export type CreateSegmentsOptions = {
	text_operand: "bytestring" | "string";
};

export type NodeStyle = Required<format.NodeStyle>;

export abstract class Node {
	protected node_style: NodeStyle;

	protected createPrefixCommands(path: Path): Array<string> {
		let context = content.createContext();
		if (this.node_style.overflow === "hidden") {
			Path.append(path, context);
			context.setClippingPathUsingNonZeroWindingNumberRule();
			context.endPath();
		}
		return context.getCommands();
	}

	protected createSuffixCommands(path: Path): Array<string> {
		let context = content.createContext();
		return context.getCommands();
	}

	protected getPushSegments(segment_size: Size, segment_left: Size): Array<Atom> {
		if (this.node_style.segmentation === "auto" && Number.isFinite(segment_left.h) && Number.isFinite(segment_size.h)) {
			let segment_used = (segment_size.h - segment_left.h) / segment_size.h;
			if (segment_used > this.node_style.segmentation_threshold) {
				return [
					{
						size: {
							w: 0,
							h: Math.floor(segment_left.h * 1000) * 0.001 // TODO: Fix precision issue.
						}
					}
				];
			}
		}
		return [];
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
		let segmentation_threshold = style.segmentation_threshold ?? 1.0;
		if (segmentation === "auto" && height !== "intrinsic") {
			throw new Error();
		}
		let width = style.width ?? "intrinsic";
		this.node_style = {
			height,
			overflow,
			segmentation_threshold,
			segmentation,
			width
		};
	}

	abstract createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>, options?: Partial<CreateSegmentsOptions>): Array<Atom>;

	getHeight(): NodeLength {
		return this.node_style.height;
	}

	getWidth(): NodeLength {
		return this.node_style.width;
	}

	static getTargetSize(node: Node, parent_target_size: Partial<Size>, fraction_size?: Partial<Size>): Partial<Size> {
		let w = NodeLength.getComputedLength(node.getWidth(), parent_target_size.w, fraction_size?.w);
		let h = NodeLength.getComputedLength(node.getHeight(), parent_target_size.h, fraction_size?.h);
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
