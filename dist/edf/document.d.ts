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
export declare function getLZWStream(source: Uint8Array): PDFStreamObject;
export declare function getASCII85Stream(source: Uint8Array): PDFStreamObject;
export declare const DocumentUtils: {
    convertToPDF(document: Document, options?: {
        compression: "LZW";
    }): pdf.format.PDFFile;
    embedResources(document: format.Document): format.Document;
};
