"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const pdf = require("../pdf");
const document_1 = require("./document");
wtf.test(`DocumentUtils should create PDF files.`, (assert) => {
    let document = {
        fonts: {
            "DMSans-Regular": "./public/DMSans-Regular.ttf"
        },
        size: {
            w: 210,
            h: 297
        },
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
                    font: "DMSans-Regular",
                    style: {
                        gutter: 20,
                        columns: 3
                    },
                    content: "Det här är en text med både pi (π) och raketemoji (🚀)."
                }
            ]
        }
    };
    let pdf_file = document_1.DocumentUtils.convertToPDF(document);
    assert.instanceof(pdf_file, pdf.format.PDFFile);
});
