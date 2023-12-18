"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXT = exports.UnionOperand = exports.BYTESTRING = exports.BytestringOperand = exports.STRING = exports.StringOperand = exports.NAME = exports.NameOperand = exports.REAL_ARRAY = exports.ArrayOperand = exports.REAL = exports.RealOperand = exports.INTEGER = exports.IntegerOperand = exports.Operand = void 0;
const format_1 = require("../format");
class Operand {
    constructor() { }
}
exports.Operand = Operand;
;
class IntegerOperand extends Operand {
    constructor() {
        super();
    }
    getToken(value) {
        if (typeof value !== "number") {
            throw new Error();
        }
        return new format_1.PDFInteger(value).tokenize().join(" ");
    }
}
exports.IntegerOperand = IntegerOperand;
;
exports.INTEGER = new IntegerOperand();
class RealOperand extends Operand {
    constructor() {
        super();
    }
    getToken(value) {
        if (typeof value !== "number") {
            throw new Error();
        }
        return new format_1.PDFReal(Number.parseFloat(value.toFixed(3))).tokenize().join(" ");
    }
}
exports.RealOperand = RealOperand;
;
exports.REAL = new RealOperand();
class ArrayOperand extends Operand {
    operand;
    constructor(operand) {
        super();
        this.operand = operand;
    }
    getToken(value) {
        if (!Array.isArray(value)) {
            throw new Error();
        }
        return "[" + value.map((value) => this.operand.getToken(value)).join(" ") + "]";
    }
}
exports.ArrayOperand = ArrayOperand;
;
exports.REAL_ARRAY = new ArrayOperand(exports.REAL);
class NameOperand extends Operand {
    constructor() {
        super();
    }
    getToken(value) {
        if (typeof value !== "string") {
            throw new Error();
        }
        return new format_1.PDFName(value).tokenize().join(" ");
    }
}
exports.NameOperand = NameOperand;
;
exports.NAME = new NameOperand();
class StringOperand extends Operand {
    constructor() {
        super();
    }
    getToken(value) {
        if (typeof value !== "string") {
            throw new Error();
        }
        return new format_1.PDFString(value).tokenize().join(" ");
    }
}
exports.StringOperand = StringOperand;
;
exports.STRING = new StringOperand();
class BytestringOperand extends Operand {
    constructor() {
        super();
    }
    getToken(value) {
        if (!(value instanceof Uint8Array)) {
            throw new Error();
        }
        return new format_1.PDFBytestring(value).tokenize().join(" ");
    }
}
exports.BytestringOperand = BytestringOperand;
;
exports.BYTESTRING = new BytestringOperand();
class UnionOperand extends Operand {
    operands;
    constructor(...operands) {
        super();
        this.operands = operands;
    }
    getToken(value) {
        for (let operand of this.operands) {
            try {
                return operand.getToken(value);
            }
            catch (error) { }
        }
        throw new Error();
    }
}
exports.UnionOperand = UnionOperand;
;
exports.TEXT = new UnionOperand(exports.STRING, exports.BYTESTRING);
