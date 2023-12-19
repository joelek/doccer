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
		return `Expected template "${this.template}" to be a exist for type "${this.type}"!`;
	}
};

type Style<A extends keyof format.Templates> = Exclude<Required<format.Templates>[A][string], undefined>;

export class StyleHandler {
	protected templates: format.Templates;

	protected getStyle<A extends keyof format.Templates>(type: A, style: Style<A> | undefined): Style<A> | undefined {
		if (style == null) {
			return;
		}
		let template = style.template;
		if (template == null) {
			return style;
		}
		let templates = (this.templates[type] ?? {}) as Record<string, Style<A> | undefined>;
		let template_style = templates[template];
		if (template_style == null) {
			throw new MissingTemplateError(template, type);
		}
		return {
			...this.getStyle(type, template_style),
			...style
		};
	}

	constructor(templates: format.Templates | undefined) {
		this.templates = templates ?? {};
	}

	getBoxStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("box", style);
	}

	getHorizontalStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("horizontal", style);
	}

	getTextStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("text", style);
	}

	getVerticalStyle(style?: format.BoxNodeStyle): format.BoxNodeStyle | undefined {
		return this.getStyle("vertical", style);
	}
};
