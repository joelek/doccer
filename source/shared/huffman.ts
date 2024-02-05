import { BitstreamReader } from "./bitstreams";

export type HuffmanRecord = {
	symbols: Record<string, number>;
	keys: Record<number, string>;
	max_bit_length: number;
	tree: Array<number>;
};

export const HuffmanRecord = {
	create(bit_lengths: Array<number>): HuffmanRecord {
		let max_bit_length = bit_lengths.reduce((max, bit_length) => Math.max(max, bit_length), 0);
		let symbol_count_for_bit_length = new Array<number>(max_bit_length + 1).fill(0);
		for (let bit_length of bit_lengths) {
			if (bit_length > 0) {
				symbol_count_for_bit_length[bit_length] += 1;
			}
		}
		let code = 0;
		let next_code_for_bit_length = new Array<number>(max_bit_length + 1).fill(0);
		for (let bit_length = 1; bit_length <= max_bit_length; bit_length += 1) {
			code = (code + symbol_count_for_bit_length[bit_length - 1]) << 1;
			next_code_for_bit_length[bit_length] = code;
		}
		let symbols = {} as Record<string, number>;
		let keys = {} as Record<number, string>;
		let tree = new Array(1 << (max_bit_length + 1)).fill(-1);
		for (let [symbol, bit_length] of bit_lengths.entries()) {
			if (bit_length > 0) {
				let code = next_code_for_bit_length[bit_length]++;
				let key = code.toString(2).padStart(bit_length, "0");
				symbols[key] = symbol;
				keys[symbol] = key;
				let tree_index = 0;
				for (let bit_mask = (1 << (bit_length - 1)); bit_mask > 0; bit_mask >>= 1) {
					if ((code & bit_mask) == bit_mask) {
						tree_index = (tree_index + 1) << 1;
					} else {
						tree_index = (tree_index << 1) + 1;
					}
				}
				tree[tree_index] = symbol;
			}
		}
		return {
			symbols,
			keys,
			max_bit_length,
			tree
		};
	},

	decodeSymbol(record: HuffmanRecord, bsr: BitstreamReader): number {
		let tree_index = 0;
		let { tree, max_bit_length } = record;
		for (let i = 0; i < max_bit_length; i++) {
			let bit = bsr.decode(1);
			if (bit) {
				tree_index = (tree_index + 1) << 1;
			} else {
				tree_index = (tree_index << 1) + 1;
			}
			let symbol = tree[tree_index];
			if (symbol !== -1) {
				return symbol;
			}
		}
		throw new Error(`Expected a matching symbol for the huffman code!`);
	}
};
