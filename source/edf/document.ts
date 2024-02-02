import * as stdlib from "@joelek/ts-stdlib";
import * as app from "../app.json";
import * as pdf from "../pdf";
import * as truetype from "../truetype";
import { FontHandler, Typesetter } from "./fonts";
import * as format from "./format";
import { BoxNode, Document, TextNode, UnrecognizedNode } from "./format";
import * as layout from "./layout";
import { StyleHandler } from "./styles";
import { PDFArray, PDFName, PDFRecordMember, PDFStreamObject } from "../pdf/format";
import { ImageHandler } from "./images";
import * as jpg from "../jpg";
import * as png from "../png";

export function createGrayscalePNGXObjects(data: png.PNGData): Array<PDFStreamObject> {
	let idats = data.chunks.filter((chunk) => chunk.type === "IDAT");
	if (idats.length !== 1) {
		throw new Error(`Expected exactly one IDAT chunk!`);
	}
	if (data.ihdr.interlace_method !== "NONE") {
		throw new Error(`Expected a non-interlaced PNG file!`);
	}
	let image_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceGray")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(idats[0].data.byteLength)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(1))
			]))
		]),
		new pdf.format.PDFStream(new Uint8Array(idats[0].data))
	);
	return [image_xobject];
};

export function createGrayscaleAndAlphaPNGXObjects(data: png.PNGData): Array<PDFStreamObject> {
	let { color, alpha } = png.splitImageData(data);
	if (alpha == null) {
		throw new Error(`Expected an alpha channel!`);
	}
	let mask_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceGray")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")), */
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(alpha.byteLength)),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(1))
			])) */
		]),
		new pdf.format.PDFStream(alpha)
	);
	let image_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceGray")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("SMask"), mask_xobject.getReference()),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")), */
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(color.byteLength)),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(1))
			])) */
		]),
		new pdf.format.PDFStream(color)
	);
	return [image_xobject, mask_xobject];
};

export function createTruecolorPNGXObjects(data: png.PNGData): Array<PDFStreamObject> {
	let idats = data.chunks.filter((chunk) => chunk.type === "IDAT");
	if (idats.length !== 1) {
		throw new Error(`Expected exactly one IDAT chunk!`);
	}
	if (data.ihdr.interlace_method !== "NONE") {
		throw new Error(`Expected a non-interlaced PNG file!`);
	}
	let image_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceRGB")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(idats[0].data.byteLength)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(3))
			]))
		]),
		new pdf.format.PDFStream(new Uint8Array(idats[0].data))
	);
	return [image_xobject];
};

export function createTruecolorAndAlphaPNGXObjects(data: png.PNGData): Array<PDFStreamObject> {
	let { color, alpha } = png.splitImageData(data);
	if (alpha == null) {
		throw new Error(`Expected an alpha channel!`);
	}
	let mask_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceGray")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")), */
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(alpha.byteLength)),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(1))
			])) */
		]),
		new pdf.format.PDFStream(alpha)
	);
	let image_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceRGB")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("SMask"), mask_xobject.getReference()),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")), */
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(color.byteLength)),
/* 			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(3))
			])) */
		]),
		new pdf.format.PDFStream(color)
	);
	return [image_xobject, mask_xobject];
};

export function createIndexedPNGXObjects(data: png.PNGData): Array<PDFStreamObject> {
	let idats = data.chunks.filter((chunk) => chunk.type === "IDAT");
	if (idats.length !== 1) {
		throw new Error(`Expected exactly one IDAT chunk!`);
	}
	if (data.ihdr.interlace_method !== "NONE") {
		throw new Error(`Expected a non-interlaced PNG file!`);
	}
	let pltes = data.chunks.filter((chunk) => chunk.type === "PLTE");
	if (pltes.length !== 1) {
		throw new Error(`Expected exactly one PLTE chunk!`);
	}
	let image_xobject = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.ihdr.width)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.ihdr.height)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFArray([
				new pdf.format.PDFName("Indexed"),
				new pdf.format.PDFName("DeviceRGB"),
				new pdf.format.PDFInteger((1 << data.ihdr.bit_depth) - 1),
				new pdf.format.PDFBytestring(new Uint8Array(pltes[0].data))
			])),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("FlateDecode")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(idats[0].data.byteLength)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([
				new PDFRecordMember(new PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.ihdr.bit_depth)),
				new PDFRecordMember(new PDFName("Predictor"), new pdf.format.PDFInteger(15)),
				new PDFRecordMember(new PDFName("Columns"), new pdf.format.PDFInteger(data.ihdr.width)),
				new PDFRecordMember(new PDFName("Colors"), new pdf.format.PDFInteger(1))
			]))
		]),
		new pdf.format.PDFStream(new Uint8Array(idats[0].data))
	);
	return [image_xobject];
};

