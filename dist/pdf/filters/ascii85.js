"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ascii85 = void 0;
exports.Ascii85 = {
    decode(string) {
        if (!string.endsWith("~>")) {
            throw new Error();
        }
        string = string.slice(0, -2);
        let code_points = [];
        for (let i = 0; i < string.length; i++) {
            let character = string[i];
            if ("\x00\x09\x0A\x0C\x0D\x20".includes(character)) {
                continue;
            }
            if (character === "z") {
                for (let i = 0; i < 5; i++) {
                    code_points.push(0);
                }
                continue;
            }
            let code_point = character.charCodeAt(0) - 33;
            if (code_point < 0 || code_point > 84) {
                throw new Error();
            }
            code_points.push(code_point);
        }
        let bytes = [];
        let groups = Math.ceil(code_points.length / 5);
        let padding_length = groups * 5 - code_points.length;
        let index = 0;
        for (let g = 0; g < groups; g++) {
            let is_last_group = g === groups - 1;
            let value = 0;
            for (let i = 0; i < 5; i++) {
                let code_point = code_points[index++] ?? 84;
                value *= 85;
                value += code_point;
            }
            let group_bytes = [];
            for (let i = 0; i < 4; i++) {
                let byte = value % 256;
                group_bytes.unshift(byte);
                value = Math.floor(value / 256);
            }
            for (let i = 0; i < (is_last_group ? 4 - padding_length : 4); i++) {
                bytes.push(group_bytes[i]);
            }
        }
        let buffer = Uint8Array.from(bytes);
        return buffer;
    },
    encode(buffer) {
        let symbols = [];
        let groups = Math.ceil(buffer.length / 4);
        let padding_length = groups * 4 - buffer.length;
        let index = 0;
        for (let g = 0; g < groups; g++) {
            let is_last_group = g === groups - 1;
            let value = 0;
            for (let i = 0; i < 4; i++) {
                let byte = buffer[index++] ?? 0;
                value *= 256;
                value += byte;
            }
            if (value === 0 && (!is_last_group || padding_length === 0)) {
                symbols.push("z");
            }
            else {
                let code_points = [];
                for (let i = 0; i < 5; i++) {
                    let code_point = value % 85;
                    code_points.unshift(code_point);
                    value = Math.floor(value / 85);
                }
                for (let i = 0; i < (is_last_group ? 5 - padding_length : 5); i++) {
                    symbols.push(String.fromCharCode(33 + code_points[i]));
                }
            }
        }
        return symbols.join("") + "~>";
    }
};
