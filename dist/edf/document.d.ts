import * as pdf from "../pdf";
import * as truetype from "../truetype";
import * as format from "./format";
import { Document } from "./format";
export declare function makeToUnicode(font: truetype.TrueTypeData): Uint8Array;
export declare function createNodeClasses(font_handler: truetype.FontHandler, node: format.Node): pdf.layout.Node;
export declare const DocumentUtils: {
    convertToPDF(document: Document): pdf.format.PDFFile;
};