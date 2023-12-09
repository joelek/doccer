"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codec = void 0;
// @ts-ignore
const TEXT_ENCODER = new TextEncoder();
// @ts-ignore
const TEXT_DECODER = new TextDecoder();
exports.Codec = {
    unicodeFromAscii(ascii) {
        let bytes = this.encodeAsciiBuffer(ascii);
        let unicode = TEXT_DECODER.decode(bytes);
        return unicode;
    },
    asciiFromUnicode(unicode) {
        let bytes = TEXT_ENCODER.encode(unicode);
        let ascii = this.decodeAsciiBuffer(bytes);
        return ascii;
    },
    utf16FromAscii(ascii) {
        let utf16 = "";
        for (let i = 0; i < ascii.length; i += 2) {
            let hi = ascii.charCodeAt(i + 0) || 0;
            let lo = ascii.charCodeAt(i + 1) || 0;
            if (hi >= 256) {
                throw new Error();
            }
            if (lo >= 256) {
                throw new Error();
            }
            let code_unit = (hi << 8) + lo;
            utf16 += String.fromCharCode(code_unit);
        }
        return utf16;
    },
    decodeAsciiBuffer(bytes) {
        let code_points = Array.from(bytes);
        let characters = code_points.map((code_point) => String.fromCodePoint(code_point));
        let ascii = characters.join("");
        return ascii;
    },
    encodeAsciiBuffer(ascii) {
        let characters = [...ascii];
        let code_points = characters.map((character) => character.charCodeAt(0) ?? 0);
        let bytes = new Uint8Array(code_points);
        return bytes;
    },
    decodeUnicodeBuffer(bytes) {
        let unicode = TEXT_DECODER.decode(bytes);
        return unicode;
    },
    encodeUnicodeBuffer(unicode) {
        let bytes = TEXT_ENCODER.encode(unicode);
        return bytes;
    }
};
