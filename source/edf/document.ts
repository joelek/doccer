import * as stdlib from "@joelek/ts-stdlib";
import * as pdf from "../pdf";
import * as truetype from "../truetype";
import * as format from "./format";
import { BoxNode, Document, HorizontalNode, TextNode, VerticalNode } from "./format";

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

export function createNodeClasses(font_handler: truetype.FontHandler, node: format.Node): pdf.layout.Node {
	if (TextNode.is(node)) {
		return new pdf.layout.TextNode(node.content, font_handler, node.style);
	}
	if (BoxNode.is(node)) {
		return new pdf.layout.BoxNode(node.style, ...node.children.map((child) => createNodeClasses(font_handler, child)));
	}
	if (VerticalNode.is(node)) {
		return new pdf.layout.VerticalNode(node.style, ...node.children.map((child) => createNodeClasses(font_handler, child)));
	}
	if (HorizontalNode.is(node)) {
		return new pdf.layout.HorizontalNode(node.style, ...node.children.map((child) => createNodeClasses(font_handler, child)));
	}
	throw new Error();
};

export const DocumentUtils = {
	convertToPDF(document: Document): pdf.format.PDFFile {
		let pdf_file = new pdf.format.PDFFile(
			new pdf.format.PDFVersion(1, 4),
			[],
			new pdf.format.PDFRecord([]),
			[]
		);
		let pdf_fonts = new pdf.format.PDFRecord([]);
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
				new pdf.format.PDFRecordMember(new pdf.format.PDFName("Font"), pdf_fonts)
			])
		);
		pdf_file.objects.push(resources);
		let font_handler = new truetype.FontHandler();
		for (let font of document.fonts ?? []) {
			let file = document.files?.[font.file];
			let buffer: Uint8Array | undefined;
			if (file == null) {
				// @ts-ignore
				buffer = require("fs").readFileSync(font.file) as Uint8Array;
			} else {
				buffer = stdlib.data.chunk.Chunk.fromString(file, "base64");
			}
			let truetype_font = truetype.parseTrueTypeData(buffer.buffer);
			let typesetter = truetype.Typesetter.createFromFont(truetype_font);
			font_handler.addTypesetter(font.family, font.style, font.weight, typesetter);
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
				let pdf_font_file_buffer = stdlib.data.chunk.Chunk.fromString(pdf.filters.Ascii85.encode(buffer), "binary");
				let pdf_font_file = new pdf.format.PDFStreamObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Filter"), new pdf.format.PDFName("ASCII85Decode")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(pdf_font_file_buffer.byteLength))
					]),
					new pdf.format.PDFStream(pdf_font_file_buffer)
				);
				pdf_file.objects.push(pdf_font_file);
				let pdf_font_descriptor = new pdf.format.PDFObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Type"), new pdf.format.PDFName("FontDescriptor")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontName"), new pdf.format.PDFName(typesetter.getPostscriptName() ?? "Unknown")),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Flags"), new pdf.format.PDFInteger(32)),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontBBox"), new pdf.format.PDFArray([
							new pdf.format.PDFReal(truetype_font.head.x_min),
							new pdf.format.PDFReal(truetype_font.head.y_min),
							new pdf.format.PDFReal(truetype_font.head.x_max),
							new pdf.format.PDFReal(truetype_font.head.y_max)
						])),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("ItalicAngle"), new pdf.format.PDFReal(typesetter.getItalicAngle())),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Ascent"), new pdf.format.PDFReal(typesetter.getAscent(false))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Descent"), new pdf.format.PDFReal(typesetter.getDescent(false))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("CapHeight"), new pdf.format.PDFReal(typesetter.getCapHeight(false))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("XHeight"), new pdf.format.PDFReal(typesetter.getXHeight(false))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("StemV"), new pdf.format.PDFReal(typesetter.getStemWidth(false))),
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("FontFile2"), pdf_font_file.getReference())
					])
				);
				pdf_file.objects.push(pdf_font_descriptor);
				let widths = new pdf.format.PDFArray([]);
				for (let [index, metric] of truetype_font.hmtx.metrics.entries()) {
					widths.elements.push(new pdf.format.PDFInteger(index));
					widths.elements.push(new pdf.format.PDFArray([
						new pdf.format.PDFReal(metric.advance_width)
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
				let pdf_to_unicode = new pdf.format.PDFStreamObject(
					new pdf.format.PDFInteger(1),
					new pdf.format.PDFInteger(0),
					new pdf.format.PDFRecord([
						new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(to_unicode_buffer.byteLength))
					]),
					new pdf.format.PDFStream(to_unicode_buffer)
				);
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
				pdf_fonts.members.push(new pdf.format.PDFRecordMember(new pdf.format.PDFName("F" + font_handler.getTypeId(typesetter)), pdf_type0_font.getReference()));
				pdf_file.objects.push(pdf_type0_font);
			}
		}
		let segment_size = document.size;
		let node = createNodeClasses(font_handler, document.content);
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
			let commands = pdf.layout.Atom.getCommandsFromAtom(segment);
			let context = pdf.content.createContext();
			context.concatenateMatrix(72 / 25.4, 0, 0, 72 / 25.4, 0, segment_size.h * 72 / 25.4);
			commands.unshift(...context.getCommands());
			let pdf_content_stream_buffer = stdlib.data.chunk.Chunk.fromString(commands.join("\n"), "binary");
			let pdf_content_stream = new pdf.format.PDFStreamObject(
				new pdf.format.PDFInteger(1),
				new pdf.format.PDFInteger(0),
				new pdf.format.PDFRecord([
					new pdf.format.PDFRecordMember(new pdf.format.PDFName("Length"), new pdf.format.PDFInteger(pdf_content_stream_buffer.byteLength))
				]),
				new pdf.format.PDFStream(pdf_content_stream_buffer)
			);
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
						new pdf.format.PDFReal(segment_size.w / 25.4 * 72),
						new pdf.format.PDFReal(segment_size.h / 25.4 * 72)
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
		let id = 0;
		for (let object of pdf_file.objects) {
			(object.id as any).value = ++id;
		}
		pdf_file.trailer.members.push(
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Size"), new pdf.format.PDFInteger(id)),
			new pdf.format.PDFRecordMember(new pdf.format.PDFName("Root"), catalog.getReference())
		);
		return pdf_file;
	}
};
