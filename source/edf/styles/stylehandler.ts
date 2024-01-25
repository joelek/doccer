import * as format from "../format";
import { AbsoluteLength } from "../layout";

export class MissingTemplateError extends Error {
	protected template: string;
	protected type: string;

	constructor(template: string, type: string) {
		super();
		this.template = template;
		this.type = type;
	}

	toString(): string {
		return `Expected template "${this.template}" for type "${this.type}" to exist!`;
	}
};

export class RecursiveTemplateError extends Error {
	protected template: string;
	protected type: string;

	constructor(template: string, type: string) {
		super();
		this.template = template;
		this.type = type;
	}

	toString(): string {
		return `Expected template "${this.template}" for type "${this.type}" to not be used recursively!`;
	}
};

export class MissingColorError extends Error {
	protected color: string;

	constructor(color: string) {
		super();
		this.color = color;
	}

	toString(): string {
		return `Expected color "${this.color}" to exist!`;
	}
};

type Style<A extends keyof format.Templates> = Exclude<Required<format.Templates>[A][string], undefined>;

export class StyleHandler {
	protected templates: format.Templates;
	protected colors: format.Colors;
	protected default_unit: format.AbsoluteUnit | undefined;

	protected getStyle<A extends keyof format.Templates>(type: A, style: Style<A> | undefined, exclude: Array<string>): Style<A> | undefined {
		if (style == null) {
			return;
		}
		let template = style.template ?? "default";
		if (exclude.includes(template)) {
			if (template === "default") {
				return style;
			} else {
				throw new RecursiveTemplateError(template, type);
			}
		}
		let templates = (this.templates[type] ?? {}) as Record<string, Style<A> | undefined>;
		let template_style = templates[template];
		if (template_style == null) {
			if (template === "default") {
				return style;
			} else {
				throw new MissingTemplateError(template, type);
			}
		}
		return {
			...this.getStyle(type, template_style, [...exclude, template]),
			...style
		};
	}

	protected getColor(color: string | "transparent" | format.Color | undefined): "transparent" | format.Color | undefined {
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

	protected getNodeLength(length: format.NodeLength | undefined): format.NodeLength | undefined {
		if (format.Length.is(length)) {
			return this.getLength(length);
		} else {
			return length;
		}
	}

	protected getLength(length: format.Length | undefined): format.Length | undefined {
		if (format.AbsoluteLength.is(length)) {
			return this.getAbsoluteLength(length);
		} else {
			return length;
		}
	}

	protected getAbsoluteLength(length: format.AbsoluteLength | undefined): format.AbsoluteLength | undefined {
		if (length != null) {
			return AbsoluteLength.getComputedLength(length, this.default_unit);
		} else {
			return length;
		}
	}

	constructor(templates: format.Templates | undefined, colors: format.Colors | undefined, default_unit: format.AbsoluteUnit | undefined) {
		this.templates = templates ?? {};
		this.colors = colors ?? {};
		this.default_unit = default_unit;
	}

	getBoxStyle(style: format.BoxNodeStyle | undefined): format.BoxNodeStyle | undefined {
		style = this.getStyle("box", style, []) ?? {};
		return {
			...style,
			height: this.getNodeLength(style.height),
			width: this.getNodeLength(style.width),
			background_color: this.getColor(style.background_color),
			border_color: this.getColor(style.border_color),
			border_radius: this.getLength(style.border_radius),
			border_width: this.getLength(style.border_width),
			gap: this.getLength(style.gap),
			padding: this.getLength(style.padding)
		};
	}

	getImageStyle(style: format.ImageNodeStyle | undefined): format.ImageNodeStyle | undefined {
		style = this.getStyle("image", style, []) ?? {};
		return {
			...style,
			height: this.getNodeLength(style.height),
			width: this.getNodeLength(style.width),
		};
	}

	getTextStyle(style: format.TextNodeStyle | undefined): format.TextNodeStyle | undefined {
		style = this.getStyle("text", style, []) ?? {};
		return {
			...style,
			height: this.getNodeLength(style.height),
			width: this.getNodeLength(style.width),
			color: this.getColor(style.color),
			font_size: this.getAbsoluteLength(style.font_size),
			letter_spacing: this.getAbsoluteLength(style.letter_spacing),
			line_height: this.getAbsoluteLength(style.line_height),
			word_spacing: this.getAbsoluteLength(style.word_spacing)
		};
	}

	getUnrecognizedStyle(style: format.UnrecognizedNodeStyle | undefined, type: string): format.UnrecognizedNodeStyle | undefined {
		style = this.getStyle(type as keyof format.Templates, style, []) ?? {};
		return {
			...style,
			height: this.getNodeLength(style.height),
			width: this.getNodeLength(style.width)
		};
	}
};
