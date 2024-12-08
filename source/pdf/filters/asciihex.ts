import { Chunk } from "@joelek/stdlib/dist/lib/data/chunk";

export const AsciiHex = {
	decode(encoded: Uint8Array): Uint8Array {
		let string = Chunk.toString(encoded, "binary");
		let bytes = [] as Array<number>;
		let last_character: string | undefined;
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
				} else {
					let byte = Number.parseInt(last_character + character, 16);
					bytes.push(byte);
					last_character = undefined;
				}
			} else {
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

	encode(decoded: Uint8Array): Uint8Array {
		let strings = [] as Array<string>;
		for (let byte of decoded) {
			let string = byte.toString(16).toUpperCase().padStart(2, "0");
			strings.push(string);
		}
		let string = strings.join("");
		let encoded = Chunk.fromString(string, "binary");
		return encoded;
	}
};
