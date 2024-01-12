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

As the specifiation concerns a format now having existed for more than thirty years, it does contain its fair share of legacy features. There are features that can be considered more or less obsolete, features that are in direct conflict with other features and features that are of limited modern use. There are even features that are specified as optional but are to be treated as required to ensure that documents are displayed properly.

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

#### Absolute lengths and units

There are numerous places in the document where lengths may be specified. Lengths are always specified using non-negative numbers and may optionally specify a unit.

The format supports the absolute units points `pt`, inches `in`, picas `pc`, millimeters `mm` and centimeters `cm`. There are exactly 72 points, 1 inch, 12 picas, 25.4 millimeters and 2.54 centimeters per inch. Points are used by default whenever the unit is omitted unless another default absolute unit is specified using the `unit` property of the document. Absolute lengths may be used anywhere in the document.

```json
{
	"unit": "mm"
}
```

> Millimeters is specified as the default unit in the above example.

A length shall be specified as a two-element array when specified with a unit. The array shall contain a non-negative number and a unit expressed as a string `[5, "mm"]`. A length shall be specified as a non-negative number when the unit is omitted `5`.

#### Relative lengths and units

There are two relative units that may only be used within certain contexts where relative lengths are permitted. The relative unit percent `%` and the relative unit fractions `fr`.

The two units are defined as relative to the space available. For fractions, the space available is divided into equally sized fractions based on the total number of fractions. If there are two lengths over which to distribute the space and the two lengths are defined as `[1 "fr"]` and `[2, "fr"]`, the space available will be split into three equally-sized parts. The first length will always be half as long as the second length as long as there is space available to distribute.

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

**RGB**

Colors may be specified using the RGB color mode for which colors are specified using the `r`, `g` and `b` components. Each component should be specified as a number in the interval between zero and one.

```json
{
	"r": 1.0,
	"g": 1.0,
	"b": 0.0
}
```

> A yellow color is specified using the RGB color mode in the above example.

**CMYK**

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

**Grayscale**

Colors may be specified using the Grayscale color mode for which colors are specified using the `i` component. Each component should be specified as a number in the interval between zero and one.

```json
{
	"i": 0.5
}
```

> A gray color is specified using the Grayscale color mode in the above example.

#### Color swatches

A palette of colors swatches may be specified using the `colors` property of the document. The property should specify the palette as a record of colors for which each color should be specified using one of the color modes available.

