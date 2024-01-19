const CLEAR_TABLE = 256;
const END_OF_DATA = 257;

export const LZW = {
	decode(source: Uint8Array): Uint8Array {
		throw new Error("Not yet implemented!");
	},

	encode(source: Uint8Array): Uint8Array {
		let table = [] as Array<string>;
		let dictionary = new Map<string, number>();
		for (let i = 0; i < 256; i++) {
			let key = String.fromCharCode(i);
			table.push(key);
			dictionary.set(key, table.length - 1);
		}
		table.push(""); // CLEAR_TABLE
		table.push(""); // END_OF_DATA
		let bit_length = 9;
		let entries = [] as Array<{ bit_length: number; code: number; }>;
		entries.push({
			bit_length: bit_length,
			code: CLEAR_TABLE
		});
		let last_key = "";
		let last_code = 0;
		for (let i = 0; i <= source.length; i++) {
			let key_suffix = String.fromCharCode(source[i]);
			let new_key = last_key + key_suffix;
			let code = dictionary.get(new_key);
			if (code != null) {
				last_key = new_key;
				last_code = code;
			} else {
				entries.push({
					bit_length: bit_length,
					code: last_code
				});
				if (i < source.length) {
					table.push(new_key);
					dictionary.set(new_key, table.length - 1);
					if (table.length === 2 ** bit_length) {
						bit_length += 1;
						if (bit_length > 12) {
							entries.push({
								bit_length: 12,
								code: CLEAR_TABLE
							});
							table = [] as Array<string>;
							dictionary = new Map<string, number>();
							for (let i = 0; i < 256; i++) {
								let key = String.fromCharCode(i);
								table.push(key);
								dictionary.set(key, i);
							}
							table.push(""); // CLEAR_TABLE
							table.push(""); // END_OF_DATA
							bit_length = 9;
						}
					}
				}
				last_key = key_suffix;
				last_code = source[i];
			}
		}
		entries.push({
			bit_length: bit_length,
			code: END_OF_DATA
		});
		let bytes = [] as Array<number>;
		let bits_left_in_byte = 0;
		for (let entry of entries) {
			let bits_encoded = 0;
			let bits_left = entry.bit_length;
			while (bits_left > 0) {
				if (bits_left_in_byte === 0) {
					bytes.push(0);
					bits_left_in_byte = 8;
				}
				let byte = bytes[bytes.length - 1];
				let bits_encoded_in_byte = Math.min(bits_left_in_byte, bits_left);
				let lsb_bits_to_truncate = Math.max(0, bits_left - bits_left_in_byte);
				let lsb_bits_to_introduce = Math.max(0, bits_left_in_byte - bits_left);
				let value = ((entry.code >> lsb_bits_to_truncate) << lsb_bits_to_introduce);
				let unused_bits_mask = (1 << bits_left_in_byte) - 1;
				byte = (byte & ~unused_bits_mask) | (value & unused_bits_mask);
				bytes[bytes.length - 1] = byte;
				bits_left_in_byte -= bits_encoded_in_byte;
				bits_encoded += bits_encoded_in_byte;
				bits_left -= bits_encoded_in_byte;
			}
		}
		return Uint8Array.from(bytes);
	}
};
