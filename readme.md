# @joelek/doccer

Tool suite for headless document generation using the JSON-based Electronic Document Format (EDF).

```json
{
	"unit": "mm",
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

The Electronic Document Format (EDF) was designed as a modern alternative to the PDF-format with emphasis on addressing the issue of poor editability. It is expressed as a JSON-document and is serialized using UTF-8 encoding in interchange, giving it great interoperability as most systems can read JSON-documents encoded using UTF-8 with ease.

The rendering of the document is defined deterministically. For every EDF-document, there exists exactly one visual representation, provided that all resources are available to the rendering software.

#### Lengths and units

There are numerous places in the document where lengths may be specified. Lengths are always specified using non-negative numbers and may optionally specify a unit.

The format supports the absolute units points `pt`, inches `in`, picas `pc`, millimeters `mm` and centimeters `cm`. There are exactly 72 points, 1 inch, 12 picas, 25.4 millimeters and 2.54 centimeters per inch. Points are used by default whenever the unit is omitted unless another default unit is specified using the `unit` property of the document. The default unit must be an absolute unit.

```json
{
	"unit": "mm"
}
```

> Millimeters is specified as the default unit in the above example.

A length shall be specified as a two-element array when specified with a unit. The array shall contain a non-negative number and a unit expressed as a string `[5, "mm"]`. A length may also be specified as either a single-element array containing a non-negative number `[5]` or simply a non-negative number when the unit is omitted `5`.

There are two additional units that are only supported in certain contexts. The relative unit percent `%` and the relative unit fractions `fr`. The two units are defined as relative to the space available on the media along the applicable dimension. For fractions, the space available is divided into equally sized fractions based on the total number of fractions declared along the dimension. Relative lengths can not be used inside intrinsically-sized layout contexts. There is additional information about the relative units in the sections about the `layout tree` and `content flow`.

#### Media size

The recommended media size for the document must be specified using the `size` property of the document. The `size` property requires that the two subproperties `w` and `h` are present. The two subproperties must be specified as absolute lengths representing the width and height of the recommended media size for the document.

The recommended media size is used as hint to the renderer and should be used as the default media size. The renderer is allowed to use a different media size if media with the same size as specified in the document is unavailable but media with a similar size is. The actual media width may be wider than the recommended width but must not be narrower than 90% of the recommended width. The actual media height may be taller than the recommended height but must not be shorter than 50% of the recommended height. This feature allows for documents to automatically be adapted to compatible media.

```json
{
	"unit": "mm",
	"size": {
		"w": 210,
		"h": 297
	}
}
```

> A recommended media size of 210 by 297 millimeters (A4) is specified in the above example.

#### Color modes

Color may be used at multiple places in the document and may be specified using either of the three supported color modes. The color mode used to specify colors may be different for different parts of the document. This feature allows for colors to be precisely specified.

Colors may be specified using the RGB color mode for which colors are specified using the `r`, `g` and `b` components. Each component should be specified as a number in the interval between zero and one.

```json
{
	"r": 1.0,
	"g": 1.0,
	"b": 0.0
}
```

> A yellow color is specified using the RGB color mode in the above example.

Colors may be specified using the CMYK color mode for which colors are specified using the `c`, `m`, `y` and `k` components. Each component should be specified as a number in the interval between zero and one.

```json
{
	"c": 0.0,
	"m": 0.0,
	"y": 1.0,
	"k": 0.0
}
```

> A yellow color is specified using the CMYK color mode in the above example.

Colors may be specified using the Grayscale color mode for which colors are specified using the `i` component. Each component should be specified as a number in the interval between zero and one.

```json
{
	"i": 0.5
}
```

> A gray color is specified using the Grayscale color mode in the above example.

#### Color swatches

A palette of colors swatches may be specified using the `colors` property of the document. The property should specify the palette as a record of colors for which each color should be specified using one of the color modes available.

The keys used in the palette specification may be used throughout the document as references to the respective colors. This feature makes it simple to ensure that colors are being used consistently in document. It also makes editing colors simple and straight forward.

```json
{
	"colors": {
		"black": {
			"r": 0,
			"g": 0,
			"b": 0
		},
		"white": {
			"r": 1,
			"g": 1,
			"b": 1
		}
	}
}
```

> A palette containing the two colors `black` and `white` is specified in the above example.

#### Document metadata

Document metadata may be specified using the `metadata` property of the document. The property may specify the title of the document and/or its author using the two subproperties `title` and `author`, respectively. Both subproperties must be specified as strings when present.

```json
{
	"metadata": {
		"title": "Title",
		"author": "Author"
	}
}
```

> The title of the document and its author is specified in the above example.

#### File handling

Documents may embed arbitrary binary data using the `files` property of the document. The property should specify the embedded files as a record of binary data encoded as strings using [base64url](https://datatracker.ietf.org/doc/html/rfc4648) encoding. The padding characters should be present such that the number of characters for each encoded file is an even multiple of four.

The keys used in the `files` record may be used throughout the the document to reference the embedded files. The keys may be chosen freely but should for maximum compatibility contain paths relative to the document, written using unix syntax. When relative paths are used as keys, the document may use embeded and external files interchangeably.

The embedded files are used as substitutes for real files whenever referenced in the document. Only when the document contains a reference that cannot be found in the `files` record should the renderer attempt to load data from an external file.

```json
{
	"files": {
		"./fonts/DMSans-Regular.ttf": "..."
	}
}
```

> The file "./fonts/DMSans-Regular.ttf" is embeded in the above example.

#### Font handling

Font references may be specified in a way similar to how color swatches are specified. The `fonts` property of the document should when present specify the fonts of the document using a record of strings where each string corresponds to a font file. The font file should use either the TrueType format or the OpenType format. The key of every font reference in the record must use the PostScript name of the font in question. The actual files may be embedded or external and should for maximum compatibility be specified using paths relative to the document, written using unix syntax.

The default font used for text rendering may be specified using the `font` property of the document. The property should when present specify the PostScript name of the default font.

The renderer is allowed to use the PostScript name of the fonts to locate the actual font file only if the font is missing in the `fonts` record. The corresponding file, embedded or external, should always be used when the font is present in the record. The renderer should abort the rendering and display an error if it cannot locate the font file of a font being used in the document. The renderer should issue a warning about missing fonts but not abort the rendering when using the PostScript name to locate a font. No fonts may be assumed to exist.

```json
{
	"font": "DMSans-Regular",
	"fonts": {
		"DMSans-Regular": "./fonts/DMSans-Regular.ttf"
	}
}
```

> The path of the font "DMSans-Regular" is specified and set as the default font in the above example.

#### The layout tree

[TODO]

#### Content flow

[TODO]

#### Box nodes

[TODO]

#### Text nodes

[TODO]

#### Style templates

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
* Implement support for multiple text segments in TextNode.
	Properties columns, gutter, line_height and text_align should stay on TextNode container.
	Properties line_anchor and white_space mighy stay on TextNode container.
