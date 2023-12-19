import * as truetype from "../../truetype";

export type MeasuredLine = {
	line_string: string;
	line_width: number;
};

export type Options = {
	letter_spacing: number;
	word_spacing: number;
};

export type Box = {
	x_min: number;
	y_min: number;
	x_max: number;
	y_max: number;
};

export type GlyphData = {
	index: number;
	box: Box;
};

export class Typesetter {
	protected widths: Map<string, number>;
	protected fallback_width: number;
	protected kernings: Map<string, number>;
	protected glyph_data: Map<string, GlyphData>;
	protected fallback_box: Box;
	protected scale_factor: number;
	protected italic_angle: number;
	protected postscript_name?: string;
	protected font_family?: string;
	protected font_weight?: number;
	protected options: Options;

	protected getCharacterBox(character: string, normalized: boolean = true): Box {
		let box = this.glyph_data.get(character)?.box ?? this.fallback_box;
		if (normalized) {
			return {
				x_min: box.x_min * this.scale_factor,
				y_min: box.y_min * this.scale_factor,
				x_max: box.x_max * this.scale_factor,
				y_max: box.y_max * this.scale_factor
			};
		} else {
			return box;
		}
	}

	protected getWidth(character: string, normalized: boolean = true): number {
		let width = this.widths.get(character) ?? this.fallback_width;
		if (normalized) {
			return width * this.scale_factor;
		} else {
			return width;
		}
	}

	protected getKerning(prefix: string, suffix: string): number {
		if (prefix === "") {
			return 0;
		}
		if (suffix === "") {
			return 0;
		}
		let last = prefix[prefix.length - 1];
		let next = suffix[0];
		let value = this.kernings.get(last + next) ?? 0;
		if (last === " ") {
			if (next === " ") {
				return value + this.options.letter_spacing;
			} else {
				return value + this.options.letter_spacing + this.options.word_spacing / 2;
			}
		} else {
			if (next === " ") {
				return value + this.options.letter_spacing + this.options.word_spacing / 2;
			} else {
				return value + this.options.letter_spacing;
			}
		}
	}

	protected segmentIntoLines(string: string): Array<string> {
		return string.split(/\r?\n/);
	}

	protected segmentIntoCharacters(string: string): Array<string> {
		return [...string];
	}

	protected segmentIntoWords(string: string): Array<string> {
		return Array.from(string.match(/\S+/g) ?? []);
	}

	constructor(widths: Map<string, number>, fallback_width: number, kernings?: Map<string, number>, glyph_data?: Map<string, GlyphData>, fallback_box?: Box, scale_factor?: number, italic_angle?: number, postscript_name?: string, font_family?: string, font_weight?: number, options?: Partial<Options>) {
		this.widths = widths;
		this.fallback_width = fallback_width;
		this.kernings = kernings ?? new Map();
		this.glyph_data = glyph_data ?? new Map();
		this.fallback_box = fallback_box ?? {
			x_min: 0,
			y_min: 0,
			x_max: 1,
			y_max: 1
		};
		this.scale_factor = scale_factor ?? 1;
		this.italic_angle = italic_angle ?? 0;
		this.postscript_name = postscript_name;
		this.font_family = font_family;
		this.font_weight = font_weight;
		this.options = {
			letter_spacing: options?.letter_spacing ?? 0,
			word_spacing: options?.word_spacing ?? 0
		};
	}

