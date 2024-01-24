import * as pdf from "../pdf";
import * as truetype from "../truetype";
import { FontHandler } from "./fonts";
import * as format from "./format";
import { Document } from "./format";
import * as layout from "./layout";
import { StyleHandler } from "./styles";
import { PDFStreamObject } from "../pdf/format";
export declare function makeToUnicode(font: truetype.TrueTypeData): Uint8Array;
export declare function createNodeClasses(font_handler: FontHandler, style_handler: StyleHandler, node: format.Node): layout.Node;
export declare function createLZWStream(source: Uint8Array): PDFStreamObject;
export declare function createRLEStream(source: Uint8Array): PDFStreamObject;
export declare function createASCII85Stream(source: Uint8Array): PDFStreamObject;
export declare function createASCIIHexStream(source: Uint8Array): PDFStreamObject;
export declare function createUncompressedStream(source: Uint8Array): PDFStreamObject;
export declare function createStream(source: Uint8Array, compression: "LZW" | "RLE" | "ASCII85" | "ASCIIHEX" | undefined): PDFStreamObject;
export declare const DocumentUtils: {
    convertToPDF(document: Document, options?: {
        compression: "LZW" | "RLE" | "ASCII85" | "ASCIIHEX";
    }): pdf.format.PDFFile;
    embedResources(document: format.Document): format.Document;
};
