import * as wtf from "@joelek/wtf";
import * as pdf from "../pdf";
import { DocumentUtils } from "./document";
import { BoxNode, Document, Node, TextNode } from "./format";

wtf.test(`DocumentUtils should create PDF files.`, (assert) => {
	let document: Document = {
		font: "DMSans-Regular",
		fonts: {
			"DMSans-Regular": "./public/DMSans-Regular.ttf"
		},
		size: {
			w: 210,
			h: 297
		},
		unit: "mm",
		metadata: {
			title: "Title",
			author: "Author"
		},
		templates: {
			text: {
				default: {
					font_size: 4,
					color: "black",
					line_height: 8,
					width: "extrinsic"
				}
			}
		},
		colors: {
			black: {
				r: 0,
				g: 0,
				b: 0
			}
		},
		content: {
			type: "box",
			style: {
				padding: 20,
				width: "extrinsic"
			},
			children: [
				{
					type: "text",
					style: {
						gutter: 20,
						columns: 3
					},
					content: "Det här är en text med både pi (π) och raketemoji (🚀)."
				} satisfies TextNode as Node
			]
		} satisfies BoxNode as Node
	};
	let pdf_file = DocumentUtils.convertToPDF(document);
	assert.instanceof(pdf_file, pdf.format.PDFFile);
});
