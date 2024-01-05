"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleHandler = exports.MissingColorError = exports.RecursiveTemplateError = exports.MissingTemplateError = void 0;
const format = require("../format");
const layout_1 = require("../layout");
class MissingTemplateError extends Error {
    template;
    type;
    constructor(template, type) {
        super();
        this.template = template;
        this.type = type;
    }
    toString() {
        return `Expected template "${this.template}" for type "${this.type}" to exist!`;
    }
}
exports.MissingTemplateError = MissingTemplateError;
;
class RecursiveTemplateError extends Error {
    template;
    type;
    constructor(template, type) {
        super();
        this.template = template;
        this.type = type;
    }
    toString() {
        return `Expected template "${this.template}" for type "${this.type}" to not be used recursively!`;
    }
}
exports.RecursiveTemplateError = RecursiveTemplateError;
;
class MissingColorError extends Error {
    color;
    constructor(color) {
        super();
        this.color = color;
    }
    toString() {
        return `Expected color "${this.color}" to exist!`;
    }
}
exports.MissingColorError = MissingColorError;
;
class StyleHandler {
    templates;
    colors;
    default_unit;
    getStyle(type, style, exclude) {
        if (style == null) {
            return;
        }
        let template = style.template ?? "default";
        if (exclude.includes(template)) {
            if (template === "default") {
                return style;
            }
            else {
                throw new RecursiveTemplateError(template, type);
            }
        }
        let templates = (this.templates[type] ?? {});
        let template_style = templates[template];
        if (template_style == null) {
            if (template === "default") {
                return style;
            }
            else {
                throw new MissingTemplateError(template, type);
            }
        }
        return {
            ...this.getStyle(type, template_style, [...exclude, template]),
            ...style
        };
    }
    getColor(color) {
        if (color == null) {
            return;
        }
        if (typeof color === "string") {
            if (color === "transparent") {
                return "transparent";
            }
            let swatch_color = this.colors[color];
            if (swatch_color == null) {
                throw new MissingColorError(color);
            }
            return swatch_color;
        }
        return color;
    }
    getLength(length) {
        if (format.AbsoluteLength.is(length)) {
            return this.getAbsoluteLength(length);
        }
        else {
            return length;
        }
    }
    getAbsoluteLength(length) {
        if (length != null) {
            return layout_1.AbsoluteLength.getComputedLength(length, this.default_unit);
        }
        else {
            return length;
        }
    }
    constructor(templates, colors, default_unit) {
        this.templates = templates ?? {};
        this.colors = colors ?? {};
        this.default_unit = default_unit;
    }
    getBoxStyle(style) {
        style = this.getStyle("box", style, []) ?? {};
        return {
            ...style,
            background_color: this.getColor(style.background_color),
            border_color: this.getColor(style.border_color),
            border_radius: this.getLength(style.border_radius),
            border_width: this.getLength(style.border_width),
            gap: this.getLength(style.gap),
            padding: this.getLength(style.padding)
        };
    }
    getTextStyle(style) {
        style = this.getStyle("text", style, []) ?? {};
        return {
            ...style,
            color: this.getColor(style.color),
            font_size: this.getAbsoluteLength(style.font_size),
            letter_spacing: this.getAbsoluteLength(style.letter_spacing),
            line_height: this.getAbsoluteLength(style.line_height),
            word_spacing: this.getAbsoluteLength(style.word_spacing)
        };
    }
}
exports.StyleHandler = StyleHandler;
;
