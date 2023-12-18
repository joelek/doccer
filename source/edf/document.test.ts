import * as wtf from "@joelek/wtf";
import * as pdf from "../pdf";
import { DocumentUtils } from "./document";
import { BoxNode, Document, Node, TextNode } from "./format";

wtf.test(`DocumentUtils should create PDF files.`, (assert) => {
	let document: Document = {
		fonts: [
			{
				family: "DM Sans",
				style: "normal",
				weight: "normal",
				file: "./public/DMSans-Regular.ttf"
			}
		],
		size: {
			w: 210,
			h: 297
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
						font_family: "DM Sans",
						font_size: 4,
						color: { r: 0, g: 0, b: 0 },
						gutter: 20,
						columns: 3,
						line_height: 8,
						width: "extrinsic"
					},
					content: "Det här är en text med både pi (π) och raketemoji (🚀)."
				} satisfies TextNode as Node
			]
		} satisfies BoxNode as Node
	};
	let pdf_file = DocumentUtils.convertToPDF(document);
	assert.instanceof(pdf_file, pdf.format.PDFFile);
});
