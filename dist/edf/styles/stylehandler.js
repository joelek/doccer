"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleHandler = exports.RecursiveTemplateError = exports.MissingTemplateError = void 0;
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
class StyleHandler {
    templates;
    getStyle(type, style, exclude) {
        if (style == null) {
            return;
        }
        let template = style.template;
        if (template == null) {
            return style;
        }
        if (exclude.includes(template)) {
            throw new RecursiveTemplateError(template, type);
        }
        let templates = (this.templates[type] ?? {});
        let template_style = templates[template];
        if (template_style == null) {
            throw new MissingTemplateError(template, type);
        }
        return {
            ...this.getStyle(type, template_style, [...exclude, template]),
            ...style
        };
    }
    constructor(templates) {
        this.templates = templates ?? {};
    }
    getBoxStyle(style) {
        return this.getStyle("box", style, []);
    }
    getHorizontalStyle(style) {
        return this.getStyle("horizontal", style, []);
    }
    getTextStyle(style) {
        return this.getStyle("text", style, []);
    }
    getVerticalStyle(style) {
        return this.getStyle("vertical", style, []);
    }
}
exports.StyleHandler = StyleHandler;
;
