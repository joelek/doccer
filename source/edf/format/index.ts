// This file was auto-generated by @joelek/ts-autoguard. Edit at own risk.

import * as autoguard from "@joelek/ts-autoguard/dist/lib-shared";

export const PaddedBase64URL: autoguard.serialization.MessageGuard<PaddedBase64URL> = new autoguard.guards.StringGuard(new RegExp("^([A-Za-z0-9-_]{4})*([A-Za-z0-9-_]{3}[=]{1}|[A-Za-z0-9-_]{2}[=]{2})?$"));

export type PaddedBase64URL = autoguard.guards.String;

export const NonNegativeNumber: autoguard.serialization.MessageGuard<NonNegativeNumber> = new autoguard.guards.NumberGuard(0, undefined);

export type NonNegativeNumber = autoguard.guards.Number;

export const PositiveInteger: autoguard.serialization.MessageGuard<PositiveInteger> = new autoguard.guards.IntegerGuard(1, undefined);

export type PositiveInteger = autoguard.guards.Integer;

export const ColorComponent: autoguard.serialization.MessageGuard<ColorComponent> = new autoguard.guards.NumberGuard(0, 1);

export type ColorComponent = autoguard.guards.Number;

export const GrayscaleColor: autoguard.serialization.MessageGuard<GrayscaleColor> = autoguard.guards.Object.of({
	"i": autoguard.guards.Reference.of(() => ColorComponent)
}, {});

export type GrayscaleColor = autoguard.guards.Object<{
	"i": autoguard.guards.Reference<ColorComponent>
}, {}>;

export const RGBColor: autoguard.serialization.MessageGuard<RGBColor> = autoguard.guards.Object.of({
	"r": autoguard.guards.Reference.of(() => ColorComponent),
	"g": autoguard.guards.Reference.of(() => ColorComponent),
	"b": autoguard.guards.Reference.of(() => ColorComponent)
}, {});

export type RGBColor = autoguard.guards.Object<{
	"r": autoguard.guards.Reference<ColorComponent>,
	"g": autoguard.guards.Reference<ColorComponent>,
	"b": autoguard.guards.Reference<ColorComponent>
}, {}>;

export const CMYKColor: autoguard.serialization.MessageGuard<CMYKColor> = autoguard.guards.Object.of({
	"c": autoguard.guards.Reference.of(() => ColorComponent),
	"m": autoguard.guards.Reference.of(() => ColorComponent),
	"y": autoguard.guards.Reference.of(() => ColorComponent),
	"k": autoguard.guards.Reference.of(() => ColorComponent)
}, {});

export type CMYKColor = autoguard.guards.Object<{
	"c": autoguard.guards.Reference<ColorComponent>,
	"m": autoguard.guards.Reference<ColorComponent>,
	"y": autoguard.guards.Reference<ColorComponent>,
	"k": autoguard.guards.Reference<ColorComponent>
}, {}>;

export const Color: autoguard.serialization.MessageGuard<Color> = autoguard.guards.Union.of(
	autoguard.guards.Reference.of(() => GrayscaleColor),
	autoguard.guards.Reference.of(() => RGBColor),
	autoguard.guards.Reference.of(() => CMYKColor)
);

export type Color = autoguard.guards.Union<[
	autoguard.guards.Reference<GrayscaleColor>,
	autoguard.guards.Reference<RGBColor>,
	autoguard.guards.Reference<CMYKColor>
]>;

export const Length: autoguard.serialization.MessageGuard<Length> = autoguard.guards.Union.of(
	autoguard.guards.Reference.of(() => NonNegativeNumber),
	autoguard.guards.Tuple.of(
		autoguard.guards.Reference.of(() => NonNegativeNumber)
	),
	autoguard.guards.Tuple.of(
		autoguard.guards.Reference.of(() => NonNegativeNumber),
		autoguard.guards.StringLiteral.of("%")
	)
);

export type Length = autoguard.guards.Union<[
	autoguard.guards.Reference<NonNegativeNumber>,
	autoguard.guards.Tuple<[
		autoguard.guards.Reference<NonNegativeNumber>
	]>,
	autoguard.guards.Tuple<[
		autoguard.guards.Reference<NonNegativeNumber>,
		autoguard.guards.StringLiteral<"%">
	]>
]>;

