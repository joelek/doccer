"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFFile = exports.PDFStreamObject = exports.PDFStream = exports.PDFObject = exports.PDFArray = exports.PDFReal = exports.PDFInteger = exports.PDFTrue = exports.PDFFalse = exports.PDFVersion = exports.PDFNull = exports.PDFReference = exports.PDFRecord = exports.PDFRecordMember = exports.PDFName = exports.PDFDate = exports.PDFString = exports.PDFBytestring = exports.PDFType = exports.PDFEntity = exports.PDFParser = exports.PDFTokenizer = exports.tokenization = void 0;
const tokenization_1 = require("./tokenization");
const utils_1 = require("./utils");
const codepages = require("../codepages");
exports.tokenization = require("./tokenization");
exports.PDFTokenizer = {
    create() {
        return new tokenization_1.Tokenizer({
            "null": /null/i,
            "true": /true/i,
            "false": /false/i,
            "obj": /obj/i,
            "endobj": /endobj/i,
            "xref": /xref/i,
            "f": /f/i,
            "n": /n/i,
            "startxref": /startxref/i,
            "trailer": /trailer/i,
            "R": /R/i,
            "HEADER": /[%]PDF-[0-9][.][0-9]/,
            "EOF": /[%][%]EOF/,
            "SOF": /[%][\x00-\xFF]{4}/,
            "<<": /[<][<]/,
            ">>": /[>][>]/,
            "<": /[<]/,
            ">": /[>]/,
            "[": /[\[]/,
            "]": /[\]]/,
            "(": /[(]/,
            ")": /[)]/,
            "{": /[{]/,
            "}": /[}]/,
            "/": /[/]/,
            "%": /[%]/,
            "STREAM": /stream(?:\r\n|\r|\n)(?:[\x00-\xFF](?!(?:\r\n|\r|\n)endstream))*(?:[\x00-\xFF]?(?:\r\n|\r|\n)endstream)/,
            "INTEGER": /[+-]?[0-9]+/,
            "REAL": /[+-]?(?:[0-9]+[.][0-9]+|[.][0-9]+|[0-9]+[.])/,
            "DATE": /D[:][0-9]{4}([0-9]{2}([0-9]{2}([0-9]{2}([0-9]{2}([0-9]{2}(Z|([+-][0-9]{2}(['][0-9]{2}[']?)?))?)?)?)?)?)?/,
            "NAME": /[/](?:[\x21-\x24\x26-\x27\x2A-\x2E\x30-\x3B\x3D\x3F-\x5A\x5C\x5E-\x7A\x7C\x7E]|[#][0-9A-Fa-f]{2})+/,
            "EOL": /\r\n|\r|\n/,
            "CRLF": /\r\n/,
            "LF": /\n/,
            "CR": /\r/,
            "SPACE": /[ ]/,
            "WS": /[\x00\x09\x0A\x0C\x0D\x20]+/,
            "STRING": /[\(](?:[\\][\\]|[\\][\)]|[^\)])*[\)]/,
            "BYTESTRING": /[<][0-9A-Fa-f]*[>]/,
            "COMMENT": /[%](?:[\x00-\xFF](?!\r\n|\r|\n))*[\x00-\xFF]?(?=\r\n|\r|\n)/,
            "XREF_OFFSET": /[0-9]{10}/,
            "XREF_GENERATION": /[0-9]{5}/
        });
    }
};
exports.PDFParser = {
    createFromBuffer(buffer) {
        let string = utils_1.Codec.decodeAsciiBuffer(buffer);
        let tokenizer = exports.PDFTokenizer.create();
        return tokenizer.tokenize(string);
    },
    createFromString(string) {
        let tokenizer = exports.PDFTokenizer.create();
        return tokenizer.tokenize(string);
    }
};
class PDFEntity {
    constructor() { }
}
exports.PDFEntity = PDFEntity;
;
class PDFType extends PDFEntity {
    constructor() {
        super();
    }
    static parseFrom(parser) {
        return parser.parseFirst(PDFReference.parseFrom, PDFNull.parseFrom, PDFFalse.parseFrom, PDFTrue.parseFrom, PDFInteger.parseFrom, PDFReal.parseFrom, PDFName.parseFrom, PDFDate.parseFrom, PDFString.parseFrom, PDFBytestring.parseFrom, PDFRecord.parseFrom, PDFArray.parseFrom);
    }
}
exports.PDFType = PDFType;
;
class PDFBytestring extends PDFType {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    tokenize() {
        let lines = [];
        let hex = "";
        for (let byte of this.value) {
            hex = hex + byte.toString(16).padStart(2, "0").toUpperCase();
        }
        lines.push(`<${hex}>`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("BYTESTRING").value.slice(1, -1);
            string = string.replaceAll(/([0-9A-Fa-f]{1,2})/g, (_, match) => {
                return String.fromCharCode(Number.parseInt(match.padEnd(2, "0"), 16));
            });
            let value = utils_1.Codec.encodeAsciiBuffer(string);
            return new PDFBytestring(value);
        });
    }
}
exports.PDFBytestring = PDFBytestring;
;
class PDFString extends PDFType {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    tokenize() {
        let lines = [];
        try {
            let buffer = codepages.CP_PDFDOC.encode(this.value);
            let string = utils_1.Codec.decodeAsciiBuffer(buffer);
            string = string.replaceAll("\\", "\\\\");
            string = string.replaceAll(")", "\\)");
            string = string.replaceAll(/([^\x20-\x7E])/g, (_, match) => {
                return `\\${match.charCodeAt(0).toString(8)}`;
            });
            lines.push(`(${string})`);
        }
        catch (error) {
            let string = "";
            // Process value as a sequence of UTF-16 code units in order to correctly handle surrogate pairs.
            for (let i = 0; i < this.value.length; i++) {
                let code_unit = this.value.charCodeAt(i);
                let hi = (code_unit >> 8) & 0xFF;
                let lo = (code_unit >> 0) & 0xFF;
                string += String.fromCharCode(hi, lo);
            }
            string = "\xFE\xFF" + string;
            string = string.replaceAll("\\", "\\\\");
            string = string.replaceAll(")", "\\)");
            string = string.replaceAll(/([^\x20-\x7E])/g, (_, match) => {
                return `\\${match.charCodeAt(0).toString(8)}`;
            });
            lines.push(`(${string})`);
        }
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("STRING").value.slice(1, -1);
            string = string.replaceAll("\\\r\n", "");
            string = string.replaceAll("\\\r", "");
            string = string.replaceAll("\\\n", "");
            string = string.replaceAll("\r\n", "\n");
            string = string.replaceAll("\r", "\n");
            string = string.replaceAll("\n", "\n");
            string = string.replaceAll(/[\\]([\\()nrtbf])/g, (_, match) => {
                let keys = "\\()nrtbf";
                let replacements = "\\()\n\r\t\b\f";
                return replacements[keys.indexOf(match)];
            });
            string = string.replaceAll(/[\\]([0-9]{1,3})/g, (_, match) => {
                return String.fromCharCode(Number.parseInt(match, 8));
            });
            if (string.startsWith("\xFE\xFF")) {
                string = utils_1.Codec.utf16FromAscii(string.slice(2));
            }
            return new PDFString(string);
        });
    }
}
exports.PDFString = PDFString;
;
class PDFDate extends PDFType {
    value;
    constructor(value) {
        if (Number.isNaN(value.getTime())) {
            throw new Error(`Expected date to be a valid calendar date!`);
        }
        super();
        this.value = value;
    }
    tokenize() {
        let lines = [];
        let year = this.value.getUTCFullYear();
        let month = this.value.getUTCMonth() + 1;
        let day = this.value.getUTCDate();
        let hour = this.value.getUTCHours();
        let minute = this.value.getUTCMinutes();
        let second = this.value.getUTCSeconds();
        let date = [
            year.toString().padStart(4, "0"),
            month.toString().padStart(2, "0"),
            day.toString().padStart(2, "0"),
            hour.toString().padStart(2, "0"),
            minute.toString().padStart(2, "0"),
            second.toString().padStart(2, "0"),
        ].join("");
        lines.push(`D:${date}Z`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("DATE").value;
            string = string.slice(2);
            let year = string.slice(0, 4);
            let month = string.slice(4, 6) || "01";
            let day = string.slice(6, 8) || "01";
            let hour = string.slice(8, 10) || "00";
            let minute = string.slice(10, 12) || "00";
            let second = string.slice(12, 14) || "00";
            let tz = string.slice(14, 15) || "Z";
            let tz_hours = string.slice(15, 17) || "00";
            let tz_minutes = string.slice(18, 20) || "00";
            if (tz === "Z") {
                tz = "+";
            }
            let value = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}${tz}${tz_hours}:${tz_minutes}`);
            return new PDFDate(value);
        });
    }
}
exports.PDFDate = PDFDate;
;
class PDFName extends PDFType {
    value;
    constructor(name) {
        if (name.includes("\0")) {
            throw new Error(`Expected name to not include null character!`);
        }
        super();
        this.value = name;
    }
    tokenize() {
        let lines = [];
        let ascii = utils_1.Codec.asciiFromUnicode(this.value);
        let escaped = ascii.replaceAll(/([^\x21-\x24\x26-\x27\x2A-\x2E\x30-\x3B\x3D\x3F-\x5A\x5C\x5E-\x7A\x7C\x7E])/g, (_, match) => {
            return `#${match.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase()}`;
        });
        lines.push(`/${escaped}`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("NAME").value;
            string = string.slice(1);
            string = string.replaceAll(/[#]([0-9A-Fa-f]{2})/g, (_, match) => {
                return String.fromCharCode(Number.parseInt(match, 16));
            });
            string = utils_1.Codec.unicodeFromAscii(string);
            return new PDFName(string);
        });
    }
}
exports.PDFName = PDFName;
;
class PDFRecordMember {
    key;
    value;
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.key.tokenize().join(" ")} ${this.value.tokenize().join(" ")}`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let name = PDFName.parseFrom(parser);
            let value = PDFType.parseFrom(parser);
            return new PDFRecordMember(name, value);
        });
    }
}
exports.PDFRecordMember = PDFRecordMember;
;
class PDFRecord extends PDFType {
    members;
    constructor(members) {
        super();
        this.members = members;
    }
    tokenize() {
        let lines = [];
        lines.push("<<");
        for (let member of this.members) {
            lines.push(`${member.tokenize().join(" ")}`);
        }
        lines.push(">>");
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            read("<<");
            let members = [];
            while (peek(">>") == null) {
                let member = PDFRecordMember.parseFrom(parser);
                members.push(member);
            }
            read(">>");
            return new PDFRecord(members);
        });
    }
}
exports.PDFRecord = PDFRecord;
;
class PDFReference extends PDFType {
    id;
    generation;
    constructor(id, generation) {
        if (id.value < 1) {
            throw new Error(`Expected id to be at least 1!`);
        }
        if (generation.value < 0) {
            throw new Error(`Expected generation to be at least 0!`);
        }
        super();
        this.id = id;
        this.generation = generation;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.id.tokenize().join(" ")} ${this.generation.tokenize().join(" ")} R`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let id = PDFInteger.parseFrom(parser);
            let generation = PDFInteger.parseFrom(parser);
            read("R");
            return new PDFReference(id, generation);
        });
    }
}
exports.PDFReference = PDFReference;
;
class PDFNull extends PDFType {
    constructor() {
        super();
    }
    tokenize() {
        let lines = [];
        lines.push(`null`);
        return lines;
    }
    static INSTANCE = new PDFNull();
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            read("null");
            return PDFNull.INSTANCE;
        });
    }
}
exports.PDFNull = PDFNull;
;
class PDFVersion extends PDFEntity {
    major;
    minor;
    constructor(major, minor) {
        if (major < 0) {
            throw new Error(`Expected major version to be at least 0!`);
        }
        if (major > 9) {
            throw new Error(`Expected major version to be at most 9!`);
        }
        if (minor < 0) {
            throw new Error(`Expected minor version to be at least 0!`);
        }
        if (minor > 9) {
            throw new Error(`Expected minor version to be at most 9!`);
        }
        super();
        this.major = major;
        this.minor = minor;
    }
    tokenize() {
        let lines = [];
        lines.push(`%PDF-${this.major}.${this.minor}`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("HEADER").value;
            let major = Number.parseInt(string.slice(5, 6));
            let minor = Number.parseInt(string.slice(7, 8));
            return new PDFVersion(major, minor);
        });
    }
}
exports.PDFVersion = PDFVersion;
;
class PDFFalse extends PDFType {
    constructor() {
        super();
    }
    tokenize() {
        let lines = [];
        lines.push(`false`);
        return lines;
    }
    static INSTANCE = new PDFFalse();
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            read("false");
            return PDFFalse.INSTANCE;
        });
    }
}
exports.PDFFalse = PDFFalse;
;
class PDFTrue extends PDFType {
    constructor() {
        super();
    }
    tokenize() {
        let lines = [];
        lines.push(`true`);
        return lines;
    }
    static INSTANCE = new PDFTrue();
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            read("true");
            return PDFTrue.INSTANCE;
        });
    }
}
exports.PDFTrue = PDFTrue;
;
class PDFInteger extends PDFType {
    value;
    constructor(value) {
        if (!Number.isSafeInteger(value)) {
            throw new Error(`Expected number to be a safe integer!`);
        }
        super();
        this.value = value;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.value}`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("INTEGER").value;
            let value = Number.parseInt(string, 10);
            return new PDFInteger(value);
        });
    }
}
exports.PDFInteger = PDFInteger;
;
class PDFReal extends PDFType {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.value.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 })}`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("REAL").value;
            let value = Number.parseFloat(string);
            return new PDFReal(value);
        });
    }
}
exports.PDFReal = PDFReal;
;
class PDFArray extends PDFType {
    elements;
    constructor(elements) {
        super();
        this.elements = elements;
    }
    tokenize() {
        let lines = [];
        lines.push("[");
        for (let element of this.elements) {
            lines.push(`${element.tokenize().join(" ")}`);
        }
        lines.push("]");
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            read("[");
            let elements = [];
            while (peek("]") == null) {
                let element = PDFType.parseFrom(parser);
                elements.push(element);
            }
            read("]");
            return new PDFArray(elements);
        });
    }
}
exports.PDFArray = PDFArray;
;
class PDFObject extends PDFEntity {
    id;
    generation;
    value;
    constructor(id, generation, value) {
        if (id.value < 1) {
            throw new Error(`Expected id to be at least 1!`);
        }
        if (generation.value < 0) {
            throw new Error(`Expected generation to be at least 0!`);
        }
        super();
        this.id = id;
        this.generation = generation;
        this.value = value;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.id.tokenize().join(" ")} ${this.generation.tokenize().join(" ")} obj`);
        lines.push(`${this.value.tokenize().join(" ")}`);
        lines.push("endobj");
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let id = PDFInteger.parseFrom(parser);
            let generation = PDFInteger.parseFrom(parser);
            read("obj");
            let value = PDFType.parseFrom(parser);
            read("endobj");
            return new PDFObject(id, generation, value);
        });
    }
}
exports.PDFObject = PDFObject;
;
class PDFStream extends PDFEntity {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    tokenize() {
        let lines = [];
        lines.push(`stream\n${utils_1.Codec.decodeAsciiBuffer(this.value)}\nendstream`);
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let string = read("STREAM").value;
            string = string.slice(string.startsWith("stream\r\n") ? 8 : 7, string.endsWith("\r\nendstream") ? -11 : -10);
            let value = utils_1.Codec.encodeAsciiBuffer(string);
            return new PDFStream(value);
        });
    }
}
exports.PDFStream = PDFStream;
;
class PDFStreamObject extends PDFEntity {
    id;
    generation;
    properties;
    stream;
    constructor(id, generation, properties, stream) {
        if (id.value < 1) {
            throw new Error(`Expected id to be at least 1!`);
        }
        if (generation.value < 0) {
            throw new Error(`Expected generation to be at least 0!`);
        }
        super();
        this.id = id;
        this.generation = generation;
        this.properties = properties;
        this.stream = stream;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.id.tokenize().join(" ")} ${this.generation.tokenize().join(" ")} obj`);
        lines.push(`${this.properties.tokenize().join(" ")}`);
        lines.push(`${this.stream.tokenize().join(" ")}`);
        lines.push("endobj");
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let id = PDFInteger.parseFrom(parser);
            let generation = PDFInteger.parseFrom(parser);
            read("obj");
            let properties = PDFRecord.parseFrom(parser);
            let stream = PDFStream.parseFrom(parser);
            read("endobj");
            return new PDFStreamObject(id, generation, properties, stream);
        });
    }
}
exports.PDFStreamObject = PDFStreamObject;
;
class PDFFile extends PDFEntity {
    version;
    objects;
    trailer;
    increments;
    constructor(version, objects, trailer, increments) {
        super();
        this.version = version;
        this.objects = objects;
        this.trailer = trailer;
        this.increments = increments;
    }
    tokenize() {
        let lines = [];
        lines.push(`${this.version.tokenize().join(" ")}`);
        lines.push(`%%EOF`);
        let offsets = [];
        for (let object of this.objects) {
            offsets.push(lines.join(" ").length);
            lines.push(`${object.tokenize().join(" ")}`);
        }
        let xref_offset = lines.join(" ").length;
        lines.push(`xref`);
        lines.push(`0 ${this.objects.length + 1}`);
        lines.push(`0000000000 65535 f `);
        for (let i = 0; i < this.objects.length; i++) {
            let object = this.objects[i];
            lines.push(`${offsets[i].toString().padStart(10, "0")} ${object.generation.value.toString().padStart(5, "0")} n `);
        }
        lines.push(`trailer`);
        lines.push(this.trailer.tokenize().join(" "));
        lines.push(`startxref`);
        lines.push(`${xref_offset}`);
        lines.push(`%%EOF`);
        // TODO: Serialize increments.
        return lines;
    }
    static parseFrom(parser) {
        return parser.parse(["WS", "COMMENT"], (read, peek, skip) => {
            let version = PDFVersion.parseFrom(parser);
            read("SOF");
            let objects = [];
            while (peek().type !== "xref") {
                let object = parser.parseFirst(PDFObject.parseFrom, PDFStreamObject.parseFrom);
                objects.push(object);
            }
            parser.parse([], (read, peek, skip) => {
                read("xref");
                read("EOL");
                let first_id = PDFInteger.parseFrom(parser);
                if (first_id.value < 0) {
                    throw new Error(`Expected first id to be at least 0!`);
                }
                read("SPACE");
                let object_count = PDFInteger.parseFrom(parser);
                if (object_count.value < 0) {
                    throw new Error(`Expected object count to be at least 0!`);
                }
                read("EOL");
                for (let i = 0; i < object_count.value; i++) {
                    let offset = Number.parseInt(read("XREF_OFFSET").value, 10);
                    read("SPACE");
                    let generation = Number.parseInt(read("XREF_GENERATION").value, 10);
                    read("SPACE");
                    let free = read("f", "n").value === "f";
                    if (read("WS").value.length !== 2) {
                        throw new Error(`Expected a fixed-width xref entry!`);
                    }
                }
            });
            read("trailer");
            let trailer = PDFRecord.parseFrom(parser);
            read("startxref");
            let offset = PDFInteger.parseFrom(parser);
            if (offset.value < 0) {
                throw new Error(`Expected offset to be at least 0!`);
            }
            read("EOF");
            let increments = [];
            // TODO: Parse increments.
            return new PDFFile(version, objects, trailer, increments);
        });
    }
}
exports.PDFFile = PDFFile;
;
