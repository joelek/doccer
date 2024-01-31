import { BitstreamReader } from "./bitstreams";

export type HuffmanRecord = {
	symbols: Record<string, number>;
	keys: Record<number, string>;
	max_bit_length: number;
};

export const HuffmanRecord = {
	create(bit_lengths: Array<number>): HuffmanRecord {
		let max_bit_length = bit_lengths.reduce((max, bit_length) => Math.max(max, bit_length), 0);
		let symbol_count_for_bit_length = new Array(max_bit_length + 1).fill(0);
		for (let bit_length of bit_lengths) {
			if (bit_length > 0) {
				symbol_count_for_bit_length[bit_length] += 1;
			}
		}
		let code = 0;
		let next_code_for_bit_length = new Array(max_bit_length + 1).fill(0);
		for (let bit_length = 1; bit_length <= max_bit_length; bit_length += 1) {
			code = (code + symbol_count_for_bit_length[bit_length - 1]) << 1;
			next_code_for_bit_length[bit_length] = code;
		}

		let symbols = {} as Record<string, number>;
		let keys = {} as Record<number, string>;
		for (let [symbol, bit_length] of bit_lengths.entries()) {
			if (bit_length > 0) {
				let code = next_code_for_bit_length[bit_length]++;
				let key = code.toString(2).padStart(bit_length, "0");
				symbols[key] = symbol;
				keys[symbol] = key;
			}
		}
		return {
			symbols,
			keys,
			max_bit_length
		};
	},

	decodeSymbol(record: HuffmanRecord, bsr: BitstreamReader): number {
		let key = "";
		for (let i = 0; i < record.max_bit_length; i++) {
			let suffix = bsr.decode(1) === 1 ? "1" : "0";
			key += suffix;
			let symbol = record.symbols[key];
			if (symbol != null) {
				return symbol;
			}
		}
		throw new Error(`Expected "${key}" to be a prefix!`);
	}
};
