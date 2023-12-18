import { REAL, Operand, NAME, REAL_ARRAY, INTEGER, ArrayOperand, UnionOperand, TEXT } from "./operands";

type ExpansionOf<A> = A extends infer B ? { [C in keyof B]: B[C] } : never;
type IntersectionOfUnion<A> = (A extends any ? (_: A) => void : never) extends ((_: infer B) => void) ? B : never;

export type Command = {
	type: string;
	operands: readonly Operand<any>[];
	operator: string;
};

export const COMMANDS = [
	{
		type: "closeFillAndStrokePathUsingNonZeroWindingNumberRule",
		operands: [],
		operator: "b"
	},
	{
		type: "fillAndStrokePathUsingNonZeroWindingNumberRule",
		operands: [],
		operator: "B"
	},
	{
		type: "closeFillAndStrokePathUsingEvenOddRule",
		operands: [],
		operator: "b*"
	},
	{
		type: "fillAndStrokePathUsingEvenOddRule",
		operands: [],
		operator: "B*"
	},
	{
		type: "beginInlineImageObject",
		operands: [],
		operator: "BI"
	},
	{
		type: "beginTextObject",
		operands: [],
		operator: "BT"
	},
	{
		type: "appendCubicBezierCurve",
		operands: [REAL, REAL, REAL, REAL, REAL, REAL],
		operator: "c"
	},
	{
		type: "concatenateMatrix",
		operands: [REAL, REAL, REAL, REAL, REAL, REAL],
		operator: "cm"
	},
	{
		type: "setLineDashPattern",
		operands: [REAL_ARRAY, REAL],
		operator: "d"
	},
	{
		type: "setGlyphWidth",
		operands: [REAL, REAL],
		operator: "d0"
	},
	{
		type: "setGlyphWidthAndBoundingBox",
		operands: [REAL, REAL, REAL, REAL, REAL, REAL],
		operator: "d1"
	},
	{
		type: "invokeNamedXObject",
		operands: [NAME],
		operator: "Do"
	},
	{
		type: "endInlineImageObject",
		operands: [],
		operator: "EI"
	},
	{
		type: "endTextObject",
		operands: [],
		operator: "ET"
	},
	{
		type: "fillUsingNonZeroWindingNumberRule",
		operands: [],
		operator: "f"
	},
	{
		type: "fillUsingNonZeroWindingNumberRuleObsolete",
		operands: [],
		operator: "F"
	},
	{
		type: "fillUsingEvenOddRule",
		operands: [],
		operator: "f*"
	},
	{
		type: "setStrokeColorGrayscale",
		operands: [REAL],
		operator: "G"
	},
	{
		type: "setFillColorGrayscale",
		operands: [REAL],
		operator: "g"
	},
	{
		type: "closeSubpath",
		operands: [],
		operator: "h"
	},
	{
		type: "setFlatnessTolerance",
		operands: [REAL],
		operator: "i"
	},
	{
		type: "beginImageInlineData",
		operands: [],
		operator: "ID"
	},
	{
		type: "setLineJoinStyle",
		operands: [INTEGER],
		operator: "j"
	},
	{
		type: "setLineCapStyle",
		operands: [INTEGER],
		operator: "J"
	},
	{
		type: "setStrokeColorCMYK",
		operands: [REAL, REAL, REAL, REAL],
		operator: "K"
	},
	{
		type: "setFillColorCMYK",
		operands: [REAL, REAL, REAL, REAL],
		operator: "k"
	},
	{
		type: "appendLineSegment",
		operands: [REAL, REAL],
		operator: "l"
	},
	{
		type: "beginNewSubpath",
		operands: [REAL, REAL],
		operator: "m"
	},
	{
		type: "setMiterLimit",
		operands: [REAL],
		operator: "M"
	},
	{
		type: "endPath",
		operands: [],
		operator: "n"
	},
	{
		type: "saveGraphicsState",
		operands: [],
		operator: "q"
	},
	{
		type: "restoreGraphicsState",
		operands: [],
		operator: "Q"
	},
	{
		type: "appendRectangle",
		operands: [REAL, REAL, REAL, REAL],
		operator: "re"
	},
	{
		type: "setStrokeColorRGB",
		operands: [REAL, REAL, REAL],
		operator: "RG"
	},
	{
		type: "setfillColorRGB",
		operands: [REAL, REAL, REAL],
		operator: "rg"
	},
	{
		type: "setColorRenderingIntent",
		operands: [NAME],
		operator: "ri"
	},
	{
		type: "closeAndStrokePath",
		operands: [],
		operator: "s"
	},
	{
		type: "strokePath",
		operands: [],
		operator: "S"
	},
	{
		type: "moveToStartOfNextLine",
		operands: [],
		operator: "T*"
	},
	{
		type: "setCharacterSpacing",
		operands: [REAL],
		operator: "Tc"
	},
	{
		type: "moveTextPositionToNextLineWithOffset",
		operands: [REAL, REAL],
		operator: "Td"
	},
	{
		type: "moveTextPositionToNextLineWithOffsetAndSetLeading",
		operands: [REAL, REAL],
		operator: "TD"
	},
	{
		type: "setTextFontAndSize",
		operands: [NAME, REAL],
		operator: "Tf"
	},
	{
		type: "showText",
		operands: [TEXT],
		operator: "Tj"
	},
	{
		type: "showTexts",
		operands: [new ArrayOperand(new UnionOperand(TEXT, REAL))],
		operator: "TJ"
	},
	{
		type: "setTextLeading",
		operands: [REAL],
		operator: "TL"
	},
	{
		type: "setTextMatrixAndTextLineMatrix",
		operands: [REAL, REAL, REAL, REAL, REAL, REAL],
		operator: "Tm"
	},
	{
		type: "setTextRenderingMode",
		operands: [INTEGER],
		operator: "Tr"
	},
	{
		type: "setTextRise",
		operands: [REAL],
		operator: "Ts"
	},
	{
		type: "setWordSpacing",
		operands: [REAL],
		operator: "Tw"
	},
	{
		type: "setHorizontalTextScaling",
		operands: [REAL],
		operator: "Tz"
	},
	{
		type: "appendCubicBezierCurveWithReplicatedInitalPoint",
		operands: [REAL, REAL, REAL, REAL],
		operator: "v"
	},
	{
		type: "setStrokeWidth",
		operands: [REAL],
		operator: "w"
	},
	{
		type: "setClippingPathUsingNonZeroWindingNumberRule",
		operands: [],
		operator: "W"
	},
	{
		type: "setClippingPathUsingEvenOddRule",
		operands: [],
		operator: "W*"
	},
	{
		type: "appendCubicBezierCurveWithReplicatedFinalPoint",
		operands: [REAL, REAL, REAL, REAL],
		operator: "y"
	},
	{
		type: "moveToNextLineAndShowText",
		operands: [TEXT],
		operator: "'"
	},
	{
		type: "setWordAndCharacterSpacingMoveToNextLineAndShowText",
		operands: [REAL, REAL, TEXT],
		operator: "''"
	}
] as const;

