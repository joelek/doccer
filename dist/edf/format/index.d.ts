import * as autoguard from "@joelek/autoguard/dist/lib-shared";
export declare const PaddedBase64URL: autoguard.serialization.MessageGuard<PaddedBase64URL>;
export type PaddedBase64URL = autoguard.guards.String;
export declare const NonNegativeNumber: autoguard.serialization.MessageGuard<NonNegativeNumber>;
export type NonNegativeNumber = autoguard.guards.Number;
export declare const PositiveInteger: autoguard.serialization.MessageGuard<PositiveInteger>;
export type PositiveInteger = autoguard.guards.Integer;
export declare const ColorComponent: autoguard.serialization.MessageGuard<ColorComponent>;
export type ColorComponent = autoguard.guards.Number;
export declare const GrayscaleColor: autoguard.serialization.MessageGuard<GrayscaleColor>;
export type GrayscaleColor = autoguard.guards.Object<{
    "i": autoguard.guards.Reference<ColorComponent>;
}, {}>;
export declare const RGBColor: autoguard.serialization.MessageGuard<RGBColor>;
export type RGBColor = autoguard.guards.Object<{
    "r": autoguard.guards.Reference<ColorComponent>;
    "g": autoguard.guards.Reference<ColorComponent>;
    "b": autoguard.guards.Reference<ColorComponent>;
}, {}>;
export declare const CMYKColor: autoguard.serialization.MessageGuard<CMYKColor>;
export type CMYKColor = autoguard.guards.Object<{
    "c": autoguard.guards.Reference<ColorComponent>;
    "m": autoguard.guards.Reference<ColorComponent>;
    "y": autoguard.guards.Reference<ColorComponent>;
    "k": autoguard.guards.Reference<ColorComponent>;
}, {}>;
export declare const Color: autoguard.serialization.MessageGuard<Color>;
export type Color = autoguard.guards.Union<[
    autoguard.guards.Reference<GrayscaleColor>,
    autoguard.guards.Reference<RGBColor>,
    autoguard.guards.Reference<CMYKColor>
]>;
export declare const UnitlessLength: autoguard.serialization.MessageGuard<UnitlessLength>;
export type UnitlessLength = autoguard.guards.Reference<NonNegativeNumber>;
export declare const AbsoluteUnit: autoguard.serialization.MessageGuard<AbsoluteUnit>;
export type AbsoluteUnit = autoguard.guards.Union<[
    autoguard.guards.StringLiteral<"pt">,
    autoguard.guards.StringLiteral<"in">,
    autoguard.guards.StringLiteral<"pc">,
    autoguard.guards.StringLiteral<"mm">,
    autoguard.guards.StringLiteral<"cm">,
    autoguard.guards.StringLiteral<"px">
]>;
export declare const AbsoluteLength: autoguard.serialization.MessageGuard<AbsoluteLength>;
export type AbsoluteLength = autoguard.guards.Union<[
    autoguard.guards.Reference<UnitlessLength>,
    autoguard.guards.Tuple<[
        autoguard.guards.Reference<NonNegativeNumber>,
        autoguard.guards.Reference<AbsoluteUnit>
    ]>
]>;
export declare const RelativeUnit: autoguard.serialization.MessageGuard<RelativeUnit>;
export type RelativeUnit = autoguard.guards.StringLiteral<"%">;
export declare const RelativeLength: autoguard.serialization.MessageGuard<RelativeLength>;
export type RelativeLength = autoguard.guards.Union<[
    autoguard.guards.Reference<UnitlessLength>,
    autoguard.guards.Tuple<[
        autoguard.guards.Reference<NonNegativeNumber>,
        autoguard.guards.Reference<RelativeUnit>
    ]>
]>;
export declare const Length: autoguard.serialization.MessageGuard<Length>;
export type Length = autoguard.guards.Union<[
    autoguard.guards.Reference<UnitlessLength>,
    autoguard.guards.Reference<AbsoluteLength>,
    autoguard.guards.Reference<RelativeLength>
]>;
export declare const NodeLength: autoguard.serialization.MessageGuard<NodeLength>;
export type NodeLength = autoguard.guards.Union<[
    autoguard.guards.Reference<Length>,
    autoguard.guards.Tuple<[
        autoguard.guards.Reference<NonNegativeNumber>,
        autoguard.guards.StringLiteral<"fr">
    ]>,
    autoguard.guards.StringLiteral<"intrinsic">,
    autoguard.guards.StringLiteral<"extrinsic">
]>;
export declare const Size: autoguard.serialization.MessageGuard<Size>;
export type Size = autoguard.guards.Object<{
    "w": autoguard.guards.Reference<AbsoluteLength>;
    "h": autoguard.guards.Reference<AbsoluteLength>;
}, {}>;
export declare const Style: autoguard.serialization.MessageGuard<Style>;
export type Style = autoguard.guards.Object<{}, {
    "template": autoguard.guards.String;
}>;
export declare const NodeStyle: autoguard.serialization.MessageGuard<NodeStyle>;
export type NodeStyle = autoguard.guards.Object<{}, {
    "height": autoguard.guards.Reference<NodeLength>;
    "overflow": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"hidden">,
        autoguard.guards.StringLiteral<"visible">
    ]>;
    "segmentation": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"auto">,
        autoguard.guards.StringLiteral<"none">
    ]>;
    "segmentation_threshold": autoguard.guards.Number;
    "width": autoguard.guards.Reference<NodeLength>;
}>;
export declare const Node: autoguard.serialization.MessageGuard<Node>;
export type Node = autoguard.guards.Object<{
    "type": autoguard.guards.String;
}, {}>;
export declare const ChildNode: autoguard.serialization.MessageGuard<ChildNode>;
export type ChildNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Node>,
    autoguard.guards.Object<{}, {}>
]>;
export declare const ParentNode: autoguard.serialization.MessageGuard<ParentNode>;
export type ParentNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ChildNode>,
    autoguard.guards.Object<{}, {
        "children": autoguard.guards.Array<autoguard.guards.Reference<Node>>;
    }>
]>;
export declare const ImageStyle: autoguard.serialization.MessageGuard<ImageStyle>;
export type ImageStyle = autoguard.guards.Object<{}, {
    "image": autoguard.guards.String;
    "fit": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"fill">,
        autoguard.guards.StringLiteral<"cover">,
        autoguard.guards.StringLiteral<"contain">
    ]>;
    "dpi": autoguard.guards.Integer;
}>;
export declare const ImageNodeStyle: autoguard.serialization.MessageGuard<ImageNodeStyle>;
export type ImageNodeStyle = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Style>,
    autoguard.guards.Reference<NodeStyle>,
    autoguard.guards.Reference<ImageStyle>
]>;
export declare const ImageNode: autoguard.serialization.MessageGuard<ImageNode>;
export type ImageNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ChildNode>,
    autoguard.guards.Object<{
        "type": autoguard.guards.StringLiteral<"image">;
    }, {
        "style": autoguard.guards.Reference<ImageNodeStyle>;
    }>
]>;
export declare const TextStyle: autoguard.serialization.MessageGuard<TextStyle>;
export type TextStyle = autoguard.guards.Object<{}, {
    "color": autoguard.guards.Union<[
        autoguard.guards.String,
        autoguard.guards.StringLiteral<"transparent">,
        autoguard.guards.Reference<Color>
    ]>;
    "columns": autoguard.guards.Reference<PositiveInteger>;
    "font": autoguard.guards.String;
    "font_size": autoguard.guards.Reference<AbsoluteLength>;
    "gutter": autoguard.guards.Reference<Length>;
    "letter_spacing": autoguard.guards.Reference<AbsoluteLength>;
    "line_anchor": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"meanline">,
        autoguard.guards.StringLiteral<"capline">,
        autoguard.guards.StringLiteral<"topline">,
        autoguard.guards.StringLiteral<"bottomline">,
        autoguard.guards.StringLiteral<"baseline">
    ]>;
    "line_height": autoguard.guards.Reference<AbsoluteLength>;
    "orphans": autoguard.guards.Reference<PositiveInteger>;
    "text_align": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"start">,
        autoguard.guards.StringLiteral<"center">,
        autoguard.guards.StringLiteral<"end">
    ]>;
    "text_transform": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"none">,
        autoguard.guards.StringLiteral<"lowercase">,
        autoguard.guards.StringLiteral<"uppercase">
    ]>;
    "white_space": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"wrap">,
        autoguard.guards.StringLiteral<"nowrap">
    ]>;
    "word_spacing": autoguard.guards.Reference<AbsoluteLength>;
}>;
export declare const TextNodeStyle: autoguard.serialization.MessageGuard<TextNodeStyle>;
export type TextNodeStyle = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Style>,
    autoguard.guards.Reference<NodeStyle>,
    autoguard.guards.Reference<TextStyle>
]>;
export declare const TextNode: autoguard.serialization.MessageGuard<TextNode>;
export type TextNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ChildNode>,
    autoguard.guards.Object<{
        "type": autoguard.guards.StringLiteral<"text">;
        "content": autoguard.guards.String;
    }, {
        "style": autoguard.guards.Reference<TextNodeStyle>;
    }>
]>;
export declare const BoxStyle: autoguard.serialization.MessageGuard<BoxStyle>;
export type BoxStyle = autoguard.guards.Object<{}, {
    "align_x": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"left">,
        autoguard.guards.StringLiteral<"center">,
        autoguard.guards.StringLiteral<"right">
    ]>;
    "align_y": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"top">,
        autoguard.guards.StringLiteral<"middle">,
        autoguard.guards.StringLiteral<"bottom">
    ]>;
    "background_color": autoguard.guards.Union<[
        autoguard.guards.String,
        autoguard.guards.StringLiteral<"transparent">,
        autoguard.guards.Reference<Color>
    ]>;
    "border_color": autoguard.guards.Union<[
        autoguard.guards.String,
        autoguard.guards.StringLiteral<"transparent">,
        autoguard.guards.Reference<Color>
    ]>;
    "border_radius": autoguard.guards.Reference<Length>;
    "border_width": autoguard.guards.Reference<Length>;
    "gap": autoguard.guards.Reference<Length>;
    "layout": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"vertical">,
        autoguard.guards.StringLiteral<"horizontal">
    ]>;
    "padding": autoguard.guards.Reference<Length>;
}>;
export declare const BoxNodeStyle: autoguard.serialization.MessageGuard<BoxNodeStyle>;
export type BoxNodeStyle = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Style>,
    autoguard.guards.Reference<NodeStyle>,
    autoguard.guards.Reference<BoxStyle>
]>;
export declare const BoxNode: autoguard.serialization.MessageGuard<BoxNode>;
export type BoxNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ParentNode>,
    autoguard.guards.Object<{
        "type": autoguard.guards.StringLiteral<"box">;
    }, {
        "style": autoguard.guards.Reference<BoxNodeStyle>;
    }>
]>;
export declare const UnrecognizedStyle: autoguard.serialization.MessageGuard<UnrecognizedStyle>;
export type UnrecognizedStyle = autoguard.guards.Object<{}, {}>;
export declare const UnrecognizedNodeStyle: autoguard.serialization.MessageGuard<UnrecognizedNodeStyle>;
export type UnrecognizedNodeStyle = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Style>,
    autoguard.guards.Reference<NodeStyle>,
    autoguard.guards.Reference<UnrecognizedStyle>
]>;
export declare const UnrecognizedNode: autoguard.serialization.MessageGuard<UnrecognizedNode>;
export type UnrecognizedNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ParentNode>,
    autoguard.guards.Object<{
        "type": autoguard.guards.String;
    }, {
        "style": autoguard.guards.Reference<UnrecognizedNodeStyle>;
    }>
]>;
export declare const Colors: autoguard.serialization.MessageGuard<Colors>;
export type Colors = autoguard.guards.Record<autoguard.guards.Reference<Color>>;
export declare const Metadata: autoguard.serialization.MessageGuard<Metadata>;
export type Metadata = autoguard.guards.Object<{}, {
    "title": autoguard.guards.String;
    "author": autoguard.guards.String;
}>;
export declare const Templates: autoguard.serialization.MessageGuard<Templates>;
export type Templates = autoguard.guards.Object<{}, {
    "box": autoguard.guards.Record<autoguard.guards.Reference<BoxNodeStyle>>;
    "image": autoguard.guards.Record<autoguard.guards.Reference<ImageNodeStyle>>;
    "text": autoguard.guards.Record<autoguard.guards.Reference<TextNodeStyle>>;
}>;
export declare const Document: autoguard.serialization.MessageGuard<Document>;
export type Document = autoguard.guards.Object<{
    "content": autoguard.guards.Reference<Node>;
    "size": autoguard.guards.Reference<Size>;
}, {
    "colors": autoguard.guards.Reference<Colors>;
    "files": autoguard.guards.Record<autoguard.guards.Reference<PaddedBase64URL>>;
    "font": autoguard.guards.String;
    "fonts": autoguard.guards.Record<autoguard.guards.String>;
    "images": autoguard.guards.Record<autoguard.guards.String>;
    "metadata": autoguard.guards.Reference<Metadata>;
    "templates": autoguard.guards.Reference<Templates>;
    "unit": autoguard.guards.Reference<AbsoluteUnit>;
}>;
export declare namespace Autoguard {
    const Guards: {
        PaddedBase64URL: autoguard.guards.ReferenceGuard<string>;
        NonNegativeNumber: autoguard.guards.ReferenceGuard<number>;
        PositiveInteger: autoguard.guards.ReferenceGuard<number>;
        ColorComponent: autoguard.guards.ReferenceGuard<number>;
        GrayscaleColor: autoguard.guards.ReferenceGuard<{
            i: number;
        }>;
        RGBColor: autoguard.guards.ReferenceGuard<{
            r: number;
            g: number;
            b: number;
        }>;
        CMYKColor: autoguard.guards.ReferenceGuard<{
            c: number;
            m: number;
            y: number;
            k: number;
        }>;
        Color: autoguard.guards.ReferenceGuard<{
            i: number;
        } | {
            r: number;
            g: number;
            b: number;
        } | {
            c: number;
            m: number;
            y: number;
            k: number;
        }>;
        UnitlessLength: autoguard.guards.ReferenceGuard<number>;
        AbsoluteUnit: autoguard.guards.ReferenceGuard<"cm" | "pt" | "in" | "pc" | "mm" | "px">;
        AbsoluteLength: autoguard.guards.ReferenceGuard<number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"]>;
        RelativeUnit: autoguard.guards.ReferenceGuard<"%">;
        RelativeLength: autoguard.guards.ReferenceGuard<number | [number, "%"]>;
        Length: autoguard.guards.ReferenceGuard<number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"]>;
        NodeLength: autoguard.guards.ReferenceGuard<number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic">;
        Size: autoguard.guards.ReferenceGuard<{
            w: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"];
            h: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"];
        }>;
        Style: autoguard.guards.ReferenceGuard<{
            template?: string | undefined;
        }>;
        NodeStyle: autoguard.guards.ReferenceGuard<{
            height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            segmentation_threshold?: number | undefined;
            width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
        }>;
        Node: autoguard.guards.ReferenceGuard<{
            type: string;
        }>;
        ChildNode: autoguard.guards.ReferenceGuard<{
            type: string;
        }>;
        ParentNode: autoguard.guards.ReferenceGuard<{
            type: string;
            children?: autoguard.guards.Array<{
                type: string;
            }> | undefined;
        }>;
        ImageStyle: autoguard.guards.ReferenceGuard<{
            image?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
            dpi?: number | undefined;
        }>;
        ImageNodeStyle: autoguard.guards.ReferenceGuard<{
            template?: string | undefined;
            height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            segmentation_threshold?: number | undefined;
            width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            image?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
            dpi?: number | undefined;
        }>;
        ImageNode: autoguard.guards.ReferenceGuard<{
            type: "image";
            style?: {
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                image?: string | undefined;
                fit?: "fill" | "cover" | "contain" | undefined;
                dpi?: number | undefined;
            } | undefined;
        }>;
        TextStyle: autoguard.guards.ReferenceGuard<{
            color?: string | {
                i: number;
            } | {
                r: number;
                g: number;
                b: number;
            } | {
                c: number;
                m: number;
                y: number;
                k: number;
            } | undefined;
            columns?: number | undefined;
            font?: string | undefined;
            font_size?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            gutter?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            letter_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
            line_height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            orphans?: number | undefined;
            text_align?: "end" | "start" | "center" | undefined;
            text_transform?: "none" | "lowercase" | "uppercase" | undefined;
            white_space?: "wrap" | "nowrap" | undefined;
            word_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
        }>;
        TextNodeStyle: autoguard.guards.ReferenceGuard<{
            template?: string | undefined;
            height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            segmentation_threshold?: number | undefined;
            width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            color?: string | {
                i: number;
            } | {
                r: number;
                g: number;
                b: number;
            } | {
                c: number;
                m: number;
                y: number;
                k: number;
            } | undefined;
            columns?: number | undefined;
            font?: string | undefined;
            font_size?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            gutter?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            letter_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
            line_height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            orphans?: number | undefined;
            text_align?: "end" | "start" | "center" | undefined;
            text_transform?: "none" | "lowercase" | "uppercase" | undefined;
            white_space?: "wrap" | "nowrap" | undefined;
            word_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
        }>;
        TextNode: autoguard.guards.ReferenceGuard<{
            type: "text";
            content: string;
            style?: {
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                color?: string | {
                    i: number;
                } | {
                    r: number;
                    g: number;
                    b: number;
                } | {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                } | undefined;
                columns?: number | undefined;
                font?: string | undefined;
                font_size?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                gutter?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                letter_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
                line_height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                orphans?: number | undefined;
                text_align?: "end" | "start" | "center" | undefined;
                text_transform?: "none" | "lowercase" | "uppercase" | undefined;
                white_space?: "wrap" | "nowrap" | undefined;
                word_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            } | undefined;
        }>;
        BoxStyle: autoguard.guards.ReferenceGuard<{
            align_x?: "center" | "left" | "right" | undefined;
            align_y?: "top" | "middle" | "bottom" | undefined;
            background_color?: string | {
                i: number;
            } | {
                r: number;
                g: number;
                b: number;
            } | {
                c: number;
                m: number;
                y: number;
                k: number;
            } | undefined;
            border_color?: string | {
                i: number;
            } | {
                r: number;
                g: number;
                b: number;
            } | {
                c: number;
                m: number;
                y: number;
                k: number;
            } | undefined;
            border_radius?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            border_width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            gap?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            layout?: "vertical" | "horizontal" | undefined;
            padding?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
        }>;
        BoxNodeStyle: autoguard.guards.ReferenceGuard<{
            template?: string | undefined;
            height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            segmentation_threshold?: number | undefined;
            width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            align_x?: "center" | "left" | "right" | undefined;
            align_y?: "top" | "middle" | "bottom" | undefined;
            background_color?: string | {
                i: number;
            } | {
                r: number;
                g: number;
                b: number;
            } | {
                c: number;
                m: number;
                y: number;
                k: number;
            } | undefined;
            border_color?: string | {
                i: number;
            } | {
                r: number;
                g: number;
                b: number;
            } | {
                c: number;
                m: number;
                y: number;
                k: number;
            } | undefined;
            border_radius?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            border_width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            gap?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            layout?: "vertical" | "horizontal" | undefined;
            padding?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
        }>;
        BoxNode: autoguard.guards.ReferenceGuard<{
            type: "box";
            children?: autoguard.guards.Array<{
                type: string;
            }> | undefined;
            style?: {
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                align_x?: "center" | "left" | "right" | undefined;
                align_y?: "top" | "middle" | "bottom" | undefined;
                background_color?: string | {
                    i: number;
                } | {
                    r: number;
                    g: number;
                    b: number;
                } | {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                } | undefined;
                border_color?: string | {
                    i: number;
                } | {
                    r: number;
                    g: number;
                    b: number;
                } | {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                } | undefined;
                border_radius?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                border_width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                gap?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                layout?: "vertical" | "horizontal" | undefined;
                padding?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            } | undefined;
        }>;
        UnrecognizedStyle: autoguard.guards.ReferenceGuard<{}>;
        UnrecognizedNodeStyle: autoguard.guards.ReferenceGuard<{
            template?: string | undefined;
            height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            segmentation_threshold?: number | undefined;
            width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
        }>;
        UnrecognizedNode: autoguard.guards.ReferenceGuard<{
            type: string;
            children?: autoguard.guards.Array<{
                type: string;
            }> | undefined;
            style?: {
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            } | undefined;
        }>;
        Colors: autoguard.guards.ReferenceGuard<Colors>;
        Metadata: autoguard.guards.ReferenceGuard<{
            title?: string | undefined;
            author?: string | undefined;
        }>;
        Templates: autoguard.guards.ReferenceGuard<{
            box?: autoguard.guards.Record<{
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                align_x?: "center" | "left" | "right" | undefined;
                align_y?: "top" | "middle" | "bottom" | undefined;
                background_color?: string | {
                    i: number;
                } | {
                    r: number;
                    g: number;
                    b: number;
                } | {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                } | undefined;
                border_color?: string | {
                    i: number;
                } | {
                    r: number;
                    g: number;
                    b: number;
                } | {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                } | undefined;
                border_radius?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                border_width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                gap?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                layout?: "vertical" | "horizontal" | undefined;
                padding?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
            }> | undefined;
            image?: autoguard.guards.Record<{
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                image?: string | undefined;
                fit?: "fill" | "cover" | "contain" | undefined;
                dpi?: number | undefined;
            }> | undefined;
            text?: autoguard.guards.Record<{
                template?: string | undefined;
                height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                segmentation_threshold?: number | undefined;
                width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                color?: string | {
                    i: number;
                } | {
                    r: number;
                    g: number;
                    b: number;
                } | {
                    c: number;
                    m: number;
                    y: number;
                    k: number;
                } | undefined;
                columns?: number | undefined;
                font?: string | undefined;
                font_size?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                gutter?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                letter_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
                line_height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                orphans?: number | undefined;
                text_align?: "end" | "start" | "center" | undefined;
                text_transform?: "none" | "lowercase" | "uppercase" | undefined;
                white_space?: "wrap" | "nowrap" | undefined;
                word_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
            }> | undefined;
        }>;
        Document: autoguard.guards.ReferenceGuard<{
            content: {
                type: string;
            };
            size: {
                w: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"];
                h: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"];
            };
            colors?: Colors | undefined;
            files?: autoguard.guards.Record<string> | undefined;
            font?: string | undefined;
            fonts?: autoguard.guards.Record<string> | undefined;
            images?: autoguard.guards.Record<string> | undefined;
            metadata?: {
                title?: string | undefined;
                author?: string | undefined;
            } | undefined;
            templates?: {
                box?: autoguard.guards.Record<{
                    template?: string | undefined;
                    height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    segmentation_threshold?: number | undefined;
                    width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    align_x?: "center" | "left" | "right" | undefined;
                    align_y?: "top" | "middle" | "bottom" | undefined;
                    background_color?: string | {
                        i: number;
                    } | {
                        r: number;
                        g: number;
                        b: number;
                    } | {
                        c: number;
                        m: number;
                        y: number;
                        k: number;
                    } | undefined;
                    border_color?: string | {
                        i: number;
                    } | {
                        r: number;
                        g: number;
                        b: number;
                    } | {
                        c: number;
                        m: number;
                        y: number;
                        k: number;
                    } | undefined;
                    border_radius?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                    border_width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                    gap?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                    layout?: "vertical" | "horizontal" | undefined;
                    padding?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                }> | undefined;
                image?: autoguard.guards.Record<{
                    template?: string | undefined;
                    height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    segmentation_threshold?: number | undefined;
                    width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    image?: string | undefined;
                    fit?: "fill" | "cover" | "contain" | undefined;
                    dpi?: number | undefined;
                }> | undefined;
                text?: autoguard.guards.Record<{
                    template?: string | undefined;
                    height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    segmentation_threshold?: number | undefined;
                    width?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    color?: string | {
                        i: number;
                    } | {
                        r: number;
                        g: number;
                        b: number;
                    } | {
                        c: number;
                        m: number;
                        y: number;
                        k: number;
                    } | undefined;
                    columns?: number | undefined;
                    font?: string | undefined;
                    font_size?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                    gutter?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | [number, "%"] | undefined;
                    letter_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                    line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
                    line_height?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                    orphans?: number | undefined;
                    text_align?: "end" | "start" | "center" | undefined;
                    text_transform?: "none" | "lowercase" | "uppercase" | undefined;
                    white_space?: "wrap" | "nowrap" | undefined;
                    word_spacing?: number | [number, "cm" | "pt" | "in" | "pc" | "mm" | "px"] | undefined;
                }> | undefined;
            } | undefined;
            unit?: "cm" | "pt" | "in" | "pc" | "mm" | "px" | undefined;
        }>;
    };
    type Guards = {
        [A in keyof typeof Guards]: ReturnType<typeof Guards[A]["as"]>;
    };
    const Requests: {};
    type Requests = {
        [A in keyof typeof Requests]: ReturnType<typeof Requests[A]["as"]>;
    };
    const Responses: {};
    type Responses = {
        [A in keyof typeof Responses]: ReturnType<typeof Responses[A]["as"]>;
    };
}
