import * as wtf from "@joelek/wtf";
import { CompressionMethod, CompressionLevel, EncodingMethod, inflate, STATIC_LITERALS, STATIC_DISTANCES, CODE_LENGTH_CODES_ORDER } from "./deflate";
import { BitstreamWriterLSB } from "./bitstreams";
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

function getBSWInitialziedWithZlibHeader(): BitstreamWriterLSB {
	let bsw = new BitstreamWriterLSB();
	bsw.encode(CompressionMethod.DEFLATE, 4);
	bsw.encode(7, 4);
	bsw.encode(26, 5);
	bsw.encode(0, 1);
	bsw.encode(CompressionLevel.BEST, 2);
	return bsw;
};

wtf.test(`Inflate should inflate zlib streams containing raw blocks.`, (assert) => {
	let bsw = getBSWInitialziedWithZlibHeader();
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
	let observed = inflate(bsw.getBuffer().buffer);
	let expected = Uint8Array.from(bytes);
	assert.equals(observed, expected);
});

wtf.test(`Inflate should inflate zlib streams containing blocks encoding using static huffman tables.`, (assert) => {
	let bsw = getBSWInitialziedWithZlibHeader();
	bsw.encode(1, 1);
	bsw.encode(EncodingMethod.STATIC, 2);
	let length = 257;
	let bytes = range(0, 1, length).map((index) => index % 256);
	for (let byte of [...bytes, 256]) {
		let key = STATIC_LITERALS.keys[byte];
		for (let bit of key) {
			bsw.encode(bit === "1" ? 1 : 0, 1);
		}
	}
	let observed = inflate(bsw.getBuffer().buffer);
	let expected = Uint8Array.from(bytes);
	assert.equals(observed, expected);
});

wtf.test(`Inflate should inflate zlib streams containing blocks encoding using dynamic huffman tables.`, (assert) => {
	let bsw = getBSWInitialziedWithZlibHeader();
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
		let key = lengths.keys[literals_bit_length];
		for (let bit of key) {
			bsw.encode(bit === "1" ? 1 : 0, 1);
		}
	}
	for (let distances_bit_length of distances_bit_lengths) {
		let key = lengths.keys[distances_bit_length];
		for (let bit of key) {
			bsw.encode(bit === "1" ? 1 : 0, 1);
		}
	}
	for (let byte of [...bytes, 256]) {
		let key = literals.keys[byte];
		for (let bit of key) {
			bsw.encode(bit === "1" ? 1 : 0, 1);
		}
	}
	let observed = inflate(bsw.getBuffer().buffer);
	let expected = Uint8Array.from(bytes);
	assert.equals(observed, expected);
});

wtf.test(`Inflate should throw an error when attempting to decode blocks with a reserved block type.`, async (assert) => {
	let bsw = getBSWInitialziedWithZlibHeader();
	bsw.encode(1, 1);
	bsw.encode(EncodingMethod.RESERVED, 2);
	await assert.throws(() => {
		inflate(bsw.getBuffer().buffer);
	});
});
