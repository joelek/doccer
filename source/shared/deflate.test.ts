import { Chunk } from "@joelek/stdlib/dist/lib/data/chunk";
import * as wtf from "@joelek/wtf";
import { CODE_LENGTH_CODES_ORDER, EncodingMethod, STATIC_LITERALS, computeAdler32, deflate, generateMatches, getBitLengthsFromHistogram, getDistanceFromIndex, getInitializedBSW, inflate, writeAdler32Checksum } from "./deflate";
import { HuffmanRecord } from "./huffman";

function range(first_value: number, delta_value: number, steps: number): Array<number> {
	let range = [] as Array<number>;
	let next_value = first_value;
	for (let i = 0; i < steps; i++) {
		range.push(next_value);
		next_value += delta_value;
	}
	return range;
};

wtf.test(`Distances should be properly computed from indices.`, async (assert) => {
	assert.equals(getDistanceFromIndex(1, 0, 3), 1);
	assert.equals(getDistanceFromIndex(2, 0, 3), 2);
	assert.equals(getDistanceFromIndex(2, 1, 3), 1);
	assert.equals(getDistanceFromIndex(3, 0, 3), 3);
	assert.equals(getDistanceFromIndex(3, 1, 3), 2);
	assert.equals(getDistanceFromIndex(3, 2, 3), 1);
	assert.equals(getDistanceFromIndex(4, 0, 3), 4);
	assert.equals(getDistanceFromIndex(4, 1, 3), 3);
	assert.equals(getDistanceFromIndex(4, 2, 3), 2);
	assert.equals(getDistanceFromIndex(4, 3, 3), 1);
	assert.equals(getDistanceFromIndex(5, 0, 3), 1);
	assert.equals(getDistanceFromIndex(5, 1, 3), 4);
	assert.equals(getDistanceFromIndex(5, 2, 3), 3);
	assert.equals(getDistanceFromIndex(5, 3, 3), 2);
	assert.equals(getDistanceFromIndex(6, 0, 3), 2);
	assert.equals(getDistanceFromIndex(6, 1, 3), 1);
	assert.equals(getDistanceFromIndex(6, 2, 3), 4);
	assert.equals(getDistanceFromIndex(6, 3, 3), 3);
	assert.equals(getDistanceFromIndex(7, 0, 3), 3);
	assert.equals(getDistanceFromIndex(7, 1, 3), 2);
	assert.equals(getDistanceFromIndex(7, 2, 3), 1);
	assert.equals(getDistanceFromIndex(7, 3, 3), 4);
});

wtf.test(`Inflate should inflate zlib streams containing raw blocks.`, (assert) => {
	let bsw = getInitializedBSW();
	bsw.encode(1, 1);
	bsw.encode(EncodingMethod.RAW, 2);
	bsw.skipToByteBoundary();
	let length = 257;
	let length_complement = 65535 - length;
	bsw.encode((length >> 0) & 0xFF, 8);
	bsw.encode((length >> 8) & 0xFF, 8);
	bsw.encode((length_complement >> 0) & 0xFF, 8);
	bsw.encode((length_complement >> 8) & 0xFF, 8);
	let bytes = range(0, 1, length).map((index) => index % 256);
	for (let byte of bytes) {
		bsw.encode(byte, 8);
	}
	bsw.skipToByteBoundary();
	writeAdler32Checksum(bsw, computeAdler32(Uint8Array.from(bytes)));
	let observed = inflate(bsw.createBuffer().buffer);
	let expected = Uint8Array.from(bytes);
	assert.equals(observed, expected);
});

wtf.test(`Inflate should inflate zlib streams containing blocks encoding using static huffman tables.`, (assert) => {
	let bsw = getInitializedBSW();
	bsw.encode(1, 1);
	bsw.encode(EncodingMethod.STATIC, 2);
	let length = 257;
	let bytes = range(0, 1, length).map((index) => index % 256);
	for (let byte of [...bytes, 256]) {
		HuffmanRecord.encodeSymbolLSB(STATIC_LITERALS, bsw, byte);
	}
	bsw.skipToByteBoundary();
	writeAdler32Checksum(bsw, computeAdler32(Uint8Array.from(bytes)));
	let observed = inflate(bsw.createBuffer().buffer);
	let expected = Uint8Array.from(bytes);
	assert.equals(observed, expected);
});