The keys used in the palette specification may be used anywhere in the document as references to the respective colors. This feature makes it simple to ensure that colors are being used consistently throughout document. It also makes editing colors simple and straight-forward.

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
		"./fonts/OpenSans-Regular.ttf": "..."
	}
}
```

> The file "./fonts/OpenSans-Regular.ttf" is embeded in the above example.

#### Font handling

Font references may be specified in a way similar to how color swatches are specified. The `fonts` property of the document should when present specify the fonts of the document using a record of strings where each string corresponds to a font file. The font file should use either the TrueType format or the OpenType format. The key of every font reference in the record must use the PostScript name of the font in question. The actual files may be embedded or external and should for maximum compatibility be specified using paths relative to the document, written using unix syntax.

The default font used for text rendering may be specified using the `font` property of the document. The property should when present specify the PostScript name of the default font.

The renderer is allowed to use the PostScript name of the fonts to locate the actual font file only if the font is missing in the `fonts` record. The corresponding file, embedded or external, should always be used when the font is present. The renderer should abort the rendering and display an error if it cannot locate the font file of a font being used in the document. The renderer should issue a warning about missing fonts but not abort the rendering when using the PostScript name to locate a font. No fonts may be assumed to exist.

```json
{
	"font": "OpenSans-Regular",
	"fonts": {
		"OpenSans-Regular": "./fonts/OpenSans-Regular.ttf"
	}
}
```

> The path of the font "OpenSans-Regular" is specified and set as the default font in the above example.

#### The content tree

The document stores its content as a tree of abstract nodes. The nodes contain data specific to each node and together define the layout of the document. The nodes are considered abstract in the sense that the tree stores them using a standardized format that is independent of their actual types.

Each node must specify its type using the `type` property for which the type is specified as a string. The renderer should produce a warning whenever a node with an unrecognized type is encountered but should not abort the rendering. Nodes with unrecognized types should be layed out as if they had been recognized but should be rendered completely transparent.

All nodes are child nodes but only some nodes are parent nodes in addition to also being child nodes. Child nodes may not store child nodes of their own but parent nodes may store any number of child nodes using the `children` property of the node. This definition creates a recursive, abstract and extensible structure supporting trees of any complexity.

```json
{
	"type": "a-parent-node",
	"children": [
		{
			"type": "a-child-node"
		},
		{
			"type": "a-child-node"
		}
	]
}
```

> A parent node containing two child nodes is specified in the above example.

The `content` property of the document must be used to specify the root node of the tree. The root node may for very simple documents be the only node in the entire tree but is more often the ancestor and parent node of a complex tree.

```json
{
	"content": {
		"type": "a-child-node"
	}
}
```

> The root node is defined for the document in the above example.

#### Document layout

The content tree is used to generate the layout of the document through the layout algorithm. The algorithm processes the nodes of the document hierarchically and automatically segments the content into multiple pages as needed.

While generating the layout, the algorithm keeps track of the space available on the current page as well as the space that can become available through adding a new page. This information is used when rendering a node in order to decide whether to place the node on the current page, to place it on a new page or to segment the node into multiple segments spanning multiple pages. The space available for layout is initialized to the full page size which also becomes the constraining size for the root node of the document.

Nodes are sized either absolutely, relatively or intrinsically. Absolutely-sized nodes have a size that is independent of the constraining size while relatively-sized nodes are dependent on the constraining size. Intrinsically-sized nodes do not define a size themselves but instead specify their size relative to their content.

The heights and widths of the nodes in the document may be specified independently. The properties should when present be specified either as absolute lengths, relative lengths or as strings containing either the value "intrinsic" or the value "extrinsic". The value "intrinsic" will make the node adapt its size to the size of its children while the value "extrinsic" will make the node adapt to the constraining size.

Intrinsic node height is a requirement for the algorithm to automatically segment a node into multiple pages. A node will be placed on a single page in its entirety whenever height is specified absolutely or relatively. The algorithm should place such nodes on new pages if the entire height of the node cannot fit within the current constrained height.

Direct or indirect child nodes of intrinsically-sized nodes may not specify their sizes relatively as this creates a catch-22 situation. The size of the parent node becomes dependent on the size of the child node which is dependent on the size of the parent node and so forth... The renderer should produce a warning and abort the rendering if such a sitation arises.

#### Style attributes

All nodes may define style attributes using the `style` property of the node. The property should when present specify any subset of the common and specific style attributes for the node type of the node in question. The common attributes are available for every node type and should be specified as detailed below when present.

**height**

The height of the node may be specified through the `height` attribute. The attribute will assume the value `intrinsic` by default.

**overflow**

The overflow behaviour of the node may be specified through the `overflow` attribute. The attribute should when present be specified as a string assuming either the value "hidden" or the value "visible". The default value is "visible".

**segmentation**

The segmentation behaviour of the node may be specified through the `segmentation` attribute. The attribute should when present be specified as a string assuming either the value "auto" or the value "none". The default value is "auto" when the height of the node is "intrinsic" and "none" otherwise. It is invalid to specify the segmentation behaviour as "auto" while also specifying the height as "intrinsic". The renderer should display a warning and abort the rendering if such a situation arises.

**template**

The style template to apply may be specified using the `template` attribute. The attribute should be specified as a string containing the template name of the desired template. You can read more about style templates in the next section.

**width**

The width of the node may be specified through the `width` attribute. The attribute will assume the value `intrinsic` by default.

#### Box nodes

[TODO]

#### Text nodes

[TODO]

#### Style templates

Documents may specify style templates for its nodes using the different subproperties of the `templates` property of the document. Each subproperty should when present define the templates using a record of the style attributes for the node in question. The template names are used as keys. The same template name may be used for two unique templates as long as the two templates are specified for two different node types.

* The subproperty `box` may be used to specify templates for box nodes.
* The subproperty `text` may be used to specify templates for text nodes.

A `default` template may be defined for each node type. It is defined using the the template name "default" and will be applied as a default set of attributes for all nodes of the type in question. Templates other than the default may be applied by setting the `template` attribute of a node to the template name of the desired template. The renderer must generate an error and abort the rendering if a template cannot be found unless the template name is "default".

The `template` attribute may also be used to define templates recursively. The templates are applied in order with each template having the option to override none, some or all of the attributes specified by the previous templates. The feature provides a simple mechanism for creating style variants with deterministic rules for precedence since no attributes are inherited within the content tree. The renderer must detect circularily defined templates, generate an error and abort the rendering if such a situation arises.

```json
{
	"templates": {
		"text": {
			"default": {
				"color": "black",
				"font_size": 12
			},
			"page-header": {
				"font_size": 20 // Overrides the font size from the default template.
			},
			"red-page-header": {
				"template": "page-header",
				"color": "red" // Overrides the color from the default template.
			}
		}
	}
}
```

> The default style template and the templates "page-header" and "red-page-header" for text nodes are defined in the above example. The "page-header" template implicitly extends from the default template while the "red-page-header" explicitly extends from the "page-header" template and by that also from the default template.

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

* The keyword `stdin` may be used to indicate that standard input should be used as the source.
* The keyword `stdout` may be used to indicate that standard output should be used as the target.

#### Parse font file into JSON format

A font file may be parsed using the `parsefont` command. The source file is specified using the first positional argument or using the `--source=<string>` argument.The target file is specified using the second positional argument or using the `--target=<string>` argument.

```
[npx] doccer parsefont <source> <target>
```

* The keyword `stdin` may be used to indicate that standard input should be used as the source.
* The keyword `stdout` may be used to indicate that standard output should be used as the target.

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
* Use "extrinsic" as default width for all node types.
* Document features.
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
	Properties line_anchor and white_space might stay on TextNode container.
	Style templates should be supported for each individual segment.
* Decide whether to drop or keep "font" property.
* Add support for color profiles.
	The built-in color spaces /DeviceGray, /DeviceRGB and /DeviceCMYK exist.
	The command CS sets stroke color space.
	The command cs sets fill color space.
	The command SC sets stroke color (1-4 operands).
	the command sc sets fill color (1-4 operands).
	Can embed ICC color spaces as resources (see page 149).
* Remove unused segmentation state.
* Implement font subsetting.
* Add context helper for creating instances of layout nodes.
* Add page-break control to all node types.
* Use precise sizes and positions in layout computations.
