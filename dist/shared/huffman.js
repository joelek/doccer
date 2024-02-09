"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuffmanRecord = void 0;
exports.HuffmanRecord = {
    create(bit_lengths) {
        let min_bit_length = bit_lengths.reduce((min, bit_length) => bit_length === 0 ? min : Math.min(min, bit_length), 0 + Infinity);
        let max_bit_length = bit_lengths.reduce((max, bit_length) => bit_length === 0 ? max : Math.max(max, bit_length), 0 - Infinity);
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
        let symbols = {};
        let keys = {};
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
                    }
                    else {
                        tree_index = (tree_index << 1) + 1;
                    }
                }
                tree[tree_index] = symbol;
            }
        }
        let start_offsets_lsb = {};
        for (let i = 0; i < (1 << min_bit_length); i++) {
            let tree_index = 0;
            let bits = i;
            let mask = 1;
            for (let j = 0; j < min_bit_length; j++) {
                let bit = (bits & mask) === mask;
                if (bit) {
                    tree_index = (tree_index + 1) << 1;
                }
                else {
                    tree_index = (tree_index << 1) + 1;
                }
                mask <<= 1;
            }
            start_offsets_lsb[i] = tree_index;
        }
        return {
            symbols,
            keys,
            min_bit_length,
            max_bit_length,
            tree,
            start_offsets_lsb
        };
    },
    decodeSymbolLSB(record, bsr) {
        let { tree, min_bit_length, max_bit_length, start_offsets_lsb } = record;
        let bits = bsr.decode(min_bit_length);
        let tree_index = start_offsets_lsb[bits];
        let symbol = tree[tree_index];
        if (symbol !== -1) {
            return symbol;
        }
        for (let i = min_bit_length; i < max_bit_length; i++) {
            let bit = bsr.decode(1);
            if (bit) {
                tree_index = (tree_index + 1) << 1;
            }
            else {
                tree_index = (tree_index << 1) + 1;
            }
            let symbol = tree[tree_index];
            if (symbol !== -1) {
                return symbol;
            }
        }
        throw new Error(`Expected a matching symbol for the huffman code!`);
    },
    decodeSymbolMSB(record, bsr) {
        let tree_index = 0;
        let { tree, min_bit_length, max_bit_length } = record;
        let bits = bsr.decode(min_bit_length);
        let mask = (1 << (min_bit_length - 1));
        for (let i = 0; i < min_bit_length; i++) {
            let bit = (bits & mask) === mask;
            if (bit) {
                tree_index = (tree_index + 1) << 1;
            }
            else {
                tree_index = (tree_index << 1) + 1;
            }
            mask >>= 1;
        }
        let symbol = tree[tree_index];
        if (symbol !== -1) {
            return symbol;
        }
        for (let i = min_bit_length; i < max_bit_length; i++) {
            let bit = bsr.decode(1);
            if (bit) {
                tree_index = (tree_index + 1) << 1;
            }
            else {
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
