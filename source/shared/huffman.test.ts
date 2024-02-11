import * as wtf from "@joelek/wtf";
import * as huffman from "./huffman";
import { BitstreamReaderMSB, BitstreamReaderLSB } from "./bitstreams";

const RFC_EXAMPLE: huffman.HuffmanRecord = {
	bit_lengths: [3, 3, 3, 3, 3, 2, 4, 4],
	codes_lsb: [2, 6, 1, 5, 3, 0, 7, 15],
	codes_msb: [2, 3, 4, 5, 6, 0, 14, 15],
	min_bit_length: 2,
	max_bit_length: 4,
	tree: [-1, -1, -1, 5, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 6, 7, -1],
	start_offsets_lsb: [3, 5, 4, 6],
	start_offsets_msb: [3, 4, 5, 6]
};

wtf.test(`HuffmanRecord should be properly created from the example in the RFC.`, (assert) => {
	let observed = huffman.HuffmanRecord.create([3, 3, 3, 3, 3, 2, 4, 4]);
	let expected = RFC_EXAMPLE;
	assert.equals(observed, expected);
});

wtf.test(`HuffmanRecord should decode symbols using a BistreamReaderMSB.`, (assert) => {
	let bsr = new BitstreamReaderMSB(Uint8Array.of(0b010_011_10, 0b0_101_110_0, 0b0_1110_111, 0b1_0000000));
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 0);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 1);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 2);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 3);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 4);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 5);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 6);
	assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 7);
});

wtf.test(`HuffmanRecord should decode symbols using a BistreamReaderLSB.`, (assert) => {
	let bsr = new BitstreamReaderLSB(Uint8Array.of(0b01_110_010, 0b0_011_101_0, 0b111_0111_0, 0b0000000_1));
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 0);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 1);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 2);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 3);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 4);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 5);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 6);
	assert.equals(huffman.HuffmanRecord.decodeSymbolLSB(RFC_EXAMPLE, bsr), 7);
});
