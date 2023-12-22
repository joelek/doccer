# @joelek/doccer

Tool suite for headless document generation using the JSON-based Electronic Document Format (EDF).

```json
{
	"size": {
		"w": 210,
		"h": 297
	},
	"content": {
		"type": "box",
		"style": {
			"padding": 20
		},
		"children": [
			{
				"type": "text",
				"style": {
					"font_size": 4
				},
				"content": "This text contains both pi (π) and rocket emoji (🚀)!"
			}
		]
	}
}
```

## Background

Electronic documents can be created and designed using a plethora of authoring software. Most software makes use of proprietary file formats for storing the electronic documents and/or for interchange within a specific software suite. The file formats are not often well-documented and their specifications might not even be available or only available at a cost, at least when it comes to commercial software.

Most authoring software provide functionality for the user to export the electronic document into a format that is likely to be well-know, well-specified and well-supported by other software. That format is often the Portable Document Format (PDF), created by Adobe Systems.

The PDF-format has become the de facto standard for document interchange. Documents stored using the format are almost guaranteed to be readable by their recipients. The format dates back to 1993 and was thoroughly standardized in 2008 in a 756-page document that may be retrieved from https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/PDF32000_2008.pdf.

As the specifiation concerns a format now having existed for more than thirty years, it does contain its fair share of legacy features. There are features that can be considered more or less obsolete, features that are in direct conflict with other features and features that are of limited modern use. There are even features that are specified as optional but are to be treated as required if documents are to be rendered properly.

### Text handling

The PDF-format has included support for Unicode text since 1996 when support for the `UTF-16BE` encoding was shipped together with version 1.2. Support for the modern `UTF-8` encoding was added in 2017 with the shipping of version 2.0. The support for Unicode text encodings notably excludes support for the actual text content of the document, regardless of which encoding is used. This limitation is due to how the PDF-format, in contrast to what one might assume, describes a low-level, fully type-set document and not a general high-level one.

Since PDF-documents are fully type-set, the actual text content of the document must be stored in a way such that it produces a deterministic font glyph selection. It is possible and common to use the format for documents containing Unicode text content. However, the text must either use one of the pre-defined encodings (`StandardEncoding`, `MacRomanEncoding`, `WinAnsiEncoding`, `PDFDocEncoding` or `MacExpertEncoding`) or explicitly specify the actual glyphs to use. Using a pre-defined encoding is not ideal as the text content will be restricted to the characters defined by the encoding. Explicitly specifying the glyphs to use is also not ideal as glyph mappings are different between fonts. This complicates the common process of text extraction from PDF-documents by requring the glyph selection be reversed. In addition to this, glyph selections are stored using hexadecimally encoded `UTF-16BE`, expanding the storage requirement of the text content by up to a factor of four compared to storing the text content using `UTF-8`.

### Layout

The low-level PDF-format describes no system for handling layout, page flow or other high-level document features. Large parts of the document have to be recomputed and updated even for minor changes. Changing a font, adding or removing text or even just changing the alignment of text becomes cumbersome operations as they potentially reflow the document or require other properties be recomputed.

### Font handling

In PDF-files, fonts may be defined using seven different main font metadata structures (`Type0`, `Type1`, `MMType1`, `Type3`, `TrueType`, `CIDFontType0` and `CIDFontType2`). There are also several additional support metadata structures of which some are required and some are optional, depending on the main font metadata structure used.

Fonts may be embedded into PDF-files as document resources or stored externally as files or system resources. The specification also defines a set of fourteen default fonts that are expected to be available as system resources and that need not be embedded in order for the document to render properly. There is however no guarantee for any external font actually being available during rendering. Using substitute fonts is possible but may break the layout and introduce visual artifacts as the format lacks high-level layout and reflow logic. It is therefore recommended that fonts are embedded into PDF-files as document resources, at least partially so that the documents may render properly.

### File structure

PDF-files are defined as binary files containing a collection of objects that may refer to each other using references. The objects themselves are defined using a recursive language that may be parsed using standard tokenization methods. The language requires some tokens be sparated by whitespace in order for them to be fully distinguished from one another while permitting some tokens be joined together without the use of whitespace. The choice of tokens and syntax for the language makes parsing and serialization unnecessary complex and error-prone.

PDF-files may also contain streams that in turn contain arbitrary binary data such as embedded resources or the type-setting data for the pages of the document. As the streams may contain arbitrary binary data, PDF-files cannot be manipulated as if they were regular text files without risking the files becoming corrupt. This even though large portions of a PDF-file may consist of human-readable text.

## Features

The design choices of the PDF-format together describe a complex format that excels in presentation but that lacks in many other ways. Most significantly, the format has very poor editability. Documents stored using the format are best treated as read-only artifacts, used only for interchange.

The need for a new document format with a more consistent, modern and useful feature set is apparent.

### The Electronic Document Format (EDF)

The Electronic Document Format (EDF) was designed as a modern alternative to the PDF-format with emphasis on addressing the issue of poor editability. It is expressed as a JSON-document and serializes using UTF-8 encoding in interchange, giving it great interoperability as most systems can read JSON-documents encoded using UTF-8 with ease.

The rendering of the document is defined deterministically. For every EDF-document, there exists exactly one visual representation, provided that all resources are available to the rendering software.

[TODO]

### Tool suite

The tool suite can be installed locally or globally. Use the `npx doccer` command for local installations and the `doccer` command for global installations.

#### Convert an EDF-document into a PDF-document

An EDF-document may be converted into a PDF-document using the `edf2pdf` command. The source file is specified using the first positional argument or using the `--source=<string>` argument. The target file is specified using the second positional argument or using the `--target=<string>` argument.

All resources will be properly embedded into the target file, making it truly portable although not being editable.

```
[npx] doccer edf2pdf <source> <target>
```

#### Embed all external resources into an EDF-document

The external resources of an EDF-document may be embedded using the `embed` command. The source file is specified using the first positional argument or using the `--source=<string>` argument. The target file is specified using the second positional argument or using the `--target=<string>` argument.

All resources will be properly embedded into the target file, making it truly portable while still being fully editable.

```
[npx] doccer embed <source> <target>
```

## Sponsorship

The continued development of this software depends on your sponsorship. Please consider sponsoring this project if you find that the software creates value for you and your organization.

The sponsor button can be used to view the different sponsoring options. Contributions of all sizes are welcome.

Thank you for your support!

### Ethereum

Ethereum contributions can be made to address `0xf1B63d95BEfEdAf70B3623B1A4Ba0D9CE7F2fE6D`.

![](./eth.png)

## Installation

Releases follow semantic versioning and release packages are published using the GitHub platform. Use the following command to install the latest release.

```
npm install [-g] joelek/doccer#semver:^0.0
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install [-g] joelek/doccer#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Add support for word-break to TextNode.
* Improve PDF serialization.
* Add ImageNode.
* Add support for compound paths.
* Improve computation of binary offsets in PDF serialization.
* Add support for absolute length units.
* Use "extrinsic" as default width for all node types.
* Document features.
* Consider extracting truetype subproject into own project.
* Move font size into Typesetter.
* Consider improving handling of missing characters in PDF conversion.
* Add support for prefix and suffix nodes.
* Parse kerning data from truetype font.
* Parse ligature data from truetype font.
* Parse PDF increments.
* Serialize PDF increments.
* Consider adding variables to EDF format.
