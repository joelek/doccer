import * as format from "../format";

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

	protected getColor(color?: string | "transparent" | format.Color): "transparent" | format.Color | undefined {
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

	constructor(templates: format.Templates | undefined, colors: format.Colors | undefined) {
		this.templates = templates ?? {};
		this.colors = colors ?? {};
	}

	getBoxStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		style = this.getStyle("box", style, []);
		return {
			...style,
			background_color: this.getColor(style?.background_color),
			border_color: this.getColor(style?.border_color)
		};
	}

	getTextStyle(style?: format.TextNodeStyle): format.TextNodeStyle | undefined {
		style = this.getStyle("text", style, []);
		return {
			...style,
			color: this.getColor(style?.color)
		};
	}
};