export const NodeLength: autoguard.serialization.MessageGuard<NodeLength> = autoguard.guards.Union.of(
	autoguard.guards.Reference.of(() => Length),
	autoguard.guards.Tuple.of(
		autoguard.guards.Reference.of(() => NonNegativeNumber),
		autoguard.guards.StringLiteral.of("fr")
	),
	autoguard.guards.StringLiteral.of("intrinsic"),
	autoguard.guards.StringLiteral.of("extrinsic")
);

export type NodeLength = autoguard.guards.Union<[
	autoguard.guards.Reference<Length>,
	autoguard.guards.Tuple<[
		autoguard.guards.Reference<NonNegativeNumber>,
		autoguard.guards.StringLiteral<"fr">
	]>,
	autoguard.guards.StringLiteral<"intrinsic">,
	autoguard.guards.StringLiteral<"extrinsic">
]>;

export const Size: autoguard.serialization.MessageGuard<Size> = autoguard.guards.Object.of({
	"w": autoguard.guards.Reference.of(() => NonNegativeNumber),
	"h": autoguard.guards.Reference.of(() => NonNegativeNumber)
}, {});

export type Size = autoguard.guards.Object<{
	"w": autoguard.guards.Reference<NonNegativeNumber>,
	"h": autoguard.guards.Reference<NonNegativeNumber>
}, {}>;

export const Style: autoguard.serialization.MessageGuard<Style> = autoguard.guards.Object.of({}, {
	"template": autoguard.guards.String
});

export type Style = autoguard.guards.Object<{}, {
	"template": autoguard.guards.String
}>;

export const NodeStyle: autoguard.serialization.MessageGuard<NodeStyle> = autoguard.guards.Object.of({}, {
	"height": autoguard.guards.Reference.of(() => NodeLength),
	"overflow": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("hidden"),
		autoguard.guards.StringLiteral.of("visible")
	),
	"segmentation": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("auto"),
		autoguard.guards.StringLiteral.of("none")
	),
	"width": autoguard.guards.Reference.of(() => NodeLength)
});

export type NodeStyle = autoguard.guards.Object<{}, {
	"height": autoguard.guards.Reference<NodeLength>,
	"overflow": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"hidden">,
		autoguard.guards.StringLiteral<"visible">
	]>,
	"segmentation": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"auto">,
		autoguard.guards.StringLiteral<"none">
	]>,
	"width": autoguard.guards.Reference<NodeLength>
}>;

export const Node: autoguard.serialization.MessageGuard<Node> = autoguard.guards.Object.of({
	"type": autoguard.guards.String
}, {});

export type Node = autoguard.guards.Object<{
	"type": autoguard.guards.String
}, {}>;

export const ChildNode: autoguard.serialization.MessageGuard<ChildNode> = autoguard.guards.Intersection.of(
	autoguard.guards.Reference.of(() => Node),
	autoguard.guards.Object.of({}, {})
);

export type ChildNode = autoguard.guards.Intersection<[
	autoguard.guards.Reference<Node>,
	autoguard.guards.Object<{}, {}>
]>;

export const ParentNode: autoguard.serialization.MessageGuard<ParentNode> = autoguard.guards.Intersection.of(
	autoguard.guards.Reference.of(() => ChildNode),
	autoguard.guards.Object.of({
		"children": autoguard.guards.Array.of(autoguard.guards.Reference.of(() => Node))
	}, {})
);

export type ParentNode = autoguard.guards.Intersection<[
	autoguard.guards.Reference<ChildNode>,
	autoguard.guards.Object<{
		"children": autoguard.guards.Array<autoguard.guards.Reference<Node>>
	}, {}>
]>;