export function createPNGXObjects(data: png.PNGData): Array<PDFStreamObject> {
	if (data.ihdr.color_type === "GRAYSCALE") {
		return createGrayscalePNGXObjects(data);
	}
	if (data.ihdr.color_type === "GRAYSCALE_AND_ALPHA") {
		return createGrayscaleAndAlphaPNGXObjects(data);
	}
	if (data.ihdr.color_type === "TRUECOLOR") {
		return createTruecolorPNGXObjects(data);
	}
	if (data.ihdr.color_type === "TRUECOLOR_AND_ALPHA") {
		return createTruecolorAndAlphaPNGXObjects(data);
	}
	if (data.ihdr.color_type === "INDEXED") {
		return createIndexedPNGXObjects(data);
	}
	throw new Error(`Expected a supported PNG color mode!`);
};

export function makeToUnicode(font: truetype.TrueTypeData): Uint8Array {
	let lines = [] as Array<string>;
	lines.push(`/CIDInit /ProcSet findresource begin`);
	lines.push(`12 dict begin`);
	lines.push(`begincmap`);
	lines.push(`/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def`);
	lines.push(`/CMapName /Adobe-Identity-UCS def`);
	lines.push(`/CMapType 2 def`);
	lines.push(`1 begincodespacerange`);
	lines.push(`<${Number(0).toString(16).toUpperCase().padStart(4, "0")}> <${Number(65535).toString(16).toUpperCase().padStart(4, "0")}>`);
	lines.push(`endcodespacerange`);
	lines.push(`${font.cmap.mappings.length} beginbfchar`);
	for (let mapping of font.cmap.mappings.slice().sort((one, two) => one.index - two.index)) {
		lines.push(`<${mapping.index.toString(16).toUpperCase().padStart(4, "0")}> <${mapping.code_point.toString(16).toUpperCase().padStart(4, "0")}>`);
	}
	lines.push(`endbfchar`);
	lines.push(`endcmap`);
	lines.push(`CMapName currentdict /CMap defineresource pop`);
	lines.push(`end`);
	lines.push(`end`);
	let buffer = stdlib.data.chunk.Chunk.fromString(lines.join("\n"), "binary");
	return buffer;
};

export function createNodeClasses(image_handler: ImageHandler, font_handler: FontHandler, style_handler: StyleHandler, node: format.Node): layout.Node {
	if (format.ImageNode.is(node)) {
		return new layout.ImageNode(image_handler, style_handler.getImageStyle(node.style));
	}
	if (TextNode.is(node)) {
		let style = style_handler.getTextStyle(node.style);
		let font = style?.font ?? font_handler.getDefaultFont();
		if (font == null) {
			throw new Error();
		}
		return new layout.TextNode(node.content, font_handler.getTypesetter(font), font_handler.getTypeId(font), style);
	}
	if (BoxNode.is(node)) {
		let children = (node?.children ?? []).map((child) => createNodeClasses(image_handler, font_handler, style_handler, child));
		return new layout.BoxNode(style_handler.getBoxStyle(node.style), ...children);
	}
	if (UnrecognizedNode.is(node)) {
		return new layout.UnrecognizedNode(style_handler.getUnrecognizedStyle(node.style, node.type));
	}
	throw new Error();
};

export function createLZWStream(source: Uint8Array): PDFStreamObject {
	let buffer = pdf.filters.LZW.encode(source);
	let pdf_stream = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new PDFArray([
				new pdf.format.PDFName("LZWDecode")
			])),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new PDFArray([
				new pdf.format.PDFRecord([
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("EarlyChange"), new pdf.format.PDFInteger(1))
				])
			]))
		]),
		new pdf.format.PDFStream(buffer)
	);
	return pdf_stream;
};

export function createRLEStream(source: Uint8Array): PDFStreamObject {
	let buffer = pdf.filters.RLE.encode(source);
	let pdf_stream = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new PDFArray([
				new pdf.format.PDFName("RunLengthDecode")
			])),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new PDFArray([
				new pdf.format.PDFNull()
			]))
		]),
		new pdf.format.PDFStream(buffer)
	);
	return pdf_stream;
};

export function createASCII85Stream(source: Uint8Array): PDFStreamObject {
	let buffer = stdlib.data.chunk.Chunk.fromString(pdf.filters.Ascii85.encode(source), "binary");
	let pdf_stream = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("ASCII85Decode")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength))
		]),
		new pdf.format.PDFStream(buffer)
	);
	return pdf_stream;
};

