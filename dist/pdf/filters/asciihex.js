"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsciiHex = void 0;
const chunk_1 = require("@joelek/stdlib/dist/lib/data/chunk");
exports.AsciiHex = {
    decode(encoded) {
        let string = chunk_1.Chunk.toString(encoded, "binary");
        let bytes = [];
        let last_character;
        for (let character of string) {
            if (character === " ") {
                continue;
            }
            if (character === ">") {
                break;
            }
            if (/[0-9a-zA-Z]/.test(character)) {
                if (last_character == null) {
                    last_character = character;
                }
                else {
                    let byte = Number.parseInt(last_character + character, 16);
                    bytes.push(byte);
                    last_character = undefined;
                }
            }
            else {
                throw new Error(`Expected a hex string!`);
            }
        }
        if (last_character != null) {
            let byte = Number.parseInt(last_character + "0", 16);
            bytes.push(byte);
            last_character = undefined;
        }
        let decoded = Uint8Array.from(bytes);
        return decoded;
    },
    encode(decoded) {
        let strings = [];
        for (let byte of decoded) {
            let string = byte.toString(16).toUpperCase().padStart(2, "0");
            strings.push(string);
        }
        let string = strings.join("");
        let encoded = chunk_1.Chunk.fromString(string, "binary");
        return encoded;
    }
};