export const TextStyle: autoguard.serialization.MessageGuard<TextStyle> = autoguard.guards.Object.of({}, {
	"color": autoguard.guards.Union.of(
		autoguard.guards.String,
		autoguard.guards.StringLiteral.of("transparent"),
		autoguard.guards.Reference.of(() => Color)
	),
	"columns": autoguard.guards.Reference.of(() => PositiveInteger),
	"font": autoguard.guards.String,
	"font_size": autoguard.guards.Reference.of(() => NonNegativeNumber),
	"gutter": autoguard.guards.Reference.of(() => Length),
	"letter_spacing": autoguard.guards.Reference.of(() => NonNegativeNumber),
	"line_anchor": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("meanline"),
		autoguard.guards.StringLiteral.of("capline"),
		autoguard.guards.StringLiteral.of("topline"),
		autoguard.guards.StringLiteral.of("bottomline"),
		autoguard.guards.StringLiteral.of("baseline")
	),
	"line_height": autoguard.guards.Reference.of(() => NonNegativeNumber),
	"orphans": autoguard.guards.Reference.of(() => PositiveInteger),
	"text_align": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("start"),
		autoguard.guards.StringLiteral.of("center"),
		autoguard.guards.StringLiteral.of("end")
	),
	"text_transform": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("none"),
		autoguard.guards.StringLiteral.of("lowercase"),
		autoguard.guards.StringLiteral.of("uppercase")
	),
	"white_space": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("wrap"),
		autoguard.guards.StringLiteral.of("nowrap")
	),
	"word_spacing": autoguard.guards.Reference.of(() => NonNegativeNumber)
});

export type TextStyle = autoguard.guards.Object<{}, {
	"color": autoguard.guards.Union<[
		autoguard.guards.String,
		autoguard.guards.StringLiteral<"transparent">,
		autoguard.guards.Reference<Color>
	]>,
	"columns": autoguard.guards.Reference<PositiveInteger>,
	"font": autoguard.guards.String,
	"font_size": autoguard.guards.Reference<NonNegativeNumber>,
	"gutter": autoguard.guards.Reference<Length>,
	"letter_spacing": autoguard.guards.Reference<NonNegativeNumber>,
	"line_anchor": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"meanline">,
		autoguard.guards.StringLiteral<"capline">,
		autoguard.guards.StringLiteral<"topline">,
		autoguard.guards.StringLiteral<"bottomline">,
		autoguard.guards.StringLiteral<"baseline">
	]>,
	"line_height": autoguard.guards.Reference<NonNegativeNumber>,
	"orphans": autoguard.guards.Reference<PositiveInteger>,
	"text_align": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"start">,
		autoguard.guards.StringLiteral<"center">,
		autoguard.guards.StringLiteral<"end">
	]>,
	"text_transform": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"none">,
		autoguard.guards.StringLiteral<"lowercase">,
		autoguard.guards.StringLiteral<"uppercase">
	]>,
	"white_space": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"wrap">,
		autoguard.guards.StringLiteral<"nowrap">
	]>,
	"word_spacing": autoguard.guards.Reference<NonNegativeNumber>
}>;

export const TextNodeStyle: autoguard.serialization.MessageGuard<TextNodeStyle> = autoguard.guards.Intersection.of(
	autoguard.guards.Reference.of(() => Style),
	autoguard.guards.Reference.of(() => NodeStyle),
	autoguard.guards.Reference.of(() => TextStyle)
);

export type TextNodeStyle = autoguard.guards.Intersection<[
	autoguard.guards.Reference<Style>,
	autoguard.guards.Reference<NodeStyle>,
	autoguard.guards.Reference<TextStyle>
]>;

export const TextNode: autoguard.serialization.MessageGuard<TextNode> = autoguard.guards.Intersection.of(
	autoguard.guards.Reference.of(() => ChildNode),
	autoguard.guards.Object.of({
		"type": autoguard.guards.StringLiteral.of("text"),
		"content": autoguard.guards.String
	}, {
		"style": autoguard.guards.Reference.of(() => TextNodeStyle)
	})
);

export type TextNode = autoguard.guards.Intersection<[
	autoguard.guards.Reference<ChildNode>,
	autoguard.guards.Object<{
		"type": autoguard.guards.StringLiteral<"text">,
		"content": autoguard.guards.String
	}, {
		"style": autoguard.guards.Reference<TextNodeStyle>
	}>
]>;

