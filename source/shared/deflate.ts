import { BitstreamReaderLSB } from "./bitstreams";
import { HuffmanRecord } from "./huffman";

export const CODE_LENGTH_CODES_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

function computeOffsets(first_offset: number, bit_lengths: Array<number>): Array<number> {
	let offsets = [] as Array<number>;
	let next_offset = first_offset;
	for (let bit_length of bit_lengths) {
		offsets.push(next_offset);
		next_offset += (1 << bit_length);
	}
	return offsets;
};

const LENGTH_EXTRA_BITS = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

// The length 258 can be encoded as symbol 284 using 5 extra bits (227+31) or as symbol 285 using 0 extra bits (258).
const LENGTH_OFFSETS = [...computeOffsets(3, LENGTH_EXTRA_BITS.slice(0, -1)), 258];

const DISTANCE_EXTRA_BITS = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

const DISTANCE_OFFSETS = computeOffsets(1, DISTANCE_EXTRA_BITS);

const STATIC_LITERALS_BIT_LENGTHS = [
	...new Array(144).fill(8),
	...new Array(112).fill(9),
	...new Array(24).fill(7),
	...new Array(8).fill(8)
];

export const STATIC_LITERALS = HuffmanRecord.create(STATIC_LITERALS_BIT_LENGTHS);

const STATIC_DISTANCES_BIT_LENGTHS = [
	...new Array(32).fill(5)
];

export const STATIC_DISTANCES = HuffmanRecord.create(STATIC_DISTANCES_BIT_LENGTHS);

export enum EncodingMethod {
	RAW = 0,
	STATIC = 1,
	DYNAMIC = 2,
	RESERVED = 3
};

export enum CompressionMethod {
	DEFLATE = 8
};

export enum CompressionLevel {
	FASTEST = 0,
	FAST = 1,
	DEFAULT = 2,
	BEST = 3
};

export function readDeflateHeader(bsr: BitstreamReaderLSB) {
	let integer = (bsr.decode(8) << 8) | (bsr.decode(8) << 0);
	let compression_method = CompressionMethod[(integer >> 8) & 0b0000_1111];
	let compression_info = (integer >> 12) & 0b0000_1111;
	let has_dictionary = (integer >> 5) & 0b0000_0001;
	let compression_level = CompressionLevel[(integer >> 6) & 0b0000_0011];
	if ((integer % 31) !== 0) {
		throw new Error(`Expected a proper deflate header!`);
	}
	let dictionary_id: number | undefined;
	if (has_dictionary) {
		dictionary_id = (bsr.decode(8) << 24) | (bsr.decode(8) << 16) | (bsr.decode(8) << 8) | (bsr.decode(8) << 0);
	}
	return {
		compression_method,
		compression_info,
		compression_level,
		dictionary_id
	};
};

export type DeflateHeader = ReturnType<typeof readDeflateHeader>;

export function inflate(buffer: ArrayBuffer): Uint8Array {
	let bsr = new BitstreamReaderLSB(new Uint8Array(buffer));
	let header = readDeflateHeader(bsr);
	if (header.compression_method !== "DEFLATE") {
		throw new Error(`Expected DEFLATE compression method!`);
	}
	let bytes = [] as Array<number>;
	let last_block = false;
	function decodeHuffmanSequence(literals: HuffmanRecord, distances: HuffmanRecord): void {
		while (true) {
			let literal_symbol = HuffmanRecord.decodeSymbol(literals, bsr);
			if (literal_symbol < 256) {
				bytes.push(literal_symbol);
			} else if (literal_symbol === 256) {
				break;
			} else if (literal_symbol <= 285) {
				literal_symbol -= 257;
				let length = LENGTH_OFFSETS[literal_symbol];
				let length_extra_bits = LENGTH_EXTRA_BITS[literal_symbol];
				if (length_extra_bits > 0) {
					length += bsr.decode(length_extra_bits);
				}
				let distance_symbol = HuffmanRecord.decodeSymbol(distances, bsr);
				if (distance_symbol <= 29) {
					let distance = DISTANCE_OFFSETS[distance_symbol];
					let distance_extra_bits = DISTANCE_EXTRA_BITS[distance_symbol];
					if (distance_extra_bits > 0) {
						distance += bsr.decode(distance_extra_bits);
					}
					for (let i = 0; i < length; i++) {
						bytes.push(bytes[bytes.length - distance]);
					}
				} else {
					throw new Error(`Expected a distance symbol <= 29!`);
				}
			} else {
				throw new Error(`Expected a literal symbol <= 285!`);
			}
		}
	}
	while (!last_block) {
		last_block = bsr.decode(1) === 1;
		let encoding_method = EncodingMethod[bsr.decode(2)];
		if (encoding_method === "RAW") {
			bsr.skipToByteBoundary();
			let length = (bsr.decode(8) << 0) | (bsr.decode(8) << 8);
			let length_complement = (bsr.decode(8) << 0) | (bsr.decode(8) << 8);
			if (length + length_complement !== 65535) {
				throw new Error(`Expected a valid raw length!`);
			}
			for (let i = 0; i < length; i++) {
				bytes.push(bsr.decode(8));
			}
		} else if (encoding_method === "STATIC") {
			decodeHuffmanSequence(STATIC_LITERALS, STATIC_DISTANCES);
		} else if (encoding_method === "DYNAMIC") {
			let number_of_literal_bit_lengths = bsr.decode(5) + 257;
			let number_of_distance_bit_lengths = bsr.decode(5) + 1;
			let number_of_length_bit_lengths = bsr.decode(4) + 4;
			let lengths_bit_lengths = new Array<number>(CODE_LENGTH_CODES_ORDER.length).fill(0);
			for (let i = 0; i < number_of_length_bit_lengths; i++) {
				lengths_bit_lengths[CODE_LENGTH_CODES_ORDER[i]] = bsr.decode(3);
			}
			let lengths = HuffmanRecord.create(lengths_bit_lengths);
			let bit_lengths = [] as Array<number>;
			while (bit_lengths.length < number_of_literal_bit_lengths + number_of_distance_bit_lengths) {
				let bit_length_symbol = HuffmanRecord.decodeSymbol(lengths, bsr);
				if (bit_length_symbol < 16) {
					bit_lengths.push(bit_length_symbol);
				} else if (bit_length_symbol === 16) {
					let bit_length = bit_lengths[bit_lengths.length - 1] as number | null;
					if (bit_length == null) {
						throw new Error(`Expected a previous bit length!`);
					}
					let repeats = bsr.decode(2) + 3;
					for (let i = 0; i < repeats; i++) {
						bit_lengths.push(bit_length);
					}
				} else if (bit_length_symbol === 17) {
					let repeats = bsr.decode(3) + 3;
					for (let i = 0; i < repeats; i++) {
						bit_lengths.push(0);
					}
				} else if (bit_length_symbol === 18) {
					let repeats = bsr.decode(7) + 11;
					for (let i = 0; i < repeats; i++) {
						bit_lengths.push(0);
					}
				} else {
					throw new Error(`Expected a bit length symbol <= 18!`);
				}
			}
			let literals_bit_lengths = bit_lengths.slice(0, number_of_literal_bit_lengths);
			let literals = HuffmanRecord.create(literals_bit_lengths);
			let distances_bit_lengths = bit_lengths.slice(number_of_literal_bit_lengths);
			let distances = HuffmanRecord.create(distances_bit_lengths);
			decodeHuffmanSequence(literals, distances);
		} else if (encoding_method === "RESERVED") {
			throw new Error(`Expected a non-reserved encoding method!`);
		}
	}
	return Uint8Array.from(bytes);
};
