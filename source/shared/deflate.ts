import { BitstreamReaderLSB, BitstreamWriterLSB } from "./bitstreams";
import { HuffmanRecord } from "./huffman";

export const CODE_LENGTH_CODES_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

const CODE_LENGTH_CODES_EXTRA_BITS = [2, 3, 7];

const CODE_LENGTH_CODES_OFFSETS = [3, 3, 11];

function computeOffsets(first_offset: number, bit_lengths: Array<number>): Array<number> {
	let offsets = [] as Array<number>;
	let next_offset = first_offset;
	for (let bit_length of bit_lengths) {
		offsets.push(next_offset);
		next_offset += (1 << bit_length);
	}
	return offsets;
};

function getOffsetIndex(target_offset: number, offsets: Array<number>): number {
	let index = -1;
	for (let offset of offsets) {
		if (target_offset >= offset) {
			index += 1;
		} else {
			break;
		}
	}
	return index;
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

export type Match = {
	distance: number;
	length: number;
};

export type MatchOptions = {
	max_distance_bits: number;
	min_length: number;
	max_length: number;
	max_searches: number;
	great_match_length: number;
	good_match_length: number;
	max_matches_per_block: number;
};

export function getDistanceFromIndex(i: number, index: number, max_distance_mask: number): number {
	return ((i - (index + 1)) & max_distance_mask) + 1;
};

export function generateMatches(bytes: Uint8Array, options?: Partial<MatchOptions>): { matches: Array<number | Match>; byte_count: number; } {
	let max_distance_bits = options?.max_distance_bits ?? 15;
	let max_distance = (1 << max_distance_bits);
	let max_distance_mask = max_distance - 1;
	let min_length = options?.min_length ?? 3;
	let max_length = options?.max_length ?? 258
	let max_searches = options?.max_searches ?? 256;
	let great_match_length = options?.great_match_length ?? 16;
	let good_match_length = options?.good_match_length ?? 8;
	let max_matches_per_block = options?.max_matches_per_block ?? 16384;
	let jump_table = new Array<number>(max_distance).fill(-1);
	let head_indices = new Array<number>(65536).fill(-1);
	let tail_indices = new Array<number>(65536).fill(-1);
	let top_of_stack = 0;
	let i = 0;
	let matches = [] as Array<number | Match>;
	let byte_count = 0;
	function updateSearchIndices(): void {
		// Data will always be overwritten once the history buffer is completely full.
		if (i >= max_distance) {
			let j = i - max_distance;
			let byte_a = bytes[j];
			let byte_b = bytes[j + 1];
			let hash = (byte_a << 8) | byte_b;
			let head_index = head_indices[hash];
			head_indices[hash] = jump_table[head_index];
			let tail_index = tail_indices[hash];
			if (tail_index === head_index) {
				tail_indices[hash] = -1;
			}
		}
		jump_table[top_of_stack] = -1;
		let byte_a = bytes[i];
		let byte_b = bytes[i + 1];
		let hash = (byte_a << 8) | byte_b;
		let tail_index = tail_indices[hash];
		if (tail_index !== -1) {
			jump_table[tail_index] = top_of_stack;
		} else {
			head_indices[hash] = top_of_stack;
		}
		tail_indices[hash] = top_of_stack;
		i += 1;
		top_of_stack = i & max_distance_mask;
	}
	for (let l = bytes.length - min_length + 1; i < l;) {
		let match: Match | undefined;
		let byte_a = bytes[i];
		let byte_b = bytes[i + 1];
		let hash = (byte_a << 8) | byte_b;
		let index = head_indices[hash];
		let searches = 0;
		let active_max_searches = max_searches;
		while (index !== -1 && searches < active_max_searches) {
			let distance = ((i - (index + 1)) & max_distance_mask) + 1;
			let length = 2;
			let j = i - distance;
			if (bytes[j + length] === bytes[i + length]) {
				length += 1;
				let max_local_length = bytes.length - j;
				let active_max_length = max_local_length < max_length ? max_local_length : max_length;
				for (; length < active_max_length; length++) {
					if (bytes[j + length] !== bytes[i + length]) {
						break;
					}
				}
				if (length >= min_length) {
					if (match == null) {
						match = {
							distance,
							length
						};
					} else {
						if (length > match.length) {
							match.distance = distance;
							match.length = length;
						}
					}
					if (length >= great_match_length) {
						break;
					}
					if (length >= good_match_length) {
						active_max_searches >>= 1;
					}
				}
			}
			index = jump_table[index];
			searches += 1;
		}
		if (match == null) {
			matches.push(byte_a);
			byte_count += 1;
			if (matches.length >= max_matches_per_block) {
				return { matches, byte_count };
			}
			updateSearchIndices();
		} else {
			matches.push(match);
			byte_count += match.length;
			if (matches.length >= max_matches_per_block) {
				return { matches, byte_count };
			}
			for (let j = 0, l = match.length; j < l; j++) {
				updateSearchIndices();
			}
		}
	}
	for (let l = bytes.length; i < l;) {
		let byte = bytes[i++];
		matches.push(byte);
		byte_count += 1;
		if (matches.length >= max_matches_per_block) {
			return { matches, byte_count };
		}
	}
	return { matches, byte_count };
};

export function getInitializedBSW(): BitstreamWriterLSB {
	let checksum = 0;
	let bsw = new BitstreamWriterLSB();
	bsw.encode(CompressionMethod.DEFLATE, 4);
	bsw.encode(7, 4);
	bsw.encode(checksum, 5);
	bsw.encode(0, 1);
	bsw.encode(CompressionLevel.DEFAULT, 2);
	let bytes = bsw.createBuffer();
	let integer = (bytes[0] << 8) | (bytes[1] << 0);
	let remainder = integer % 31;
	if (remainder !== 0) {
		checksum = 31 - remainder;
		(bsw as any).bytes[1] |= checksum;
	}
	return bsw;
};

export function computeAdler32(buffer: Uint8Array): number {
	let modulo = 65521;
	let a = 1;
	let b = 0;
	for (let i = 0, l = buffer.length; i < l;) {
		// Process buffer in chunks of at most 2654 bytes.
		let k = l - i < 2654 ? l - i : 2654;
		for (let j = i + k; i < j; i++) {
			a += buffer[i];
			b += a;
		}
		a = 15 * (a >>> 16) + (a & 0xFFFF);
		b = 15 * (b >>> 16) + (b & 0xFFFF);
	}
	a %= modulo;
	b %= modulo;
	return ((b << 16) | a) >>> 0;
};

export function writeAdler32Checksum(bsw: BitstreamWriterLSB, checksum: number): void {
	bsw.encode((checksum >> 24) & 0xFF, 8);
	bsw.encode((checksum >> 16) & 0xFF, 8);
	bsw.encode((checksum >> 8) & 0xFF, 8);
	bsw.encode((checksum >> 0) & 0xFF, 8);
};

export function readAdler32Checksum(bsr: BitstreamReaderLSB): number {
	return ((bsr.decode(8) << 24) | (bsr.decode(8) << 16) | (bsr.decode(8) << 8) | (bsr.decode(8) << 0)) >>> 0;
};

export function getBitLengthsFromHistogram(histogram: Array<number>): Array<number> {
	let entries = histogram.map((frequency, index) => ({
		index,
		frequency
	}));
	entries = entries.filter((entry) => entry.frequency > 0);
	entries = entries.sort((one, two) => two.frequency - one.frequency);
	let bit_lengths = new Array<number>(histogram.length).fill(0);
	let active_bit_length = 1;
	let free_slots_at_level = 2;
	let total_remaining = entries.reduce((sum, entry) => sum + entry.frequency, 0);
	for (let i = 0, l = entries.length; i < l;) {
		let { index, frequency } = entries[i];
		let entries_left = l - i;
		let free_slots_at_next_level = free_slots_at_level << 1;
		let slots_available_at_level = free_slots_at_next_level - entries_left;
		let entry_is_dense = frequency >= total_remaining - frequency;
		if (free_slots_at_level > 1 && entry_is_dense) {
			bit_lengths[index] = active_bit_length;
			total_remaining -= frequency;
			i += 1;
			free_slots_at_level -= 1;
		} else if (slots_available_at_level > 0) {
			bit_lengths[index] = active_bit_length;
			total_remaining -= frequency;
			i += 1;
			free_slots_at_level -= 1;
		} else {
			active_bit_length += 1;
			free_slots_at_level <<= 1;
		}
	}
	return bit_lengths;
};

export function createBitLengthEncoding(bit_lengths: Array<number>): Array<number | { code: 16 | 17 | 18; length: number; }> {
	let encoding = [] as Array<number | { code: 16 | 17 | 18; length: number; }>;
	for (let i = 0, l = bit_lengths.length; i < l;) {
		let bit_length = bit_lengths[i];
		let length = 1;
		let min_length = bit_length === 0 ? 3 : 4;
		let max_length = bit_length === 0 ? 138 : 6;
		let max_local_length = l - i;
		let active_max_length = max_local_length < max_length ? max_local_length : max_length;
		for (; length < active_max_length; length++) {
			if (bit_lengths[i + length] !== bit_length) {
				break;
			}
		}
		if (length >= min_length) {
			if (bit_length === 0) {
				if (length >= 11) {
					encoding.push({ code: 18, length: length });
				} else {
					encoding.push({ code: 17, length: length });
				}
			} else {
				encoding.push(bit_length);
				encoding.push({ code: 16, length: length - 1 });
			}
		} else {
			for (let j = 0; j < length; j++) {
				encoding.push(bit_length);
			}
		}
		i += length;
	}
	return encoding;
};

export function deflate(buffer: ArrayBuffer): Uint8Array {
	let encodeSymbolLSB = HuffmanRecord.encodeSymbolLSB;
	let bytes = new Uint8Array(buffer);
	let bsw = getInitializedBSW();
	function encodeMatches(matches: Array<number | Match>, bsw: BitstreamWriterLSB, literals: HuffmanRecord, distances: HuffmanRecord): void {
		for (let i = 0, l = matches.length; i < l; i++) {
			let match = matches[i];
			if (typeof match === "number") {
				encodeSymbolLSB(literals, bsw, match);
			} else {
				let length_index = getOffsetIndex(match.length, LENGTH_OFFSETS);
				let length_offset = LENGTH_OFFSETS[length_index];
				let length_extra_bits = LENGTH_EXTRA_BITS[length_index];
				encodeSymbolLSB(literals, bsw, 257 + length_index);
				if (length_extra_bits > 0) {
					bsw.encode(match.length - length_offset, length_extra_bits);
				}
				let distance_index = getOffsetIndex(match.distance, DISTANCE_OFFSETS);
				let distance_offset = DISTANCE_OFFSETS[distance_index];
				let distance_extra_bits = DISTANCE_EXTRA_BITS[distance_index];
				encodeSymbolLSB(distances, bsw, distance_index);
				if (distance_extra_bits > 0) {
					bsw.encode(match.distance - distance_offset, distance_extra_bits);
				}
			}
		}
		encodeSymbolLSB(literals, bsw, 256);
	}
	function flushMatches(matches: Array<number | Match>, last_block: boolean): void {
		let literals_histogram = new Array<number>(257 + LENGTH_OFFSETS.length).fill(0);
		let distances_histogram = new Array<number>(DISTANCE_OFFSETS.length).fill(0);
		let dynamic_bit_count = 3 + 5 + 5 + 4;
		for (let i = 0, l = matches.length; i < l; i++) {
			let match = matches[i];
			if (typeof match === "number") {
				literals_histogram[match] += 1;
			} else {
				let length_index = getOffsetIndex(match.length, LENGTH_OFFSETS);
				let length_extra_bits = LENGTH_EXTRA_BITS[length_index];
				dynamic_bit_count += length_extra_bits;
				literals_histogram[257 + length_index] += 1;
				let distance_index = getOffsetIndex(match.distance, DISTANCE_OFFSETS);
				let distance_extra_bits = DISTANCE_EXTRA_BITS[distance_index];
				dynamic_bit_count += distance_extra_bits;
				distances_histogram[distance_index] += 1;
			}
		}
		literals_histogram[256] += 1;
		let literals_bit_lengths = getBitLengthsFromHistogram(literals_histogram);
		dynamic_bit_count += literals_histogram.reduce((sum, frequency, index) => sum + frequency * literals_bit_lengths[index], 0);
		let number_of_literal_bit_lengths = 257;
		for (let i = number_of_literal_bit_lengths, l = literals_bit_lengths.length; i < l; i++) {
			if (literals_bit_lengths[i] !== 0) {
				number_of_literal_bit_lengths = i + 1;
			}
		}
		let distances_bit_lengths = getBitLengthsFromHistogram(distances_histogram);
		dynamic_bit_count += distances_histogram.reduce((sum, frequency, index) => sum + frequency * distances_bit_lengths[index], 0);
		let number_of_distance_bit_lengths = 1;
		for (let i = number_of_distance_bit_lengths, l = distances_bit_lengths.length; i < l; i++) {
			if (distances_bit_lengths[i] !== 0) {
				number_of_distance_bit_lengths = i + 1;
			}
		}
		let bit_lengths = [
			...literals_bit_lengths.slice(0, number_of_literal_bit_lengths),
			...distances_bit_lengths.slice(0, number_of_distance_bit_lengths)
		];
		let bit_lengths_encoding = createBitLengthEncoding(bit_lengths);
		let bit_lengths_histogram = new Array<number>(CODE_LENGTH_CODES_ORDER.length).fill(0);
		for (let i = 0, l = bit_lengths_encoding.length; i < l; i++) {
			let encoding = bit_lengths_encoding[i];
			if (typeof encoding === "number") {
				bit_lengths_histogram[encoding] += 1;
			} else {
				let index = encoding.code - 16;
				dynamic_bit_count += CODE_LENGTH_CODES_EXTRA_BITS[index];
				bit_lengths_histogram[encoding.code] += 1;
			}
		}
		let lengths_bit_lengths = getBitLengthsFromHistogram(bit_lengths_histogram);
		dynamic_bit_count += bit_lengths_histogram.reduce((sum, frequency, index) => sum + frequency * lengths_bit_lengths[index], 0);
		let number_of_length_bit_lengths = 4;
		for (let i = number_of_length_bit_lengths, l = lengths_bit_lengths.length; i < l; i++) {
			if (lengths_bit_lengths[CODE_LENGTH_CODES_ORDER[i]] !== 0) {
				number_of_length_bit_lengths = i + 1;
			}
		}
		dynamic_bit_count += number_of_length_bit_lengths + number_of_length_bit_lengths + number_of_length_bit_lengths;
		let static_bit_count = 3;
		static_bit_count += literals_histogram.reduce((sum, frequency, index) => sum + frequency * STATIC_LITERALS_BIT_LENGTHS[index], 0);
		static_bit_count += distances_histogram.reduce((sum, frequency, index) => sum + frequency * STATIC_DISTANCES_BIT_LENGTHS[index], 0);
		if (dynamic_bit_count < static_bit_count) {
			let literals = HuffmanRecord.create(literals_bit_lengths);
			let distances = HuffmanRecord.create(distances_bit_lengths);
			let lengths = HuffmanRecord.create(lengths_bit_lengths);
			bsw.encode(last_block ? 1 : 0, 1);
			bsw.encode(EncodingMethod.DYNAMIC, 2);
			bsw.encode(number_of_literal_bit_lengths - 257, 5);
			bsw.encode(number_of_distance_bit_lengths - 1, 5);
			bsw.encode(number_of_length_bit_lengths - 4, 4);
			for (let i = 0, l = number_of_length_bit_lengths; i < l; i++) {
				bsw.encode(lengths_bit_lengths[CODE_LENGTH_CODES_ORDER[i]], 3);
			}
			for (let i = 0, l = bit_lengths_encoding.length; i < l; i++) {
				let encoding = bit_lengths_encoding[i];
				if (typeof encoding === "number") {
					encodeSymbolLSB(lengths, bsw, encoding);
				} else {
					let index = encoding.code - 16;
					let offset = CODE_LENGTH_CODES_OFFSETS[index];
					let extra_bits = CODE_LENGTH_CODES_EXTRA_BITS[index];
					encodeSymbolLSB(lengths, bsw, encoding.code);
					if (extra_bits > 0) {
						bsw.encode(encoding.length - offset, extra_bits);
					}
				}
			}
			encodeMatches(matches, bsw, literals, distances);
		} else {
			bsw.encode(last_block ? 1 : 0, 1);
			bsw.encode(EncodingMethod.STATIC, 2);
			encodeMatches(matches, bsw, STATIC_LITERALS, STATIC_DISTANCES);
		}
	}
	if (bytes.length > 0) {
		let byte_index = 0;
		for (let l = bytes.length; byte_index < l;) {
			let { matches, byte_count } = generateMatches(bytes.subarray(byte_index));
			byte_index += byte_count;
			flushMatches(matches, byte_index >= l);
		}
	} else {
		flushMatches([], true);
	}
	bsw.skipToByteBoundary();
	let checksum = computeAdler32(bytes);
	writeAdler32Checksum(bsw, checksum);
	return bsw.createBuffer();
};

export function inflate(buffer: ArrayBuffer): Uint8Array {
	let bsr = new BitstreamReaderLSB(new Uint8Array(buffer));
	let header = readDeflateHeader(bsr);
	if (header.compression_method !== "DEFLATE") {
		throw new Error(`Expected DEFLATE compression method!`);
	}
	let bytes = [] as Array<number>;
	let last_block = false;
	let decodeSymbolLSB = HuffmanRecord.decodeSymbolLSB;
	function decodeHuffmanSequence(literals: HuffmanRecord, distances: HuffmanRecord): void {
		while (true) {
			let code = decodeSymbolLSB(literals, bsr);
			if (code < 256) {
				bytes.push(code);
			} else if (code === 256) {
				break;
			} else if (code <= 285) {
				let literal_symbol = code - 257;
				let length = LENGTH_OFFSETS[literal_symbol];
				let length_extra_bits = LENGTH_EXTRA_BITS[literal_symbol];
				if (length_extra_bits > 0) {
					length += bsr.decode(length_extra_bits);
				}
				let distance_symbol = decodeSymbolLSB(distances, bsr);
				if (distance_symbol <= 29) {
					let distance = DISTANCE_OFFSETS[distance_symbol];
					let distance_extra_bits = DISTANCE_EXTRA_BITS[distance_symbol];
					if (distance_extra_bits > 0) {
						distance += bsr.decode(distance_extra_bits);
					}
					for (let i = bytes.length - distance, e = i + length; i < e; i++) {
						bytes.push(bytes[i]);
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
				let bit_length_symbol = decodeSymbolLSB(lengths, bsr);
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
	bsr.skipToByteBoundary();
	let result = Uint8Array.from(bytes);
	let computed_checksum = computeAdler32(result);
	let checksum = readAdler32Checksum(bsr);
	if (checksum !== computed_checksum) {
		throw new Error(`Expected a valid checksum!`);
	}
	return result;
};
