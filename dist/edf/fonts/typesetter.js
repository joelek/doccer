"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontHandler = exports.Typesetter = void 0;
class Typesetter {
    widths;
    fallback_width;
    kernings;
    glyph_data;
    fallback_box;
    scale_factor;
    italic_angle;
    postscript_name;
    font_family;
    font_weight;
    options;
    getCharacterBox(character, normalized = true) {
        let box = this.glyph_data.get(character)?.box ?? this.fallback_box;
        if (normalized) {
            return {
                x_min: box.x_min * this.scale_factor,
                y_min: box.y_min * this.scale_factor,
                x_max: box.x_max * this.scale_factor,
                y_max: box.y_max * this.scale_factor
            };
        }
        else {
            return box;
        }
    }
    getWidth(character, normalized = true) {
        let width = this.widths.get(character) ?? this.fallback_width;
        if (normalized) {
            return width * this.scale_factor;
        }
        else {
            return width;
        }
    }
    getKerning(prefix, suffix) {
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
            }
            else {
                return value + this.options.letter_spacing + this.options.word_spacing / 2;
            }
        }
        else {
            if (next === " ") {
                return value + this.options.letter_spacing + this.options.word_spacing / 2;
            }
            else {
                return value + this.options.letter_spacing;
            }
        }
    }
    segmentIntoLines(string) {
        return string.split(/\r?\n/);
    }
    segmentIntoCharacters(string) {
        return [...string];
    }
    segmentIntoWords(string) {
        return Array.from(string.match(/\S+/g) ?? []);
    }
    constructor(widths, fallback_width, kernings, glyph_data, fallback_box, scale_factor, italic_angle, postscript_name, font_family, font_weight, options) {
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
    clampString(string, target_width) {
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
            }
            else {
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
    getAscent(normalized = true) {
        let box = this.getCharacterBox("", normalized);
        return box.y_max;
    }
    getCapHeight(normalized = true) {
        let box = this.getCharacterBox("I", normalized);
        return box.y_max;
    }
    getDescent(normalized = true) {
        let box = this.getCharacterBox("", normalized);
        return box.y_min;
    }
    getFontFamily() {
        return this.font_family;
    }
    getFontStyle() {
        return this.italic_angle === 0 ? "normal" : "italic";
    }
    getFontWeight() {
        return this.font_weight;
    }
    getItalicAngle() {
        return this.italic_angle;
    }
    getPostscriptName() {
        return this.postscript_name;
    }
    getStemWidth(normalized = true) {
        let box = this.getCharacterBox("l", normalized);
        return box.x_max - box.x_min;
    }
    getXHeight(normalized = true) {
        let box = this.getCharacterBox("x", normalized);
        return box.y_max;
    }
    getGlyphIndexArray(string) {
        let bytes = [];
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
    measureString(string) {
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
    withOptions(options) {
        return new Typesetter(this.widths, this.fallback_width, this.kernings, this.glyph_data, this.fallback_box, this.scale_factor, this.italic_angle, this.postscript_name, this.font_family, this.font_weight, options);
    }
    wrapString(string, target_width) {
        string = string.trim().replaceAll(/\s+/g, " ");
        let characters = this.segmentIntoCharacters(string);
        let measured_lines = [];
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
            }
            else {
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
    wrapStringUsingLineBreaks(string) {
        let lines = this.segmentIntoLines(string);
        let measured_lines = [];
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
    static createFromFont(font) {
        let widths = new Map();
        let kernings = new Map();
        let glyph_data = new Map();
        for (let { code_point, index } of font.cmap.mappings) {
            let metrics = font.hmtx.metrics[index];
            let key = String.fromCodePoint(code_point);
            let glyph = font.glyf.glyphs[index];
            widths.set(key, metrics.advance_width);
            let box = {
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
        let fallback_box = {
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
}
exports.Typesetter = Typesetter;
;
class FontHandler {
    entries;
    type_id;
    default_font;
    constructor(default_font) {
        this.entries = new Map();
        this.type_id = 0;
        this.default_font = default_font;
    }
    addTypesetter(key, typesetter) {
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
    getDefaultFont() {
        return this.default_font;
    }
    getTypesetter(key) {
        let entry = this.entries.get(key);
        if (entry == null) {
            throw new Error();
        }
        return entry.typesetter;
    }
    getTypeId(key) {
        let entry = this.entries.get(key);
        if (entry == null) {
            throw new Error();
        }
        return entry.type_id;
    }
}
exports.FontHandler = FontHandler;
;
