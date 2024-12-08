import * as stdlib from "@joelek/stdlib";
export declare const PDFTokenizer: {
    create(): stdlib.data.tokenization.Tokenizer<{
        null: RegExp;
        true: RegExp;
        false: RegExp;
        obj: RegExp;
        endobj: RegExp;
        xref: RegExp;
        f: RegExp;
        n: RegExp;
        startxref: RegExp;
        trailer: RegExp;
        R: RegExp;
        HEADER: RegExp;
        EOF: RegExp;
        SOF: RegExp;
        "<<": RegExp;
        ">>": RegExp;
        "<": RegExp;
        ">": RegExp;
        "[": RegExp;
        "]": RegExp;
        "(": RegExp;
        ")": RegExp;
        "{": RegExp;
        "}": RegExp;
        "/": RegExp;
        "%": RegExp;
        STREAM: RegExp;
        INTEGER: RegExp;
        REAL: RegExp;
        DATE: RegExp;
        NAME: RegExp;
        EOL: RegExp;
        CRLF: RegExp;
        LF: RegExp;
        CR: RegExp;
        SPACE: RegExp;
        WS: RegExp;
        STRING: RegExp;
        BYTESTRING: RegExp;
        COMMENT: RegExp;
        XREF_OFFSET: RegExp;
        XREF_GENERATION: RegExp;
    }>;
};
export type PDFTokenizer = ReturnType<(typeof PDFTokenizer)["create"]>;
export declare const PDFParser: {
    createFromBuffer(buffer: Uint8Array): stdlib.data.tokenization.Parser<{
        null: RegExp;
        true: RegExp;
        false: RegExp;
        obj: RegExp;
        endobj: RegExp;
        xref: RegExp;
        f: RegExp;
        n: RegExp;
        startxref: RegExp;
        trailer: RegExp;
        R: RegExp;
        HEADER: RegExp;
        EOF: RegExp;
        SOF: RegExp;
        "<<": RegExp;
        ">>": RegExp;
        "<": RegExp;
        ">": RegExp;
        "[": RegExp;
        "]": RegExp;
        "(": RegExp;
        ")": RegExp;
        "{": RegExp;
        "}": RegExp;
        "/": RegExp;
        "%": RegExp;
        STREAM: RegExp;
        INTEGER: RegExp;
        REAL: RegExp;
        DATE: RegExp;
        NAME: RegExp;
        EOL: RegExp;
        CRLF: RegExp;
        LF: RegExp;
        CR: RegExp;
        SPACE: RegExp;
        WS: RegExp;
        STRING: RegExp;
        BYTESTRING: RegExp;
        COMMENT: RegExp;
        XREF_OFFSET: RegExp;
        XREF_GENERATION: RegExp;
    }>;
    createFromString(string: string): stdlib.data.tokenization.Parser<{
        null: RegExp;
        true: RegExp;
        false: RegExp;
        obj: RegExp;
        endobj: RegExp;
        xref: RegExp;
        f: RegExp;
        n: RegExp;
        startxref: RegExp;
        trailer: RegExp;
        R: RegExp;
        HEADER: RegExp;
        EOF: RegExp;
        SOF: RegExp;
        "<<": RegExp;
        ">>": RegExp;
        "<": RegExp;
        ">": RegExp;
        "[": RegExp;
        "]": RegExp;
        "(": RegExp;
        ")": RegExp;
        "{": RegExp;
        "}": RegExp;
        "/": RegExp;
        "%": RegExp;
        STREAM: RegExp;
        INTEGER: RegExp;
        REAL: RegExp;
        DATE: RegExp;
        NAME: RegExp;
        EOL: RegExp;
        CRLF: RegExp;
        LF: RegExp;
        CR: RegExp;
        SPACE: RegExp;
        WS: RegExp;
        STRING: RegExp;
        BYTESTRING: RegExp;
        COMMENT: RegExp;
        XREF_OFFSET: RegExp;
        XREF_GENERATION: RegExp;
    }>;
};
export type PDFParser = ReturnType<(typeof PDFParser)["createFromBuffer"]>;
export declare abstract class PDFEntity {
    constructor();
    abstract tokenize(): Array<string>;
}
export declare abstract class PDFType extends PDFEntity {
    constructor();
    static parseFrom(parser: PDFParser): PDFType;
}
export declare class PDFBytestring extends PDFType {
    readonly value: Uint8Array;
    constructor(value: Uint8Array);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFBytestring;
}
export declare class PDFString extends PDFType {
    readonly value: string;
    constructor(value: string);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFString;
}
export declare class PDFDate extends PDFType {
    readonly value: Date;
    constructor(value: Date);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFDate;
}
export declare class PDFName extends PDFType {
    readonly value: string;
    constructor(name: string);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFName;
}
export declare class PDFRecordMember {
    readonly key: PDFName;
    readonly value: PDFType;
    constructor(key: PDFName, value: PDFType);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFRecordMember;
}
export declare class PDFRecord extends PDFType {
    readonly members: Array<PDFRecordMember>;
    constructor(members: Array<PDFRecordMember>);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFRecord;
}
export declare class PDFReference extends PDFType {
    readonly id: PDFInteger;
    readonly generation: PDFInteger;
    constructor(id: PDFInteger, generation: PDFInteger);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFReference;
}
export declare class PDFNull extends PDFType {
    constructor();
    tokenize(): Array<string>;
    protected static readonly INSTANCE: PDFNull;
    static parseFrom(parser: PDFParser): PDFNull;
}
export declare class PDFVersion extends PDFEntity {
    readonly major: number;
    readonly minor: number;
    constructor(major: number, minor: number);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFVersion;
}
export declare class PDFFalse extends PDFType {
    constructor();
    tokenize(): Array<string>;
    protected static readonly INSTANCE: PDFFalse;
    static parseFrom(parser: PDFParser): PDFFalse;
}
export declare class PDFTrue extends PDFType {
    constructor();
    tokenize(): Array<string>;
    static readonly INSTANCE: PDFTrue;
    static parseFrom(parser: PDFParser): PDFTrue;
}
export declare class PDFInteger extends PDFType {
    readonly value: number;
    constructor(value: number);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFInteger;
}
export declare class PDFReal extends PDFType {
    readonly value: number;
    constructor(value: number);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFReal;
}
export declare class PDFArray extends PDFType {
    readonly elements: Array<PDFType>;
    constructor(elements: Array<PDFType>);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFArray;
}
export declare class PDFObject extends PDFEntity {
    readonly id: PDFInteger;
    readonly generation: PDFInteger;
    readonly value: PDFType;
    constructor(id: PDFInteger, generation: PDFInteger, value: PDFType);
    getReference(): PDFReference;
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFObject;
}
export declare class PDFStream extends PDFEntity {
    readonly value: Uint8Array;
    constructor(value: Uint8Array);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFStream;
}
export declare class PDFStreamObject extends PDFEntity {
    readonly id: PDFInteger;
    readonly generation: PDFInteger;
    readonly properties: PDFRecord;
    readonly stream: PDFStream;
    constructor(id: PDFInteger, generation: PDFInteger, properties: PDFRecord, stream: PDFStream);
    getReference(): PDFReference;
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFStreamObject;
}
export declare class PDFFile extends PDFEntity {
    readonly version: PDFVersion;
    readonly objects: Array<PDFObject | PDFStreamObject>;
    readonly trailer: PDFRecord;
    readonly increments: Array<{
        objects: Array<PDFObject | PDFStreamObject>;
        trailer: PDFRecord;
    }>;
    constructor(version: PDFVersion, objects: Array<PDFObject | PDFStreamObject>, trailer: PDFRecord, increments: Array<{
        objects: Array<PDFObject | PDFStreamObject>;
        trailer: PDFRecord;
    }>);
    tokenize(): Array<string>;
    static parseFrom(parser: PDFParser): PDFFile;
}