export function createASCIIHexStream(source: Uint8Array): PDFStreamObject {
	let buffer = pdf.filters.AsciiHex.encode(source);
	let pdf_stream = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("ASCIIHexDecode")),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength))
		]),
		new pdf.format.PDFStream(buffer)
	);
	return pdf_stream;
};

export function createDeflateStream(source: Uint8Array): PDFStreamObject {
	let buffer = pdf.filters.Deflate.encode(source);
	let pdf_stream = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new PDFArray([
				new pdf.format.PDFName("FlateDecode")
			])),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new PDFArray([
				new pdf.format.PDFNull()
			]))
		]),
		new pdf.format.PDFStream(buffer)
	);
	return pdf_stream;
};

export function createUncompressedStream(source: Uint8Array): PDFStreamObject {
	let buffer = source;
	let pdf_stream = new pdf.format.PDFStreamObject(
		new pdf.format.PDFInteger(1),
		new pdf.format.PDFInteger(0),
		new pdf.format.PDFRecord([
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength))
		]),
		new pdf.format.PDFStream(buffer)
	);
	return pdf_stream;
};

export function createStream(source: Uint8Array, filter: Partial<ConvertToPDFOptions>["filter"]): PDFStreamObject {
	if (filter === "LZW") {
		return createLZWStream(source);
	}
	if (filter === "RLE") {
		return createRLEStream(source);
	}
	if (filter === "ASCII85") {
		return createASCII85Stream(source);
	}
	if (filter === "ASCIIHEX") {
		return createASCIIHexStream(source);
	}
	if (filter === "DEFLATE") {
		return createDeflateStream(source);
	}
	return createUncompressedStream(source);
};

export type ConvertToPDFOptions = {
	filter: "LZW" | "RLE" | "ASCII85" | "ASCIIHEX" | "DEFLATE";
};