export const BoxStyle: autoguard.serialization.MessageGuard<BoxStyle> = autoguard.guards.Object.of({}, {
	"align_x": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("left"),
		autoguard.guards.StringLiteral.of("center"),
		autoguard.guards.StringLiteral.of("right")
	),
	"align_y": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("top"),
		autoguard.guards.StringLiteral.of("middle"),
		autoguard.guards.StringLiteral.of("bottom")
	),
	"background_color": autoguard.guards.Union.of(
		autoguard.guards.String,
		autoguard.guards.StringLiteral.of("transparent"),
		autoguard.guards.Reference.of(() => Color)
	),
	"border_color": autoguard.guards.Union.of(
		autoguard.guards.String,
		autoguard.guards.StringLiteral.of("transparent"),
		autoguard.guards.Reference.of(() => Color)
	),
	"border_radius": autoguard.guards.Reference.of(() => Length),
	"border_width": autoguard.guards.Reference.of(() => Length),
	"gap": autoguard.guards.Reference.of(() => Length),
	"layout": autoguard.guards.Union.of(
		autoguard.guards.StringLiteral.of("vertical"),
		autoguard.guards.StringLiteral.of("horizontal")
	),
	"padding": autoguard.guards.Reference.of(() => Length)
});

export type BoxStyle = autoguard.guards.Object<{}, {
	"align_x": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"left">,
		autoguard.guards.StringLiteral<"center">,
		autoguard.guards.StringLiteral<"right">
	]>,
	"align_y": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"top">,
		autoguard.guards.StringLiteral<"middle">,
		autoguard.guards.StringLiteral<"bottom">
	]>,
	"background_color": autoguard.guards.Union<[
		autoguard.guards.String,
		autoguard.guards.StringLiteral<"transparent">,
		autoguard.guards.Reference<Color>
	]>,
	"border_color": autoguard.guards.Union<[
		autoguard.guards.String,
		autoguard.guards.StringLiteral<"transparent">,
		autoguard.guards.Reference<Color>
	]>,
	"border_radius": autoguard.guards.Reference<Length>,
	"border_width": autoguard.guards.Reference<Length>,
	"gap": autoguard.guards.Reference<Length>,
	"layout": autoguard.guards.Union<[
		autoguard.guards.StringLiteral<"vertical">,
		autoguard.guards.StringLiteral<"horizontal">
	]>,
	"padding": autoguard.guards.Reference<Length>
}>;

export const BoxNodeStyle: autoguard.serialization.MessageGuard<BoxNodeStyle> = autoguard.guards.Intersection.of(
	autoguard.guards.Reference.of(() => Style),
	autoguard.guards.Reference.of(() => NodeStyle),
	autoguard.guards.Reference.of(() => BoxStyle)
);

export type BoxNodeStyle = autoguard.guards.Intersection<[
	autoguard.guards.Reference<Style>,
	autoguard.guards.Reference<NodeStyle>,
	autoguard.guards.Reference<BoxStyle>
]>;

export const BoxNode: autoguard.serialization.MessageGuard<BoxNode> = autoguard.guards.Intersection.of(
	autoguard.guards.Reference.of(() => ParentNode),
	autoguard.guards.Object.of({
		"type": autoguard.guards.StringLiteral.of("box")
	}, {
		"style": autoguard.guards.Reference.of(() => BoxNodeStyle)
	})
);

export type BoxNode = autoguard.guards.Intersection<[
	autoguard.guards.Reference<ParentNode>,
	autoguard.guards.Object<{
		"type": autoguard.guards.StringLiteral<"box">
	}, {
		"style": autoguard.guards.Reference<BoxNodeStyle>
	}>
]>;

export const Colors: autoguard.serialization.MessageGuard<Colors> = autoguard.guards.Record.of(autoguard.guards.Reference.of(() => Color));

export type Colors = autoguard.guards.Record<autoguard.guards.Reference<Color>>;

export const Metadata: autoguard.serialization.MessageGuard<Metadata> = autoguard.guards.Object.of({}, {
	"title": autoguard.guards.String,
	"author": autoguard.guards.String
});

export type Metadata = autoguard.guards.Object<{}, {
	"title": autoguard.guards.String,
	"author": autoguard.guards.String
}>;

