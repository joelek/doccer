import * as pdf from "../pdf";
import * as truetype from "../truetype";
import * as format from "./format";
import { Document } from "./format";
import * as layout from "./layout";
import { FontHandler } from "./fonts";
import { StyleHandler } from "./styles";
export declare function makeToUnicode(font: truetype.TrueTypeData): Uint8Array;
export declare function createNodeClasses(font_handler: FontHandler, style_handler: StyleHandler, node: format.Node): layout.Node;
export declare const DocumentUtils: {
    convertToPDF(document: Document): pdf.format.PDFFile;
    embedResources(document: format.Document): format.Document;
};
