import { Operand, ArrayOperand } from "./operands";
type IntersectionOfUnion<A> = (A extends any ? (_: A) => void : never) extends ((_: infer B) => void) ? B : never;
export type Command = {
    type: string;
    operands: readonly Operand<any>[];
    operator: string;
};
export declare const COMMANDS: readonly [{
    readonly type: "closeFillAndStrokePathUsingNonZeroWindingNumberRule";
    readonly operands: readonly [];
    readonly operator: "b";
}, {
    readonly type: "fillAndStrokePathUsingNonZeroWindingNumberRule";
    readonly operands: readonly [];
    readonly operator: "B";
}, {
    readonly type: "closeFillAndStrokePathUsingEvenOddRule";
    readonly operands: readonly [];
    readonly operator: "b*";
}, {
    readonly type: "fillAndStrokePathUsingEvenOddRule";
    readonly operands: readonly [];
    readonly operator: "B*";
}, {
    readonly type: "beginInlineImageObject";
    readonly operands: readonly [];
    readonly operator: "BI";
}, {
    readonly type: "beginTextObject";
    readonly operands: readonly [];
    readonly operator: "BT";
}, {
    readonly type: "appendCubicBezierCurve";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "c";
}, {
    readonly type: "concatenateMatrix";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "cm";
}, {
    readonly type: "setLineDashPattern";
    readonly operands: readonly [ArrayOperand<number>, import("./operands").RealOperand];
    readonly operator: "d";
}, {
    readonly type: "setGlyphWidth";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "d0";
}, {
    readonly type: "setGlyphWidthAndBoundingBox";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "d1";
}, {
    readonly type: "invokeNamedXObject";
    readonly operands: readonly [import("./operands").NameOperand];
    readonly operator: "Do";
}, {
    readonly type: "endInlineImageObject";
    readonly operands: readonly [];
    readonly operator: "EI";
}, {
    readonly type: "endTextObject";
    readonly operands: readonly [];
    readonly operator: "ET";
}, {
    readonly type: "fillUsingNonZeroWindingNumberRule";
    readonly operands: readonly [];
    readonly operator: "f";
}, {
    readonly type: "fillUsingNonZeroWindingNumberRuleObsolete";
    readonly operands: readonly [];
    readonly operator: "F";
}, {
    readonly type: "fillUsingEvenOddRule";
    readonly operands: readonly [];
    readonly operator: "f*";
}, {
    readonly type: "setStrokeColorGrayscale";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "G";
}, {
    readonly type: "setFillColorGrayscale";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "g";
}, {
    readonly type: "closeSubpath";
    readonly operands: readonly [];
    readonly operator: "h";
}, {
    readonly type: "setFlatnessTolerance";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "i";
}, {
    readonly type: "beginImageInlineData";
    readonly operands: readonly [];
    readonly operator: "ID";
}, {
    readonly type: "setLineJoinStyle";
    readonly operands: readonly [import("./operands").IntegerOperand];
    readonly operator: "j";
}, {
    readonly type: "setLineCapStyle";
    readonly operands: readonly [import("./operands").IntegerOperand];
    readonly operator: "J";
}, {
    readonly type: "setStrokeColorCMYK";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "K";
}, {
    readonly type: "setFillColorCMYK";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "k";
}, {
    readonly type: "appendLineSegment";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "l";
}, {
    readonly type: "beginNewSubpath";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "m";
}, {
    readonly type: "setMiterLimit";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "M";
}, {
    readonly type: "endPath";
    readonly operands: readonly [];
    readonly operator: "n";
}, {
    readonly type: "saveGraphicsState";
    readonly operands: readonly [];
    readonly operator: "q";
}, {
    readonly type: "restoreGraphicsState";
    readonly operands: readonly [];
    readonly operator: "Q";
}, {
    readonly type: "appendRectangle";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "re";
}, {
    readonly type: "setStrokeColorRGB";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "RG";
}, {
    readonly type: "setfillColorRGB";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "rg";
}, {
    readonly type: "setColorRenderingIntent";
    readonly operands: readonly [import("./operands").NameOperand];
    readonly operator: "ri";
}, {
    readonly type: "closeAndStrokePath";
    readonly operands: readonly [];
    readonly operator: "s";
}, {
    readonly type: "strokePath";
    readonly operands: readonly [];
    readonly operator: "S";
}, {
    readonly type: "moveToStartOfNextLine";
    readonly operands: readonly [];
    readonly operator: "T*";
}, {
    readonly type: "setCharacterSpacing";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "Tc";
}, {
    readonly type: "moveTextPositionToNextLineWithOffset";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "Td";
}, {
    readonly type: "moveTextPositionToNextLineWithOffsetAndSetLeading";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "TD";
}, {
    readonly type: "setTextFontAndSize";
    readonly operands: readonly [import("./operands").NameOperand, import("./operands").RealOperand];
    readonly operator: "Tf";
}, {
    readonly type: "showText";
    readonly operands: readonly [import("./operands").StringOperand];
    readonly operator: "Tj";
}, {
    readonly type: "showTexts";
    readonly operands: readonly [ArrayOperand<string | number>];
    readonly operator: "TJ";
}, {
    readonly type: "setTextLeading";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "TL";
}, {
    readonly type: "setTextMatrixAndTextLineMatrix";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "Tm";
}, {
    readonly type: "setTextRenderingMode";
    readonly operands: readonly [import("./operands").IntegerOperand];
    readonly operator: "Tr";
}, {
    readonly type: "setTextRise";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "Ts";
}, {
    readonly type: "setWordSpacing";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "Tw";
}, {
    readonly type: "setHorizontalTextScaling";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "Tz";
}, {
    readonly type: "appendCubicBezierCurveWithReplicatedInitalPoint";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "v";
}, {
    readonly type: "setStrokeWidth";
    readonly operands: readonly [import("./operands").RealOperand];
    readonly operator: "w";
}, {
    readonly type: "setClippingPathUsingNonZeroWindingNumberRule";
    readonly operands: readonly [];
    readonly operator: "W";
}, {
    readonly type: "setClippingPathUsingEvenOddRule";
    readonly operands: readonly [];
    readonly operator: "W*";
}, {
    readonly type: "appendCubicBezierCurveWithReplicatedFinalPoint";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").RealOperand];
    readonly operator: "y";
}, {
    readonly type: "moveToNextLineAndShowText";
    readonly operands: readonly [import("./operands").StringOperand];
    readonly operator: "'";
}, {
    readonly type: "setWordAndCharacterSpacingMoveToNextLineAndShowText";
    readonly operands: readonly [import("./operands").RealOperand, import("./operands").RealOperand, import("./operands").StringOperand];
    readonly operator: "''";
}];
export type Commands = typeof COMMANDS;
export type CommandType = Commands[number]["type"];
export type CommandRecordFromCommands<Commands extends readonly Command[]> = IntersectionOfUnion<{
    [Index in keyof Commands]: {
        [Type in Commands[Index]["type"]]: Commands[Index];
    };
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
export declare function createContext(): Context;
export declare enum LineCapStyle {
    BUTT_CAP = 0,
    ROUND_CAP = 1,
    PROJECTING_SQUARE_CAP = 2
}
export declare enum LineJoinStyle {
    MITER_JOIN = 0,
    ROUND_JOIN = 1,
    BEVEL_JOIN = 2
}
export declare enum TextRenderingMode {
    FILL = 0,
    STROKE = 1,
    FILL_THEN_STROKE = 2,
    INVISIBLE = 3,
    FILL_AND_ADD_TO_CLIPPING_PATH = 4,
    STROKE_AND_ADD_TO_CLIPPING_PATH = 5,
    FILL_THEN_STROKE_AND_ADD_TO_CLIPPING_PATH = 6,
    ADD_TO_CLIPPING_PATH = 7
}
export {};