export type Commands = typeof COMMANDS;

export type CommandType = Commands[number]["type"];

export type CommandRecordFromCommands<Commands extends readonly Command[]> = IntersectionOfUnion<{
	[Index in keyof Commands]: {
		[Type in Commands[Index]["type"]]: Commands[Index];
	}
}[number]>;

export type CommandRecord = CommandRecordFromCommands<Commands>;

export type ValuesFromOperands<A extends readonly Operand<any>[]> = {
	-readonly [B in keyof A]: A[B] extends Operand<infer C> ? C : never;
};

export type ValuesFromCommandType<A extends CommandType> = Array<any> & ValuesFromOperands<CommandRecord[A]["operands"]>;

export type ContextCommands = {
	[A in CommandType]: (...values: ValuesFromCommandType<A>) => void;
};

export type Context = ContextCommands & {
	getCommands(): Array<string>;
};

const CONTEXT_PROTOTYPE = (() => {
	let prototype = Object.create({});
	for (let command of COMMANDS) {
		Object.defineProperty(prototype, command.type, {
			value: function (...values: Array<any>) {
				let tokens = values.map((value, value_index) => (command.operands[value_index] as Operand<any>).getToken(value));
				tokens.push(command.operator);
				this.commands.push(tokens.join(" "));
			}
		});
	}
	Object.defineProperty(prototype, "getCommands", {
		value: function () {
			return this.commands;
		}
	});
	return prototype;
})();

export function createContext(): Context {
	let context = Object.create(CONTEXT_PROTOTYPE);
	context.commands = [];
	return context;
};

export enum LineCapStyle {
	BUTT_CAP = 0,
	ROUND_CAP = 1,
	PROJECTING_SQUARE_CAP = 2
};

export enum LineJoinStyle {
	MITER_JOIN = 0,
	ROUND_JOIN = 1,
	BEVEL_JOIN = 2
};

export enum TextRenderingMode {
	FILL = 0,
	STROKE = 1,
	FILL_THEN_STROKE = 2,
	INVISIBLE = 3,
	FILL_AND_ADD_TO_CLIPPING_PATH = 4,
	STROKE_AND_ADD_TO_CLIPPING_PATH = 5,
	FILL_THEN_STROKE_AND_ADD_TO_CLIPPING_PATH = 6,
	ADD_TO_CLIPPING_PATH = 7
};