	clampString(string: string, target_width: number): Array<MeasuredLine> {
		string = string.trim().replaceAll(/\s+/g, " ");
		let characters = this.segmentIntoCharacters(string);
		let head_string = "";
		let head_width = 0;
		let truncator = "...";
		let truncator_width = this.measureString(truncator);
		let i = 0;
		for (; i < characters.length; i++) {
			let character = characters[i];
			let kerning = this.getKerning(head_string, character);
			let character_width = this.measureString(character);
			let kerning_truncator = this.getKerning(character, truncator);
			if (head_width + kerning + character_width + kerning_truncator + truncator_width <= target_width) {
				head_string += character;
				head_width += kerning + character_width;
			} else {
				break;
			}
		}
		if (i === characters.length) {
			let line_string = head_string;
			let line_width = head_width;
			return [
				{
					line_string,
					line_width
				}
			];
		}
		if (i < characters.length) {
			let character = characters[i];
			let kerning = this.getKerning(head_string, character);
			let character_width = this.measureString(character);
			let tail_string = character;
			let tail_width = kerning + character_width;
			i += 1;
			for (; i < characters.length; i++) {
				let character = characters[i];
				let kerning = this.getKerning(tail_string, character);
				let character_width = this.measureString(character);
				tail_string += character;
				tail_width += kerning + character_width;
			}
			let line_string = head_string + tail_string;
			let line_width = head_width + tail_width;
			if (head_width + tail_width <= target_width) {
				return [
					{
						line_string,
						line_width
					}
				];
			}
		}
		let kerning = this.getKerning(head_string, truncator);
		let tail_string = truncator;
		let tail_width = kerning + truncator_width;
		let line_string = head_string + tail_string;
		let line_width = head_width + tail_width;
		return [
			{
				line_string,
				line_width
			}
		];
	}

	getAscent(normalized: boolean = true): number {
		let box = this.getCharacterBox("", normalized);
		return box.y_max;
	}

	getCapHeight(normalized: boolean = true): number {
		let box = this.getCharacterBox("I", normalized);
		return box.y_max;
	}

	getDescent(normalized: boolean = true): number {
		let box = this.getCharacterBox("", normalized);
		return box.y_min;
	}

	getFontFamily(): string | undefined {
		return this.font_family;
	}

	getFontStyle(): "italic" | "normal" {
		return this.italic_angle === 0 ? "normal" : "italic";
	}

	getFontWeight(): number | undefined {
		return this.font_weight;
	}

	getItalicAngle(): number {
		return this.italic_angle;
	}

	getPostscriptName(): string | undefined {
		return this.postscript_name;
	}

	getStemWidth(normalized: boolean = true): number {
		let box = this.getCharacterBox("l", normalized);
		return box.x_max - box.x_min;
	}

	getXHeight(normalized: boolean = true): number {
		let box = this.getCharacterBox("x", normalized);
		return box.y_max;
	}

	getGlyphIndexArray(string: string): Uint8Array {
		let bytes = [] as Array<number>;
		let characters = this.segmentIntoCharacters(string);
		for (let character of characters) {
			let index = this.glyph_data.get(character)?.index ?? 0;
			let hi = (index >> 8) & 0xFF;
			let lo = (index >> 0) & 0xFF;
			bytes.push(hi);
			bytes.push(lo);
		}
		return Uint8Array.from(bytes);
	}

	measureString(string: string): number {
		let characters = this.segmentIntoCharacters(string);
		let total_width = 0;
		let last_character = "";
		for (let i = 0; i < characters.length; i++) {
			let character = characters[i];
			let kerning = this.getKerning(last_character, character);
			let segment_width = this.getWidth(character);
			total_width += kerning + segment_width;
			last_character = character;
		}
		return total_width;
	}

	withOptions(options: Partial<Options>): Typesetter {
		return new Typesetter(this.widths, this.fallback_width, this.kernings, this.glyph_data, this.fallback_box, this.scale_factor, this.italic_angle, this.postscript_name, this.font_family, this.font_weight, options);
	}