wtf.test(`Inflate should inflate zlib streams containing blocks encoding using dynamic huffman tables.`, (assert) => {
	let bsw = getInitializedBSW();
	bsw.encode(1, 1);
	bsw.encode(EncodingMethod.DYNAMIC, 2);
	let length = 257;
	let bytes = range(0, 1, length).map((index) => index % 256);
	let literals_bit_lengths = range(9, 0, 286);
	let literals = HuffmanRecord.create(literals_bit_lengths);
	let distances_bit_lengths = range(5, 0, 30);
	let distances = HuffmanRecord.create(distances_bit_lengths);
	let lengths_bit_lengths = range(5, 0, 19);
	let lengths = HuffmanRecord.create(lengths_bit_lengths);
	bsw.encode(literals_bit_lengths.length - 257, 5);
	bsw.encode(distances_bit_lengths.length - 1, 5);
	bsw.encode(lengths_bit_lengths.length - 4, 4);
	for (let index of CODE_LENGTH_CODES_ORDER) {
		bsw.encode(lengths_bit_lengths[index], 3);
	}
	for (let literals_bit_length of literals_bit_lengths) {
		HuffmanRecord.encodeSymbolLSB(lengths, bsw, literals_bit_length);
	}
	for (let distances_bit_length of distances_bit_lengths) {
		HuffmanRecord.encodeSymbolLSB(lengths, bsw, distances_bit_length);
	}
	for (let byte of [...bytes, 256]) {
		HuffmanRecord.encodeSymbolLSB(literals, bsw, byte);
	}
	bsw.skipToByteBoundary();
	writeAdler32Checksum(bsw, computeAdler32(Uint8Array.from(bytes)));
	let observed = inflate(bsw.createBuffer().buffer);
	let expected = Uint8Array.from(bytes);
	assert.equals(observed, expected);
});

wtf.test(`Inflate should throw an error when attempting to decode blocks with a reserved block type.`, async (assert) => {
	let bsw = getInitializedBSW();
	bsw.encode(1, 1);
	bsw.encode(EncodingMethod.RESERVED, 2);
	await assert.throws(() => {
		inflate(bsw.createBuffer().buffer);
	});
});

wtf.test(`Matches should be generated into the lookahead buffer ("AABABABAAB").`, async (assert) => {
	let observed = generateMatches(Chunk.fromString("AABABABAAB", "binary"), { max_distance_bits: 2 });
	let expected = [65, 65, 66, { distance: 2, length: 5 }, 65, 66];
	assert.equals(observed.byte_count, 10);
	assert.equals(observed.matches, expected);
});

wtf.test(`Matches should not be generated past the max distance ("ABCDEABCDE").`, async (assert) => {
	let observed = generateMatches(Chunk.fromString("ABCDEABCDE", "binary"), { max_distance_bits: 2 });
	let expected = [65, 66, 67, 68, 69, 65, 66, 67, 68, 69];
	assert.equals(observed.byte_count, 10);
	assert.equals(observed.matches, expected);
});

wtf.test(`Deflate should deflate strings lacking long repeated sequences ("hello").`, async (assert) => {
	let buffer = Chunk.fromString("hello", "binary");
	let observed = deflate(buffer.buffer);
	let expected = Uint8Array.of(0x78, 0x9C, 0xCB, 0x48, 0xCD, 0xC9, 0xC9, 0x07, 0x00, 0x06, 0x2C, 0x02, 0x15);
	assert.equals(observed, expected);
});

wtf.test(`Deflate should deflate strings containing long repeated sequences ("hello hello").`, async (assert) => {
	let buffer = Chunk.fromString("hello hello", "binary");
	let observed = deflate(buffer.buffer);
	let expected = Uint8Array.of(0x78, 0x9C, 0xCB, 0x48, 0xCD, 0xC9, 0xC9, 0x57, 0x00, 0x93, 0x00, 0x19, 0x91, 0x04, 0x49);
	assert.equals(observed, expected);
});

wtf.test(`Strings lacking long repeated sequences ("hello") should be deflated and inflated properly.`, async (assert) => {
	let expected = "hello";
	let observed = Chunk.toString(inflate(deflate(Chunk.fromString(expected, "binary").buffer)), "binary");
	assert.equals(observed, expected);
});

wtf.test(`Strings containing long repeated sequences ("hello hello") should be deflated and inflated properly.`, async (assert) => {
	let expected = "hello hello";
	let observed = Chunk.toString(inflate(deflate(Chunk.fromString(expected, "binary").buffer)), "binary");
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [2, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([2, 1]);
	let expected = [1, 1];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [3, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([3, 1, 1]);
	let expected = [1, 2, 2];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [4, 1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([4, 1, 1, 1]);
	let expected = [1, 2, 3, 3];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1]);
	let expected = [1];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1]);
	let expected = [1, 1];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1, 1]);
	let expected = [1, 2, 2];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1, 1, 1]);
	let expected = [2, 2, 2, 2];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1, 1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1, 1, 1, 1]);
	let expected = [2, 2, 2, 3, 3];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1, 1, 1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1, 1, 1, 1, 1]);
	let expected = [2, 2, 3, 3, 3, 3];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1, 1, 1, 1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1, 1, 1, 1, 1, 1]);
	let expected = [2, 3, 3, 3, 3, 3, 3];
	assert.equals(observed, expected);
});

wtf.test(`Bit lengths should be computed from histogram [1, 1, 1, 1, 1, 1, 1, 1].`, async (assert) => {
	let observed = getBitLengthsFromHistogram([1, 1, 1, 1, 1, 1, 1, 1]);
	let expected = [3, 3, 3, 3, 3, 3, 3, 3];
	assert.equals(observed, expected);
});
