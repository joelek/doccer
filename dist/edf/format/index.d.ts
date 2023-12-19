import * as autoguard from "@joelek/ts-autoguard/dist/lib-shared";
export declare const Base64: autoguard.serialization.MessageGuard<Base64>;
export type Base64 = autoguard.guards.String;
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
export declare const Length: autoguard.serialization.MessageGuard<Length>;
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
    "w": autoguard.guards.Reference<NonNegativeNumber>;
    "h": autoguard.guards.Reference<NonNegativeNumber>;
}, {}>;
export declare const Style: autoguard.serialization.MessageGuard<Style>;
export type Style = autoguard.guards.Object<{}, {
    "extends": autoguard.guards.String;
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
    autoguard.guards.Object<{
        "children": autoguard.guards.Array<autoguard.guards.Reference<Node>>;
    }, {}>
]>;
export declare const TextStyle: autoguard.serialization.MessageGuard<TextStyle>;
export type TextStyle = autoguard.guards.Object<{}, {
    "color": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"transparent">,
        autoguard.guards.Reference<Color>
    ]>;
    "columns": autoguard.guards.Reference<PositiveInteger>;
    "font_size": autoguard.guards.Reference<NonNegativeNumber>;
    "gutter": autoguard.guards.Reference<Length>;
    "letter_spacing": autoguard.guards.Reference<NonNegativeNumber>;
    "line_anchor": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"meanline">,
        autoguard.guards.StringLiteral<"capline">,
        autoguard.guards.StringLiteral<"topline">,
        autoguard.guards.StringLiteral<"bottomline">,
        autoguard.guards.StringLiteral<"baseline">
    ]>;
    "line_height": autoguard.guards.Reference<NonNegativeNumber>;
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
    "word_spacing": autoguard.guards.Reference<NonNegativeNumber>;
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
        "font": autoguard.guards.String;
    }, {
        "style": autoguard.guards.Reference<TextNodeStyle>;
    }>
]>;
export declare const BoxStyle: autoguard.serialization.MessageGuard<BoxStyle>;
export type BoxStyle = autoguard.guards.Object<{}, {
    "background_color": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"transparent">,
        autoguard.guards.Reference<Color>
    ]>;
    "border_color": autoguard.guards.Union<[
        autoguard.guards.StringLiteral<"transparent">,
        autoguard.guards.Reference<Color>
    ]>;
    "border_radius": autoguard.guards.Reference<Length>;
    "border_width": autoguard.guards.Reference<Length>;
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
export declare const VerticalStyle: autoguard.serialization.MessageGuard<VerticalStyle>;
export type VerticalStyle = autoguard.guards.Object<{}, {
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
    "gap": autoguard.guards.Reference<Length>;
}>;
export declare const VerticalNodeStyle: autoguard.serialization.MessageGuard<VerticalNodeStyle>;
export type VerticalNodeStyle = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Style>,
    autoguard.guards.Reference<NodeStyle>,
    autoguard.guards.Reference<VerticalStyle>
]>;
export declare const VerticalNode: autoguard.serialization.MessageGuard<VerticalNode>;
export type VerticalNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ParentNode>,
    autoguard.guards.Object<{
        "type": autoguard.guards.StringLiteral<"vertical">;
    }, {
        "style": autoguard.guards.Reference<VerticalNodeStyle>;
    }>
]>;
export declare const HorizontalStyle: autoguard.serialization.MessageGuard<HorizontalStyle>;
export type HorizontalStyle = autoguard.guards.Object<{}, {
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
    "gap": autoguard.guards.Reference<Length>;
}>;
export declare const HorizontalNodeStyle: autoguard.serialization.MessageGuard<HorizontalNodeStyle>;
export type HorizontalNodeStyle = autoguard.guards.Intersection<[
    autoguard.guards.Reference<Style>,
    autoguard.guards.Reference<NodeStyle>,
    autoguard.guards.Reference<HorizontalStyle>
]>;
export declare const HorizontalNode: autoguard.serialization.MessageGuard<HorizontalNode>;
export type HorizontalNode = autoguard.guards.Intersection<[
    autoguard.guards.Reference<ParentNode>,
    autoguard.guards.Object<{
        "type": autoguard.guards.StringLiteral<"horizontal">;
    }, {
        "style": autoguard.guards.Reference<HorizontalNodeStyle>;
    }>
]>;
export declare const Styles: autoguard.serialization.MessageGuard<Styles>;
export type Styles = autoguard.guards.Object<{}, {
    "box": autoguard.guards.Record<autoguard.guards.Reference<BoxNodeStyle>>;
    "horizontal": autoguard.guards.Record<autoguard.guards.Reference<HorizontalNodeStyle>>;
    "text": autoguard.guards.Record<autoguard.guards.Reference<TextNodeStyle>>;
    "vertical": autoguard.guards.Record<autoguard.guards.Reference<VerticalNodeStyle>>;
}>;
export declare const Document: autoguard.serialization.MessageGuard<Document>;
export type Document = autoguard.guards.Object<{
    "content": autoguard.guards.Reference<Node>;
    "size": autoguard.guards.Reference<Size>;
}, {
    "files": autoguard.guards.Record<autoguard.guards.Reference<Base64>>;
    "fonts": autoguard.guards.Record<autoguard.guards.String>;
    "styles": autoguard.guards.Reference<Styles>;
}>;
export declare namespace Autoguard {
    const Guards: {
        Base64: autoguard.guards.ReferenceGuard<string>;
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
        Length: autoguard.guards.ReferenceGuard<number | [number] | [number, "%"]>;
        NodeLength: autoguard.guards.ReferenceGuard<number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic">;
        Size: autoguard.guards.ReferenceGuard<{
            w: number;
            h: number;
        }>;
        Style: autoguard.guards.ReferenceGuard<{
            extends?: string | undefined;
        }>;
        NodeStyle: autoguard.guards.ReferenceGuard<{
            height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
        }>;
        Node: autoguard.guards.ReferenceGuard<{
            type: string;
        }>;
        ChildNode: autoguard.guards.ReferenceGuard<{
            type: string;
        }>;
        ParentNode: autoguard.guards.ReferenceGuard<{
            type: string;
            children: autoguard.guards.Array<{
                type: string;
            }>;
        }>;
        TextStyle: autoguard.guards.ReferenceGuard<{
            color?: {
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
            } | "transparent" | undefined;
            columns?: number | undefined;
            font_size?: number | undefined;
            gutter?: number | [number] | [number, "%"] | undefined;
            letter_spacing?: number | undefined;
            line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
            line_height?: number | undefined;
            orphans?: number | undefined;
            text_align?: "end" | "start" | "center" | undefined;
            text_transform?: "none" | "lowercase" | "uppercase" | undefined;
            white_space?: "wrap" | "nowrap" | undefined;
            word_spacing?: number | undefined;
        }>;
        TextNodeStyle: autoguard.guards.ReferenceGuard<{
            extends?: string | undefined;
            height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            color?: {
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
            } | "transparent" | undefined;
            columns?: number | undefined;
            font_size?: number | undefined;
            gutter?: number | [number] | [number, "%"] | undefined;
            letter_spacing?: number | undefined;
            line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
            line_height?: number | undefined;
            orphans?: number | undefined;
            text_align?: "end" | "start" | "center" | undefined;
            text_transform?: "none" | "lowercase" | "uppercase" | undefined;
            white_space?: "wrap" | "nowrap" | undefined;
            word_spacing?: number | undefined;
        }>;
        TextNode: autoguard.guards.ReferenceGuard<{
            type: "text";
            content: string;
            font: string;
            style?: {
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                color?: {
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
                } | "transparent" | undefined;
                columns?: number | undefined;
                font_size?: number | undefined;
                gutter?: number | [number] | [number, "%"] | undefined;
                letter_spacing?: number | undefined;
                line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
                line_height?: number | undefined;
                orphans?: number | undefined;
                text_align?: "end" | "start" | "center" | undefined;
                text_transform?: "none" | "lowercase" | "uppercase" | undefined;
                white_space?: "wrap" | "nowrap" | undefined;
                word_spacing?: number | undefined;
            } | undefined;
        }>;
        BoxStyle: autoguard.guards.ReferenceGuard<{
            background_color?: {
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
            } | "transparent" | undefined;
            border_color?: {
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
            } | "transparent" | undefined;
            border_radius?: number | [number] | [number, "%"] | undefined;
            border_width?: number | [number] | [number, "%"] | undefined;
            padding?: number | [number] | [number, "%"] | undefined;
        }>;
        BoxNodeStyle: autoguard.guards.ReferenceGuard<{
            extends?: string | undefined;
            height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            background_color?: {
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
            } | "transparent" | undefined;
            border_color?: {
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
            } | "transparent" | undefined;
            border_radius?: number | [number] | [number, "%"] | undefined;
            border_width?: number | [number] | [number, "%"] | undefined;
            padding?: number | [number] | [number, "%"] | undefined;
        }>;
        BoxNode: autoguard.guards.ReferenceGuard<{
            type: "box";
            children: autoguard.guards.Array<{
                type: string;
            }>;
            style?: {
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                background_color?: {
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
                } | "transparent" | undefined;
                border_color?: {
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
                } | "transparent" | undefined;
                border_radius?: number | [number] | [number, "%"] | undefined;
                border_width?: number | [number] | [number, "%"] | undefined;
                padding?: number | [number] | [number, "%"] | undefined;
            } | undefined;
        }>;
        VerticalStyle: autoguard.guards.ReferenceGuard<{
            align_x?: "center" | "left" | "right" | undefined;
            align_y?: "top" | "middle" | "bottom" | undefined;
            gap?: number | [number] | [number, "%"] | undefined;
        }>;
        VerticalNodeStyle: autoguard.guards.ReferenceGuard<{
            extends?: string | undefined;
            height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            align_x?: "center" | "left" | "right" | undefined;
            align_y?: "top" | "middle" | "bottom" | undefined;
            gap?: number | [number] | [number, "%"] | undefined;
        }>;
        VerticalNode: autoguard.guards.ReferenceGuard<{
            type: "vertical";
            children: autoguard.guards.Array<{
                type: string;
            }>;
            style?: {
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                align_x?: "center" | "left" | "right" | undefined;
                align_y?: "top" | "middle" | "bottom" | undefined;
                gap?: number | [number] | [number, "%"] | undefined;
            } | undefined;
        }>;
        HorizontalStyle: autoguard.guards.ReferenceGuard<{
            align_x?: "center" | "left" | "right" | undefined;
            align_y?: "top" | "middle" | "bottom" | undefined;
            gap?: number | [number] | [number, "%"] | undefined;
        }>;
        HorizontalNodeStyle: autoguard.guards.ReferenceGuard<{
            extends?: string | undefined;
            height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            overflow?: "hidden" | "visible" | undefined;
            segmentation?: "auto" | "none" | undefined;
            width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
            align_x?: "center" | "left" | "right" | undefined;
            align_y?: "top" | "middle" | "bottom" | undefined;
            gap?: number | [number] | [number, "%"] | undefined;
        }>;
        HorizontalNode: autoguard.guards.ReferenceGuard<{
            type: "horizontal";
            children: autoguard.guards.Array<{
                type: string;
            }>;
            style?: {
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                align_x?: "center" | "left" | "right" | undefined;
                align_y?: "top" | "middle" | "bottom" | undefined;
                gap?: number | [number] | [number, "%"] | undefined;
            } | undefined;
        }>;
        Styles: autoguard.guards.ReferenceGuard<{
            box?: autoguard.guards.Record<{
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                background_color?: {
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
                } | "transparent" | undefined;
                border_color?: {
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
                } | "transparent" | undefined;
                border_radius?: number | [number] | [number, "%"] | undefined;
                border_width?: number | [number] | [number, "%"] | undefined;
                padding?: number | [number] | [number, "%"] | undefined;
            }> | undefined;
            horizontal?: autoguard.guards.Record<{
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                align_x?: "center" | "left" | "right" | undefined;
                align_y?: "top" | "middle" | "bottom" | undefined;
                gap?: number | [number] | [number, "%"] | undefined;
            }> | undefined;
            text?: autoguard.guards.Record<{
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                color?: {
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
                } | "transparent" | undefined;
                columns?: number | undefined;
                font_size?: number | undefined;
                gutter?: number | [number] | [number, "%"] | undefined;
                letter_spacing?: number | undefined;
                line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
                line_height?: number | undefined;
                orphans?: number | undefined;
                text_align?: "end" | "start" | "center" | undefined;
                text_transform?: "none" | "lowercase" | "uppercase" | undefined;
                white_space?: "wrap" | "nowrap" | undefined;
                word_spacing?: number | undefined;
            }> | undefined;
            vertical?: autoguard.guards.Record<{
                extends?: string | undefined;
                height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                overflow?: "hidden" | "visible" | undefined;
                segmentation?: "auto" | "none" | undefined;
                width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                align_x?: "center" | "left" | "right" | undefined;
                align_y?: "top" | "middle" | "bottom" | undefined;
                gap?: number | [number] | [number, "%"] | undefined;
            }> | undefined;
        }>;
        Document: autoguard.guards.ReferenceGuard<{
            content: {
                type: string;
            };
            size: {
                w: number;
                h: number;
            };
            files?: autoguard.guards.Record<string> | undefined;
            fonts?: autoguard.guards.Record<string> | undefined;
            styles?: {
                box?: autoguard.guards.Record<{
                    extends?: string | undefined;
                    height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    background_color?: {
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
                    } | "transparent" | undefined;
                    border_color?: {
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
                    } | "transparent" | undefined;
                    border_radius?: number | [number] | [number, "%"] | undefined;
                    border_width?: number | [number] | [number, "%"] | undefined;
                    padding?: number | [number] | [number, "%"] | undefined;
                }> | undefined;
                horizontal?: autoguard.guards.Record<{
                    extends?: string | undefined;
                    height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    align_x?: "center" | "left" | "right" | undefined;
                    align_y?: "top" | "middle" | "bottom" | undefined;
                    gap?: number | [number] | [number, "%"] | undefined;
                }> | undefined;
                text?: autoguard.guards.Record<{
                    extends?: string | undefined;
                    height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    color?: {
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
                    } | "transparent" | undefined;
                    columns?: number | undefined;
                    font_size?: number | undefined;
                    gutter?: number | [number] | [number, "%"] | undefined;
                    letter_spacing?: number | undefined;
                    line_anchor?: "meanline" | "capline" | "topline" | "bottomline" | "baseline" | undefined;
                    line_height?: number | undefined;
                    orphans?: number | undefined;
                    text_align?: "end" | "start" | "center" | undefined;
                    text_transform?: "none" | "lowercase" | "uppercase" | undefined;
                    white_space?: "wrap" | "nowrap" | undefined;
                    word_spacing?: number | undefined;
                }> | undefined;
                vertical?: autoguard.guards.Record<{
                    extends?: string | undefined;
                    height?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    overflow?: "hidden" | "visible" | undefined;
                    segmentation?: "auto" | "none" | undefined;
                    width?: number | [number] | [number, "%"] | [number, "fr"] | "intrinsic" | "extrinsic" | undefined;
                    align_x?: "center" | "left" | "right" | undefined;
                    align_y?: "top" | "middle" | "bottom" | undefined;
                    gap?: number | [number] | [number, "%"] | undefined;
                }> | undefined;
            } | undefined;
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
