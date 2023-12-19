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

type Style<A extends keyof format.Templates> = Exclude<Required<format.Templates>[A][string], undefined>;

export class StyleHandler {
	protected templates: format.Templates;

	protected getStyle<A extends keyof format.Templates>(type: A, style: Style<A> | undefined, exclude: Array<string>): Style<A> | undefined {
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
		let templates = (this.templates[type] ?? {}) as Record<string, Style<A> | undefined>;
		let template_style = templates[template];
		if (template_style == null) {
			throw new MissingTemplateError(template, type);
		}
		return {
			...this.getStyle(type, template_style, [...exclude, template]),
			...style
		};
	}

	constructor(templates: format.Templates | undefined) {
		this.templates = templates ?? {};
	}

	getBoxStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("box", style, []);
	}

	getHorizontalStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("horizontal", style, []);
	}

	getTextStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("text", style, []);
	}

	getVerticalStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("vertical", style, []);
	}
};