export const DocumentUtils = {
	convertToPDF(document: Document, options?: Partial<ConvertToPDFOptions>): pdf.format.PDFFile {
		let filter = options?.filter;
		let pdf_file = new pdf.format.PDFFile(
			new pdf.format.PDFVersion(1, 6),
			[],
			new pdf.format.PDFRecord([]),
			[]
		);
		let information_record = new pdf.format.PDFRecord([]);
		if (document.metadata?.title != null) {
			information_record.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("Title"), new pdf.format.PDFString(document.metadata?.title)));
		}
		if (document.metadata?.author != null) {
			information_record.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("Author"), new pdf.format.PDFString(document.metadata?.author)));
		}
		information_record.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("Producer"), new pdf.format.PDFString(`${app.name} ${app.version}`)));
		information_record.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("CreationDate"), new pdf.format.PDFDate(new Date())));
		let information = new pdf.format.PDFObject(
			new pdf.format.PDFInteger(1),
			new pdf.format.PDFInteger(0),
			information_record
		);
		pdf_file.objects.push(information);
		let pdf_fonts = new pdf.format.PDFRecord([]);
		let pdf_xobjects = new pdf.format.PDFRecord([]);
		let resources = new pdf.format.PDFObject(
			new pdf.format.PDFInteger(1),
			new pdf.format.PDFInteger(0),
			new pdf.format.PDFRecord([
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("ProcSet"), new pdf.format.PDFArray([
					new pdf.format.PDFName("PDF"),
					new pdf.format.PDFName("Text"),
					new pdf.format.PDFName("ImageB"),
					new pdf.format.PDFName("ImageC"),
					new pdf.format.PDFName("ImageI")
				])),
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Font"), pdf_fonts),
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("XObject"), pdf_xobjects)
			])
		);
		pdf_file.objects.push(resources);
		let font_handler = new FontHandler(document.font);
		for (let key in document.fonts) {
			let filename = document.fonts[key];
			if (filename == null) {
				continue;
			}
			let file = document.files?.[filename];
			let buffer: Uint8Array | undefined;
			if (file == null) {
				// @ts-ignore
				buffer = require("fs").readFileSync(filename) as Uint8Array;
			} else {
				buffer = stdlib.data.chunk.Chunk.fromString(file, "base64url");
			}
			let truetype_font = truetype.parseTrueTypeData(new Uint8Array(buffer).buffer);
			let typesetter = Typesetter.createFromFont(truetype_font);
			font_handler.addTypesetter(key, typesetter);
			{
				let pdf_cid_system_info = new pdf.format.PDFObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Ordering"), new pdf.format.PDFString("Identity")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Registry"), new pdf.format.PDFString("Adobe")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Supplement"), new pdf.format.PDFInteger(0))
					])
				);
				pdf_file.objects.push(pdf_cid_system_info);
				let pdf_font_file = createStream(buffer, filter);
				pdf_file.objects.push(pdf_font_file);
				let pdf_font_descriptor = new pdf.format.PDFObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("FontDescriptor")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontName"), new pdf.format.PDFName(typesetter.getPostscriptName() ?? "Unknown")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Flags"), new pdf.format.PDFInteger(32)),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontBBox"), new pdf.format.PDFArray([
							new pdf.format.PDFReal(Math.round(truetype_font.head.x_min / truetype_font.head.units_per_em * 1000)),
							new pdf.format.PDFReal(Math.round(truetype_font.head.y_min / truetype_font.head.units_per_em * 1000)),
							new pdf.format.PDFReal(Math.round(truetype_font.head.x_max / truetype_font.head.units_per_em * 1000)),
							new pdf.format.PDFReal(Math.round(truetype_font.head.y_max / truetype_font.head.units_per_em * 1000))
						])),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("ItalicAngle"), new pdf.format.PDFReal(typesetter.getItalicAngle())),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Ascent"), new pdf.format.PDFReal(Math.round(typesetter.getAscent() * 1000))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Descent"), new pdf.format.PDFReal(Math.round(typesetter.getDescent() * 1000))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("CapHeight"), new pdf.format.PDFReal(Math.round(typesetter.getCapHeight() * 1000))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("XHeight"), new pdf.format.PDFReal(Math.round(typesetter.getXHeight() * 1000))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("StemV"), new pdf.format.PDFReal(Math.round(typesetter.getStemWidth() * 1000))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontFile2"), pdf_font_file.getReference())
					])
				);
				pdf_file.objects.push(pdf_font_descriptor);
				let widths = new pdf.format.PDFArray([]);
				for (let [index, metric] of truetype_font.hmtx.metrics.entries()) {
					widths.elements.push(new pdf.format.PDFInteger(index));
					widths.elements.push(new pdf.format.PDFArray([
						new pdf.format.PDFReal(Math.round(metric.advance_width / truetype_font.head.units_per_em * 1000))
					]));
				}
				let pdf_cid_font_type2 = new pdf.format.PDFObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("Font")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("CIDFontType2")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("BaseFont"), new pdf.format.PDFName(typesetter.getPostscriptName() ?? "Unknown")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("CIDSystemInfo"), pdf_cid_system_info.getReference()),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontDescriptor"), pdf_font_descriptor.getReference()),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("W"), widths)
					])
				);
				pdf_file.objects.push(pdf_cid_font_type2);
				let to_unicode_buffer = makeToUnicode(truetype_font);
				let pdf_to_unicode = createStream(to_unicode_buffer, filter);
				pdf_file.objects.push(pdf_to_unicode);
				let pdf_type0_font = new pdf.format.PDFObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("Font")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Type0")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("BaseFont"), new pdf.format.PDFName(typesetter.getPostscriptName() ?? "Unknown")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Encoding"), new pdf.format.PDFName("Identity-H")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("DescendantFonts"), new pdf.format.PDFArray([
							pdf_cid_font_type2.getReference()
						])),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("ToUnicode"), pdf_to_unicode.getReference())
					])
				);
				pdf_fonts.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("F" + font_handler.getTypeId(key)), pdf_type0_font.getReference()));
				pdf_file.objects.push(pdf_type0_font);
			}
		}
		let image_handler = new ImageHandler();
		for (let key in document.images) {
			let filename = document.images[key];
			if (filename == null) {
				continue;
			}
			let file = document.files?.[filename];
			let buffer: Uint8Array | undefined;
			if (file == null) {
				// @ts-ignore
				buffer = require("fs").readFileSync(filename) as Uint8Array;
			} else {
				buffer = stdlib.data.chunk.Chunk.fromString(file, "base64url");
			}
			try {
				let data = jpg.parseJpegData(new Uint8Array(buffer).buffer);
				image_handler.addEntry(key, data.sof.width, data.sof.height);
				let pdf_xobject = new pdf.format.PDFStreamObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("XObject")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Subtype"), new pdf.format.PDFName("Image")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Width"), new pdf.format.PDFInteger(data.sof.width)),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Height"), new pdf.format.PDFInteger(data.sof.height)),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("ColorSpace"), new pdf.format.PDFName("DeviceRGB")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("BitsPerComponent"), new pdf.format.PDFInteger(data.sof.precision)),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("DCTDecode")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(buffer.byteLength)),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("DecodeParms"), new pdf.format.PDFRecord([]))
					]),
					new pdf.format.PDFStream(buffer)
				);
				pdf_xobjects.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("I" + image_handler.getEntry(key).id), pdf_xobject.getReference()));
				pdf_file.objects.push(pdf_xobject);
				continue;
			} catch (error) {}
			try {
				let data = png.parsePNGData(new Uint8Array(buffer).buffer);
				image_handler.addEntry(key, data.ihdr.width, data.ihdr.height);
				let xobjects = createPNGXObjects(data);
				pdf_xobjects.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("I" + image_handler.getEntry(key).id), xobjects[0].getReference()));
				pdf_file.objects.push(...xobjects);
				continue;
			} catch (error) {}
			throw new Error(`Expected a valid image file!`);
		}
		let style_handler = new StyleHandler(document.templates, document.colors, document.unit);
		let segment_size = {
			w: layout.AbsoluteLength.getComputedLength(document.size.w, document.unit),
			h: layout.AbsoluteLength.getComputedLength(document.size.h, document.unit)
		};
		let node = createNodeClasses(image_handler, font_handler, style_handler, document.content);
		let segments = node.createSegments(segment_size, segment_size, undefined, { text_operand: "bytestring" });
		let kids = new pdf.format.PDFArray([]);
		let pages = new pdf.format.PDFObject(
			new pdf.format.PDFInteger(1),
			new pdf.format.PDFInteger(0),
			new pdf.format.PDFRecord([
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("Pages")),
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Kids"), kids),
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Count"), new pdf.format.PDFInteger(segments.length)),
			])
		);
		pdf_file.objects.push(pages);
		for (let segment of segments) {
			let commands = layout.Atom.getCommandsFromAtom(segment);
			let context = pdf.content.createContext();
			context.concatenateMatrix(1, 0, 0, 1, 0, segment_size.h);
			commands.unshift(...context.getCommands());
			let pdf_content_stream_buffer = stdlib.data.chunk.Chunk.fromString(commands.join("\n"), "binary");
			let pdf_content_stream = createStream(pdf_content_stream_buffer, filter);
			pdf_file.objects.push(pdf_content_stream);
			let page = new pdf.format.PDFObject(
				new pdf.format.PDFInteger(1),
				new pdf.format.PDFInteger(0),
				new pdf.format.PDFRecord([
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("Page")),
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("Parent"), pages.getReference()),
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("Resources"), resources.getReference()),
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("MediaBox"), new pdf.format.PDFArray([
						new pdf.format.PDFReal(0),
						new pdf.format.PDFReal(0),
						new pdf.format.PDFReal(segment_size.w),
						new pdf.format.PDFReal(segment_size.h)
					])),
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("Contents"), pdf_content_stream.getReference()),
				])
			);
			pdf_file.objects.push(page);
			kids.elements.push(page.getReference());
		}
		let catalog = new pdf.format.PDFObject(
			new pdf.format.PDFInteger(1),
			new pdf.format.PDFInteger(0),
			new pdf.format.PDFRecord([
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("Catalog")),
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Pages"), pages.getReference()),
			])
		);
		pdf_file.objects.push(catalog);
		let id = 1;
		for (let object of pdf_file.objects) {
			(object.id as any).value = id++;
		}
		pdf_file.trailer.members.push(
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Size"), new pdf.format.PDFInteger(id)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Root"), catalog.getReference()),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Info"), information.getReference())
		);
		return pdf_file;
	},

	embedResources(document: format.Document): format.Document {
		let files: Record<string, string | undefined> = {};
		for (let key in document.fonts) {
			let filename = document.fonts[key];
			if (filename == null) {
				continue;
			}
			let file = document.files?.[filename];
			let buffer: Uint8Array | undefined;
			if (file == null) {
				// @ts-ignore
				buffer = require("fs").readFileSync(filename) as Uint8Array;
			} else {
				buffer = stdlib.data.chunk.Chunk.fromString(file, "base64url");
			}
			let padded_base64url = stdlib.data.chunk.Chunk.toString(buffer, "base64").replaceAll("+", "-").replaceAll("/", "_");
			files[filename] = padded_base64url;
		}
		for (let key in document.images) {
			let filename = document.images[key];
			if (filename == null) {
				continue;
			}
			let file = document.files?.[filename];
			let buffer: Uint8Array | undefined;
			if (file == null) {
				// @ts-ignore
				buffer = require("fs").readFileSync(filename) as Uint8Array;
			} else {
				buffer = stdlib.data.chunk.Chunk.fromString(file, "base64url");
			}
			let padded_base64url = stdlib.data.chunk.Chunk.toString(buffer, "base64").replaceAll("+", "-").replaceAll("/", "_");
			files[filename] = padded_base64url;
		}
		return {
			...document,
			files
		};
	}
};
