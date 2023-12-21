"use strict";
// This file was auto-generated by @joelek/ts-autoguard. Edit at own risk.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autoguard = exports.Document = exports.Templates = exports.Metadata = exports.Colors = exports.BoxNode = exports.BoxNodeStyle = exports.BoxStyle = exports.TextNode = exports.TextNodeStyle = exports.TextStyle = exports.ParentNode = exports.ChildNode = exports.Node = exports.NodeStyle = exports.Style = exports.Size = exports.NodeLength = exports.Length = exports.Color = exports.CMYKColor = exports.RGBColor = exports.GrayscaleColor = exports.ColorComponent = exports.PositiveInteger = exports.NonNegativeNumber = exports.PaddedBase64URL = void 0;
const autoguard = require("@joelek/ts-autoguard/dist/lib-shared");
exports.PaddedBase64URL = new autoguard.guards.StringGuard(new RegExp("^([A-Za-z0-9-_]{4})*([A-Za-z0-9-_]{3}[=]{1}|[A-Za-z0-9-_]{2}[=]{2})?$"));
exports.NonNegativeNumber = new autoguard.guards.NumberGuard(0, undefined);
exports.PositiveInteger = new autoguard.guards.IntegerGuard(1, undefined);
exports.ColorComponent = new autoguard.guards.NumberGuard(0, 1);
exports.GrayscaleColor = autoguard.guards.Object.of({
    "i": autoguard.guards.Reference.of(() => exports.ColorComponent)
}, {});
exports.RGBColor = autoguard.guards.Object.of({
    "r": autoguard.guards.Reference.of(() => exports.ColorComponent),
    "g": autoguard.guards.Reference.of(() => exports.ColorComponent),
    "b": autoguard.guards.Reference.of(() => exports.ColorComponent)
}, {});
exports.CMYKColor = autoguard.guards.Object.of({
    "c": autoguard.guards.Reference.of(() => exports.ColorComponent),
    "m": autoguard.guards.Reference.of(() => exports.ColorComponent),
    "y": autoguard.guards.Reference.of(() => exports.ColorComponent),
    "k": autoguard.guards.Reference.of(() => exports.ColorComponent)
}, {});
exports.Color = autoguard.guards.Union.of(autoguard.guards.Reference.of(() => exports.GrayscaleColor), autoguard.guards.Reference.of(() => exports.RGBColor), autoguard.guards.Reference.of(() => exports.CMYKColor));
exports.Length = autoguard.guards.Union.of(autoguard.guards.Reference.of(() => exports.NonNegativeNumber), autoguard.guards.Tuple.of(autoguard.guards.Reference.of(() => exports.NonNegativeNumber)), autoguard.guards.Tuple.of(autoguard.guards.Reference.of(() => exports.NonNegativeNumber), autoguard.guards.StringLiteral.of("%")));
exports.NodeLength = autoguard.guards.Union.of(autoguard.guards.Reference.of(() => exports.Length), autoguard.guards.Tuple.of(autoguard.guards.Reference.of(() => exports.NonNegativeNumber), autoguard.guards.StringLiteral.of("fr")), autoguard.guards.StringLiteral.of("intrinsic"), autoguard.guards.StringLiteral.of("extrinsic"));
exports.Size = autoguard.guards.Object.of({
    "w": autoguard.guards.Reference.of(() => exports.NonNegativeNumber),
    "h": autoguard.guards.Reference.of(() => exports.NonNegativeNumber)
}, {});
exports.Style = autoguard.guards.Object.of({}, {
    "template": autoguard.guards.String
});
exports.NodeStyle = autoguard.guards.Object.of({}, {
    "height": autoguard.guards.Reference.of(() => exports.NodeLength),
    "overflow": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("hidden"), autoguard.guards.StringLiteral.of("visible")),
    "segmentation": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("auto"), autoguard.guards.StringLiteral.of("none")),
    "width": autoguard.guards.Reference.of(() => exports.NodeLength)
});
exports.Node = autoguard.guards.Object.of({
    "type": autoguard.guards.String
}, {});
exports.ChildNode = autoguard.guards.Intersection.of(autoguard.guards.Reference.of(() => exports.Node), autoguard.guards.Object.of({}, {}));
exports.ParentNode = autoguard.guards.Intersection.of(autoguard.guards.Reference.of(() => exports.ChildNode), autoguard.guards.Object.of({
    "children": autoguard.guards.Array.of(autoguard.guards.Reference.of(() => exports.Node))
}, {}));
exports.TextStyle = autoguard.guards.Object.of({}, {
    "color": autoguard.guards.Union.of(autoguard.guards.String, autoguard.guards.StringLiteral.of("transparent"), autoguard.guards.Reference.of(() => exports.Color)),
    "columns": autoguard.guards.Reference.of(() => exports.PositiveInteger),
    "font": autoguard.guards.String,
    "font_size": autoguard.guards.Reference.of(() => exports.NonNegativeNumber),
    "gutter": autoguard.guards.Reference.of(() => exports.Length),
    "letter_spacing": autoguard.guards.Reference.of(() => exports.NonNegativeNumber),
    "line_anchor": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("meanline"), autoguard.guards.StringLiteral.of("capline"), autoguard.guards.StringLiteral.of("topline"), autoguard.guards.StringLiteral.of("bottomline"), autoguard.guards.StringLiteral.of("baseline")),
    "line_height": autoguard.guards.Reference.of(() => exports.NonNegativeNumber),
    "orphans": autoguard.guards.Reference.of(() => exports.PositiveInteger),
    "text_align": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("start"), autoguard.guards.StringLiteral.of("center"), autoguard.guards.StringLiteral.of("end")),
    "text_transform": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("none"), autoguard.guards.StringLiteral.of("lowercase"), autoguard.guards.StringLiteral.of("uppercase")),
    "white_space": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("wrap"), autoguard.guards.StringLiteral.of("nowrap")),
    "word_spacing": autoguard.guards.Reference.of(() => exports.NonNegativeNumber)
});
exports.TextNodeStyle = autoguard.guards.Intersection.of(autoguard.guards.Reference.of(() => exports.Style), autoguard.guards.Reference.of(() => exports.NodeStyle), autoguard.guards.Reference.of(() => exports.TextStyle));
exports.TextNode = autoguard.guards.Intersection.of(autoguard.guards.Reference.of(() => exports.ChildNode), autoguard.guards.Object.of({
    "type": autoguard.guards.StringLiteral.of("text"),
    "content": autoguard.guards.String
}, {
    "style": autoguard.guards.Reference.of(() => exports.TextNodeStyle)
}));
exports.BoxStyle = autoguard.guards.Object.of({}, {
    "align_x": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("left"), autoguard.guards.StringLiteral.of("center"), autoguard.guards.StringLiteral.of("right")),
    "align_y": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("top"), autoguard.guards.StringLiteral.of("middle"), autoguard.guards.StringLiteral.of("bottom")),
    "background_color": autoguard.guards.Union.of(autoguard.guards.String, autoguard.guards.StringLiteral.of("transparent"), autoguard.guards.Reference.of(() => exports.Color)),
    "border_color": autoguard.guards.Union.of(autoguard.guards.String, autoguard.guards.StringLiteral.of("transparent"), autoguard.guards.Reference.of(() => exports.Color)),
    "border_radius": autoguard.guards.Reference.of(() => exports.Length),
    "border_width": autoguard.guards.Reference.of(() => exports.Length),
    "gap": autoguard.guards.Reference.of(() => exports.Length),
    "layout": autoguard.guards.Union.of(autoguard.guards.StringLiteral.of("vertical"), autoguard.guards.StringLiteral.of("horizontal")),
    "padding": autoguard.guards.Reference.of(() => exports.Length)
});
exports.BoxNodeStyle = autoguard.guards.Intersection.of(autoguard.guards.Reference.of(() => exports.Style), autoguard.guards.Reference.of(() => exports.NodeStyle), autoguard.guards.Reference.of(() => exports.BoxStyle));
exports.BoxNode = autoguard.guards.Intersection.of(autoguard.guards.Reference.of(() => exports.ParentNode), autoguard.guards.Object.of({
    "type": autoguard.guards.StringLiteral.of("box")
}, {
    "style": autoguard.guards.Reference.of(() => exports.BoxNodeStyle)
}));
exports.Colors = autoguard.guards.Record.of(autoguard.guards.Reference.of(() => exports.Color));
exports.Metadata = autoguard.guards.Object.of({}, {
    "title": autoguard.guards.String,
    "author": autoguard.guards.String
});
exports.Templates = autoguard.guards.Object.of({}, {
    "box": autoguard.guards.Record.of(autoguard.guards.Reference.of(() => exports.BoxNodeStyle)),
    "text": autoguard.guards.Record.of(autoguard.guards.Reference.of(() => exports.TextNodeStyle))
});
exports.Document = autoguard.guards.Object.of({
    "content": autoguard.guards.Reference.of(() => exports.Node),
    "size": autoguard.guards.Reference.of(() => exports.Size)
}, {
    "colors": autoguard.guards.Reference.of(() => exports.Colors),
    "files": autoguard.guards.Record.of(autoguard.guards.Reference.of(() => exports.PaddedBase64URL)),
    "fonts": autoguard.guards.Record.of(autoguard.guards.String),
    "metadata": autoguard.guards.Reference.of(() => exports.Metadata),
    "templates": autoguard.guards.Reference.of(() => exports.Templates)
});
var Autoguard;
(function (Autoguard) {
    Autoguard.Guards = {
        "PaddedBase64URL": autoguard.guards.Reference.of(() => exports.PaddedBase64URL),
        "NonNegativeNumber": autoguard.guards.Reference.of(() => exports.NonNegativeNumber),
        "PositiveInteger": autoguard.guards.Reference.of(() => exports.PositiveInteger),
        "ColorComponent": autoguard.guards.Reference.of(() => exports.ColorComponent),
        "GrayscaleColor": autoguard.guards.Reference.of(() => exports.GrayscaleColor),
        "RGBColor": autoguard.guards.Reference.of(() => exports.RGBColor),
        "CMYKColor": autoguard.guards.Reference.of(() => exports.CMYKColor),
        "Color": autoguard.guards.Reference.of(() => exports.Color),
        "Length": autoguard.guards.Reference.of(() => exports.Length),
        "NodeLength": autoguard.guards.Reference.of(() => exports.NodeLength),
        "Size": autoguard.guards.Reference.of(() => exports.Size),
        "Style": autoguard.guards.Reference.of(() => exports.Style),
        "NodeStyle": autoguard.guards.Reference.of(() => exports.NodeStyle),
        "Node": autoguard.guards.Reference.of(() => exports.Node),
        "ChildNode": autoguard.guards.Reference.of(() => exports.ChildNode),
        "ParentNode": autoguard.guards.Reference.of(() => exports.ParentNode),
        "TextStyle": autoguard.guards.Reference.of(() => exports.TextStyle),
        "TextNodeStyle": autoguard.guards.Reference.of(() => exports.TextNodeStyle),
        "TextNode": autoguard.guards.Reference.of(() => exports.TextNode),
        "BoxStyle": autoguard.guards.Reference.of(() => exports.BoxStyle),
        "BoxNodeStyle": autoguard.guards.Reference.of(() => exports.BoxNodeStyle),
        "BoxNode": autoguard.guards.Reference.of(() => exports.BoxNode),
        "Colors": autoguard.guards.Reference.of(() => exports.Colors),
        "Metadata": autoguard.guards.Reference.of(() => exports.Metadata),
        "Templates": autoguard.guards.Reference.of(() => exports.Templates),
        "Document": autoguard.guards.Reference.of(() => exports.Document)
    };
    Autoguard.Requests = {};
    Autoguard.Responses = {};
})(Autoguard = exports.Autoguard || (exports.Autoguard = {}));
;
