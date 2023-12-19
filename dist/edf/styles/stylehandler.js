"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleHandler = exports.MissingTemplateError = void 0;
class MissingTemplateError extends Error {
    template;
    type;
    constructor(template, type) {
        super();
        this.template = template;
        this.type = type;
    }
    toString() {
        return `Expected template "${this.template}" to be a exist for type "${this.type}"!`;
    }
}
exports.MissingTemplateError = MissingTemplateError;
;
class StyleHandler {
    templates;
    getStyle(type, style) {
        if (style == null) {
            return;
        }
        let template = style.template;
        if (template == null) {
            return style;
        }
        let templates = (this.templates[type] ?? {});
        let template_style = templates[template];
        if (template_style == null) {
            throw new MissingTemplateError(template, type);
        }
        return {
            ...this.getStyle(type, template_style),
            ...style
        };
    }
    constructor(templates) {
        this.templates = templates ?? {};
    }
    getBoxStyle(style) {
        return this.getStyle("box", style);
    }
    getHorizontalStyle(style) {
        return this.getStyle("horizontal", style);
    }
    getTextStyle(style) {
        return this.getStyle("text", style);
    }
    getVerticalStyle(style) {
        return this.getStyle("vertical", style);
    }
}
exports.StyleHandler = StyleHandler;
;