export const Templates: autoguard.serialization.MessageGuard<Templates> = autoguard.guards.Object.of({}, {
	"box": autoguard.guards.Record.of(autoguard.guards.Reference.of(() => BoxNodeStyle)),
	"text": autoguard.guards.Record.of(autoguard.guards.Reference.of(() => TextNodeStyle))
});

export type Templates = autoguard.guards.Object<{}, {
	"box": autoguard.guards.Record<autoguard.guards.Reference<BoxNodeStyle>>,
	"text": autoguard.guards.Record<autoguard.guards.Reference<TextNodeStyle>>
}>;

export const Document: autoguard.serialization.MessageGuard<Document> = autoguard.guards.Object.of({
	"content": autoguard.guards.Reference.of(() => Node),
	"size": autoguard.guards.Reference.of(() => Size)
}, {
	"colors": autoguard.guards.Reference.of(() => Colors),
	"files": autoguard.guards.Record.of(autoguard.guards.Reference.of(() => PaddedBase64URL)),
	"fonts": autoguard.guards.Record.of(autoguard.guards.String),
	"metadata": autoguard.guards.Reference.of(() => Metadata),
	"templates": autoguard.guards.Reference.of(() => Templates)
});

export type Document = autoguard.guards.Object<{
	"content": autoguard.guards.Reference<Node>,
	"size": autoguard.guards.Reference<Size>
}, {
	"colors": autoguard.guards.Reference<Colors>,
	"files": autoguard.guards.Record<autoguard.guards.Reference<PaddedBase64URL>>,
	"fonts": autoguard.guards.Record<autoguard.guards.String>,
	"metadata": autoguard.guards.Reference<Metadata>,
	"templates": autoguard.guards.Reference<Templates>
}>;

export namespace Autoguard {
	export const Guards = {
		"PaddedBase64URL": autoguard.guards.Reference.of(() => PaddedBase64URL),
		"NonNegativeNumber": autoguard.guards.Reference.of(() => NonNegativeNumber),
		"PositiveInteger": autoguard.guards.Reference.of(() => PositiveInteger),
		"ColorComponent": autoguard.guards.Reference.of(() => ColorComponent),
		"GrayscaleColor": autoguard.guards.Reference.of(() => GrayscaleColor),
		"RGBColor": autoguard.guards.Reference.of(() => RGBColor),
		"CMYKColor": autoguard.guards.Reference.of(() => CMYKColor),
		"Color": autoguard.guards.Reference.of(() => Color),
		"Length": autoguard.guards.Reference.of(() => Length),
		"NodeLength": autoguard.guards.Reference.of(() => NodeLength),
		"Size": autoguard.guards.Reference.of(() => Size),
		"Style": autoguard.guards.Reference.of(() => Style),
		"NodeStyle": autoguard.guards.Reference.of(() => NodeStyle),
		"Node": autoguard.guards.Reference.of(() => Node),
		"ChildNode": autoguard.guards.Reference.of(() => ChildNode),
		"ParentNode": autoguard.guards.Reference.of(() => ParentNode),
		"TextStyle": autoguard.guards.Reference.of(() => TextStyle),
		"TextNodeStyle": autoguard.guards.Reference.of(() => TextNodeStyle),
		"TextNode": autoguard.guards.Reference.of(() => TextNode),
		"BoxStyle": autoguard.guards.Reference.of(() => BoxStyle),
		"BoxNodeStyle": autoguard.guards.Reference.of(() => BoxNodeStyle),
		"BoxNode": autoguard.guards.Reference.of(() => BoxNode),
		"Colors": autoguard.guards.Reference.of(() => Colors),
		"Metadata": autoguard.guards.Reference.of(() => Metadata),
		"Templates": autoguard.guards.Reference.of(() => Templates),
		"Document": autoguard.guards.Reference.of(() => Document)
	};

	export type Guards = { [A in keyof typeof Guards]: ReturnType<typeof Guards[A]["as"]>; };

	export const Requests = {};

	export type Requests = { [A in keyof typeof Requests]: ReturnType<typeof Requests[A]["as"]>; };

	export const Responses = {};

	export type Responses = { [A in keyof typeof Responses]: ReturnType<typeof Responses[A]["as"]>; };
};
