"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextRenderingMode = exports.LineJoinStyle = exports.LineCapStyle = exports.createContext = exports.COMMANDS = void 0;
const operands_1 = require("./operands");
exports.COMMANDS = [
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
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "c"
    },
    {
        type: "concatenateMatrix",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "cm"
    },
    {
        type: "setLineDashPattern",
        operands: [operands_1.REAL_ARRAY, operands_1.REAL],
        operator: "d"
    },
    {
        type: "setGlyphWidth",
        operands: [operands_1.REAL, operands_1.REAL],
        operator: "d0"
    },
    {
        type: "setGlyphWidthAndBoundingBox",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "d1"
    },
    {
        type: "invokeNamedXObject",
        operands: [operands_1.NAME],
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
        operands: [operands_1.REAL],
        operator: "G"
    },
    {
        type: "setFillColorGrayscale",
        operands: [operands_1.REAL],
        operator: "g"
    },
    {
        type: "closeSubpath",
        operands: [],
        operator: "h"
    },
    {
        type: "setFlatnessTolerance",
        operands: [operands_1.REAL],
        operator: "i"
    },
    {
        type: "beginImageInlineData",
        operands: [],
        operator: "ID"
    },
    {
        type: "setLineJoinStyle",
        operands: [operands_1.INTEGER],
        operator: "j"
    },
    {
        type: "setLineCapStyle",
        operands: [operands_1.INTEGER],
        operator: "J"
    },
    {
        type: "setStrokeColorCMYK",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "K"
    },
    {
        type: "setFillColorCMYK",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "k"
    },
    {
        type: "appendLineSegment",
        operands: [operands_1.REAL, operands_1.REAL],
        operator: "l"
    },
    {
        type: "beginNewSubpath",
        operands: [operands_1.REAL, operands_1.REAL],
        operator: "m"
    },
    {
        type: "setMiterLimit",
        operands: [operands_1.REAL],
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
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "re"
    },
    {
        type: "setStrokeColorRGB",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "RG"
    },
    {
        type: "setfillColorRGB",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "rg"
    },
    {
        type: "setColorRenderingIntent",
        operands: [operands_1.NAME],
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
        operands: [operands_1.REAL],
        operator: "Tc"
    },
    {
        type: "moveTextPositionToNextLineWithOffset",
        operands: [operands_1.REAL, operands_1.REAL],
        operator: "Td"
    },
    {
        type: "moveTextPositionToNextLineWithOffsetAndSetLeading",
        operands: [operands_1.REAL, operands_1.REAL],
        operator: "TD"
    },
    {
        type: "setTextFontAndSize",
        operands: [operands_1.NAME, operands_1.REAL],
        operator: "Tf"
    },
    {
        type: "showText",
        operands: [operands_1.TEXT],
        operator: "Tj"
    },
    {
        type: "showTexts",
        operands: [new operands_1.ArrayOperand(new operands_1.UnionOperand(operands_1.TEXT, operands_1.REAL))],
        operator: "TJ"
    },
    {
        type: "setTextLeading",
        operands: [operands_1.REAL],
        operator: "TL"
    },
    {
        type: "setTextMatrixAndTextLineMatrix",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "Tm"
    },
    {
        type: "setTextRenderingMode",
        operands: [operands_1.INTEGER],
        operator: "Tr"
    },
    {
        type: "setTextRise",
        operands: [operands_1.REAL],
        operator: "Ts"
    },
    {
        type: "setWordSpacing",
        operands: [operands_1.REAL],
        operator: "Tw"
    },
    {
        type: "setHorizontalTextScaling",
        operands: [operands_1.REAL],
        operator: "Tz"
    },
    {
        type: "appendCubicBezierCurveWithReplicatedInitalPoint",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "v"
    },
    {
        type: "setStrokeWidth",
        operands: [operands_1.REAL],
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
        operands: [operands_1.REAL, operands_1.REAL, operands_1.REAL, operands_1.REAL],
        operator: "y"
    },
    {
        type: "moveToNextLineAndShowText",
        operands: [operands_1.TEXT],
        operator: "'"
    },
    {
        type: "setWordAndCharacterSpacingMoveToNextLineAndShowText",
        operands: [operands_1.REAL, operands_1.REAL, operands_1.TEXT],
        operator: "''"
    }
];
const CONTEXT_PROTOTYPE = (() => {
    let prototype = Object.create({});
    for (let command of exports.COMMANDS) {
        Object.defineProperty(prototype, command.type, {
            value: function (...values) {
                let tokens = values.map((value, value_index) => command.operands[value_index].getToken(value));
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
function createContext() {
    let context = Object.create(CONTEXT_PROTOTYPE);
    context.commands = [];
    return context;
}
exports.createContext = createContext;
;
var LineCapStyle;
(function (LineCapStyle) {
    LineCapStyle[LineCapStyle["BUTT_CAP"] = 0] = "BUTT_CAP";
    LineCapStyle[LineCapStyle["ROUND_CAP"] = 1] = "ROUND_CAP";
    LineCapStyle[LineCapStyle["PROJECTING_SQUARE_CAP"] = 2] = "PROJECTING_SQUARE_CAP";
})(LineCapStyle = exports.LineCapStyle || (exports.LineCapStyle = {}));
;
var LineJoinStyle;
(function (LineJoinStyle) {
    LineJoinStyle[LineJoinStyle["MITER_JOIN"] = 0] = "MITER_JOIN";
    LineJoinStyle[LineJoinStyle["ROUND_JOIN"] = 1] = "ROUND_JOIN";
    LineJoinStyle[LineJoinStyle["BEVEL_JOIN"] = 2] = "BEVEL_JOIN";
})(LineJoinStyle = exports.LineJoinStyle || (exports.LineJoinStyle = {}));
;
var TextRenderingMode;
(function (TextRenderingMode) {
    TextRenderingMode[TextRenderingMode["FILL"] = 0] = "FILL";
    TextRenderingMode[TextRenderingMode["STROKE"] = 1] = "STROKE";
    TextRenderingMode[TextRenderingMode["FILL_THEN_STROKE"] = 2] = "FILL_THEN_STROKE";
    TextRenderingMode[TextRenderingMode["INVISIBLE"] = 3] = "INVISIBLE";
    TextRenderingMode[TextRenderingMode["FILL_AND_ADD_TO_CLIPPING_PATH"] = 4] = "FILL_AND_ADD_TO_CLIPPING_PATH";
    TextRenderingMode[TextRenderingMode["STROKE_AND_ADD_TO_CLIPPING_PATH"] = 5] = "STROKE_AND_ADD_TO_CLIPPING_PATH";
    TextRenderingMode[TextRenderingMode["FILL_THEN_STROKE_AND_ADD_TO_CLIPPING_PATH"] = 6] = "FILL_THEN_STROKE_AND_ADD_TO_CLIPPING_PATH";
    TextRenderingMode[TextRenderingMode["ADD_TO_CLIPPING_PATH"] = 7] = "ADD_TO_CLIPPING_PATH";
})(TextRenderingMode = exports.TextRenderingMode || (exports.TextRenderingMode = {}));
;
