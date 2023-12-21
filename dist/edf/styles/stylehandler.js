"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleHandler = exports.MissingColorError = exports.RecursiveTemplateError = exports.MissingTemplateError = void 0;
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
    constructor(templates, colors) {
        this.templates = templates ?? {};
        this.colors = colors ?? {};
    }
    getBoxStyle(style) {
        style = this.getStyle("box", style, []);
        return {
            ...style,
            background_color: this.getColor(style?.background_color),
            border_color: this.getColor(style?.border_color)
        };
    }
    getTextStyle(style) {
        style = this.getStyle("text", style, []);
        return {
            ...style,
            color: this.getColor(style?.color)
        };
    }
}
exports.StyleHandler = StyleHandler;
;