	wrapString(string: string, target_width: number): Array<MeasuredLine> {
		string = string.trim().replaceAll(/\s+/g, " ");
		let characters = this.segmentIntoCharacters(string);
		let measured_lines = [] as Array<MeasuredLine>;
		let line_string = "";
		let line_width = 0;
		for (let i = 0; i < characters.length; i++) {
			let segment = "";
			let segment_width = 0;
			for (; i < characters.length; i++) {
				if (/\S/.test(characters[i])) {
					break;
				}
				let character = characters[i];
				let kerning = this.getKerning(segment, character);
				let character_width = this.measureString(character);
				segment += character;
				segment_width += kerning + character_width;
			}
			for (; i < characters.length; i++) {
				if (/\s/u.test(characters[i])) {
					i -= 1;
					break;
				}
				let character = characters[i];
				let kerning = this.getKerning(segment, character);
				let character_width = this.measureString(character);
				segment += character;
				segment_width += kerning + character_width;
			}
			let kerning = this.getKerning(line_string, segment);
			if (line_string === "" || (line_width + kerning + segment_width <= target_width)) {
				line_string += segment;
				line_width += kerning + segment_width;
			} else {
				measured_lines.push({
					line_string,
					line_width
				});
				line_string = segment.trim();
				line_width = this.measureString(line_string);
			}
		}
		if (line_string !== "" || measured_lines.length === 0) {
			measured_lines.push({
				line_string,
				line_width
			});
		}
		return measured_lines;
	}

	wrapStringUsingLineBreaks(string: string): Array<MeasuredLine> {
		let lines = this.segmentIntoLines(string);
		let measured_lines = [] as Array<MeasuredLine>;
		for (let line of lines) {
			let line_string = line;
			let line_width = this.measureString(line_string);
			measured_lines.push({
				line_string,
				line_width
			});
		}
		return measured_lines;
	}

	static createFromFont(font: truetype.TrueTypeData): Typesetter {
		let widths = new Map<string, number>();
		let kernings = new Map<string, number>();
		let glyph_data = new Map<string, GlyphData>();
		for (let { code_point, index } of font.cmap.mappings) {
			let metrics = font.hmtx.metrics[index];
			let key = String.fromCodePoint(code_point);
			let glyph = font.glyf.glyphs[index];
			widths.set(key, metrics.advance_width);
			let box: Box = {
				x_min: glyph.x_min,
				y_min: glyph.y_min,
				x_max: glyph.x_max,
				y_max: glyph.y_max,
			};
			glyph_data.set(key, {
				index,
				box
			});
		}
		let fallback_width = font.hmtx.metrics[0].advance_width;
		let fallback_box: Box = {
			x_min: font.head.x_min,
			y_min: font.head.y_min,
			x_max: font.head.x_max,
			y_max: font.head.y_max,
		};
		let scale_factor = 1.0 / font.head.units_per_em;
		let italic_angle = Math.atan2(font.hhea.caret_slope_run, font.hhea.caret_slope_rise) / Math.PI * 180;
		let postscript_name = font.name.name_records.find((name_record) => name_record.name_id === 6)?.string;
		let font_family = font.name.name_records.find((name_record) => name_record.name_id === 1)?.string;
		let font_weight = font.os2?.weight_class;
		return new Typesetter(widths, fallback_width, kernings, glyph_data, fallback_box, scale_factor, italic_angle, postscript_name, font_family, font_weight);
	}
};

export type FontHandlerEntry = {
	typesetter: Typesetter;
	type_id: number;
};

export class FontHandler {
	protected entries: Map<string, FontHandlerEntry>;
	protected type_id: number;

	constructor() {
		this.entries = new Map();
		this.type_id = 0;
	}

	addTypesetter(key: string, typesetter: Typesetter): FontHandler {
		let entry = this.entries.get(key);
		if (entry != null) {
			throw new Error();
		}
		let type_id = this.type_id;
		this.entries.set(key, {
			typesetter,
			type_id
		});
		this.type_id += 1;
		return this;
	}

	getTypesetter(key: string): Typesetter {
		let entry = this.entries.get(key);
		if (entry == null) {
			throw new Error();
		}
		return entry.typesetter;
	}

	getTypeId(key: string): number {
		let entry = this.entries.get(key);
		if (entry == null) {
			throw new Error();
		}
		return entry.type_id;
	}
};
