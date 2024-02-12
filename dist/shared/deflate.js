"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inflate = exports.deflate = exports.readAdler32Checksum = exports.writeAdler32Checksum = exports.computeAdler32 = exports.getInitializedBSW = exports.generateMatches = exports.getDistanceFromIndex = exports.readDeflateHeader = exports.CompressionLevel = exports.CompressionMethod = exports.EncodingMethod = exports.STATIC_DISTANCES = exports.STATIC_LITERALS = exports.CODE_LENGTH_CODES_ORDER = void 0;
const bitstreams_1 = require("./bitstreams");
const huffman_1 = require("./huffman");
exports.CODE_LENGTH_CODES_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
function computeOffsets(first_offset, bit_lengths) {
    let offsets = [];
    let next_offset = first_offset;
    for (let bit_length of bit_lengths) {
        offsets.push(next_offset);
        next_offset += (1 << bit_length);
    }
    return offsets;
}
;
function getOffsetIndex(target_offset, offsets) {
    let index = -1;
    for (let offset of offsets) {
        if (target_offset >= offset) {
            index += 1;
        }
        else {
            break;
        }
    }
    return index;
}
;
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
exports.STATIC_LITERALS = huffman_1.HuffmanRecord.create(STATIC_LITERALS_BIT_LENGTHS);
const STATIC_DISTANCES_BIT_LENGTHS = [
    ...new Array(32).fill(5)
];
exports.STATIC_DISTANCES = huffman_1.HuffmanRecord.create(STATIC_DISTANCES_BIT_LENGTHS);
var EncodingMethod;
(function (EncodingMethod) {
    EncodingMethod[EncodingMethod["RAW"] = 0] = "RAW";
    EncodingMethod[EncodingMethod["STATIC"] = 1] = "STATIC";
    EncodingMethod[EncodingMethod["DYNAMIC"] = 2] = "DYNAMIC";
    EncodingMethod[EncodingMethod["RESERVED"] = 3] = "RESERVED";
})(EncodingMethod = exports.EncodingMethod || (exports.EncodingMethod = {}));
;
var CompressionMethod;
(function (CompressionMethod) {
    CompressionMethod[CompressionMethod["DEFLATE"] = 8] = "DEFLATE";
})(CompressionMethod = exports.CompressionMethod || (exports.CompressionMethod = {}));
;
var CompressionLevel;
(function (CompressionLevel) {
    CompressionLevel[CompressionLevel["FASTEST"] = 0] = "FASTEST";
    CompressionLevel[CompressionLevel["FAST"] = 1] = "FAST";
    CompressionLevel[CompressionLevel["DEFAULT"] = 2] = "DEFAULT";
    CompressionLevel[CompressionLevel["BEST"] = 3] = "BEST";
})(CompressionLevel = exports.CompressionLevel || (exports.CompressionLevel = {}));
;
function readDeflateHeader(bsr) {
    let integer = (bsr.decode(8) << 8) | (bsr.decode(8) << 0);
    let compression_method = CompressionMethod[(integer >> 8) & 0b0000_1111];
    let compression_info = (integer >> 12) & 0b0000_1111;
    let has_dictionary = (integer >> 5) & 0b0000_0001;
    let compression_level = CompressionLevel[(integer >> 6) & 0b0000_0011];
    if ((integer % 31) !== 0) {
        throw new Error(`Expected a proper deflate header!`);
    }
    let dictionary_id;
    if (has_dictionary) {
        dictionary_id = (bsr.decode(8) << 24) | (bsr.decode(8) << 16) | (bsr.decode(8) << 8) | (bsr.decode(8) << 0);
    }
    return {
        compression_method,
        compression_info,
        compression_level,
        dictionary_id
    };
}
exports.readDeflateHeader = readDeflateHeader;
;
function getDistanceFromIndex(i, index, max_distance_mask) {
    return ((i - (index + 1)) & max_distance_mask) + 1;
}
exports.getDistanceFromIndex = getDistanceFromIndex;
;
function* generateMatches(bytes, options) {
    let max_distance_bits = options?.max_distance_bits ?? 15;
    let max_distance = (1 << max_distance_bits);
    let max_distance_mask = max_distance - 1;
    let min_length = options?.min_length ?? 3;
    let max_length = options?.max_length ?? 258;
    let max_searches = options?.max_searches ?? 256;
    let great_match_length = options?.great_match_length ?? 16;
    let good_match_length = options?.good_match_length ?? 8;
    let jump_table = new Array(max_distance).fill(-1);
    let head_indices = new Array(65536).fill(-1);
    let tail_indices = new Array(65536).fill(-1);
    let top_of_stack = 0;
    let i = 0;
    function updateSearchIndices() {
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
        }
        else {
            head_indices[hash] = top_of_stack;
        }
        tail_indices[hash] = top_of_stack;
        i += 1;
        top_of_stack = i & max_distance_mask;
    }
    for (let l = bytes.length - min_length + 1; i < l;) {
        let match;
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
                    }
                    else {
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
            yield byte_a;
            updateSearchIndices();
        }
        else {
            yield match;
            for (let j = 0, l = match.length; j < l; j++) {
                updateSearchIndices();
            }
        }
    }
    for (let l = bytes.length; i < l;) {
        let byte = bytes[i++];
        yield byte;
    }
}
exports.generateMatches = generateMatches;
;
function getInitializedBSW() {
    let checksum = 0;
    let bsw = new bitstreams_1.BitstreamWriterLSB();
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
        bsw.bytes[1] |= checksum;
    }
    return bsw;
}
exports.getInitializedBSW = getInitializedBSW;
;
function computeAdler32(buffer) {
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
}
exports.computeAdler32 = computeAdler32;
;
function writeAdler32Checksum(bsw, checksum) {
    bsw.encode((checksum >> 24) & 0xFF, 8);
    bsw.encode((checksum >> 16) & 0xFF, 8);
    bsw.encode((checksum >> 8) & 0xFF, 8);
    bsw.encode((checksum >> 0) & 0xFF, 8);
}
exports.writeAdler32Checksum = writeAdler32Checksum;
;
function readAdler32Checksum(bsr) {
    return ((bsr.decode(8) << 24) | (bsr.decode(8) << 16) | (bsr.decode(8) << 8) | (bsr.decode(8) << 0)) >>> 0;
}
exports.readAdler32Checksum = readAdler32Checksum;
;
function deflate(buffer) {
    let bytes = new Uint8Array(buffer);
    let bsw = getInitializedBSW();
    bsw.encode(1, 1);
    bsw.encode(EncodingMethod.STATIC, 2);
    let encodeSymbolLSB = huffman_1.HuffmanRecord.encodeSymbolLSB;
    for (let match of generateMatches(bytes)) {
        if (typeof match === "number") {
            encodeSymbolLSB(exports.STATIC_LITERALS, bsw, match);
        }
        else {
            let length_index = getOffsetIndex(match.length, LENGTH_OFFSETS);
            let length_offset = LENGTH_OFFSETS[length_index];
            let length_extra_bits = LENGTH_EXTRA_BITS[length_index];
            encodeSymbolLSB(exports.STATIC_LITERALS, bsw, 257 + length_index);
            if (length_extra_bits > 0) {
                bsw.encode(match.length - length_offset, length_extra_bits);
            }
            let distance_index = getOffsetIndex(match.distance, DISTANCE_OFFSETS);
            let distance_offset = DISTANCE_OFFSETS[distance_index];
            let distance_extra_bits = DISTANCE_EXTRA_BITS[distance_index];
            encodeSymbolLSB(exports.STATIC_DISTANCES, bsw, distance_index);
            if (distance_extra_bits > 0) {
                bsw.encode(match.distance - distance_offset, distance_extra_bits);
            }
        }
    }
    encodeSymbolLSB(exports.STATIC_LITERALS, bsw, 256);
    bsw.skipToByteBoundary();
    let checksum = computeAdler32(bytes);
    writeAdler32Checksum(bsw, checksum);
    return bsw.createBuffer();
}
exports.deflate = deflate;
;
function inflate(buffer) {
    let bsr = new bitstreams_1.BitstreamReaderLSB(new Uint8Array(buffer));
    let header = readDeflateHeader(bsr);
    if (header.compression_method !== "DEFLATE") {
        throw new Error(`Expected DEFLATE compression method!`);
    }
    let bytes = [];
    let last_block = false;
    let decodeSymbolLSB = huffman_1.HuffmanRecord.decodeSymbolLSB;
    function decodeHuffmanSequence(literals, distances) {
        while (true) {
            let code = decodeSymbolLSB(literals, bsr);
            if (code < 256) {
                bytes.push(code);
            }
            else if (code === 256) {
                break;
            }
            else if (code <= 285) {
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
                }
                else {
                    throw new Error(`Expected a distance symbol <= 29!`);
                }
            }
            else {
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
        }
        else if (encoding_method === "STATIC") {
            decodeHuffmanSequence(exports.STATIC_LITERALS, exports.STATIC_DISTANCES);
        }
        else if (encoding_method === "DYNAMIC") {
            let number_of_literal_bit_lengths = bsr.decode(5) + 257;
            let number_of_distance_bit_lengths = bsr.decode(5) + 1;
            let number_of_length_bit_lengths = bsr.decode(4) + 4;
            let lengths_bit_lengths = new Array(exports.CODE_LENGTH_CODES_ORDER.length).fill(0);
            for (let i = 0; i < number_of_length_bit_lengths; i++) {
                lengths_bit_lengths[exports.CODE_LENGTH_CODES_ORDER[i]] = bsr.decode(3);
            }
            let lengths = huffman_1.HuffmanRecord.create(lengths_bit_lengths);
            let bit_lengths = [];
            while (bit_lengths.length < number_of_literal_bit_lengths + number_of_distance_bit_lengths) {
                let bit_length_symbol = decodeSymbolLSB(lengths, bsr);
                if (bit_length_symbol < 16) {
                    bit_lengths.push(bit_length_symbol);
                }
                else if (bit_length_symbol === 16) {
                    let bit_length = bit_lengths[bit_lengths.length - 1];
                    if (bit_length == null) {
                        throw new Error(`Expected a previous bit length!`);
                    }
                    let repeats = bsr.decode(2) + 3;
                    for (let i = 0; i < repeats; i++) {
                        bit_lengths.push(bit_length);
                    }
                }
                else if (bit_length_symbol === 17) {
                    let repeats = bsr.decode(3) + 3;
                    for (let i = 0; i < repeats; i++) {
                        bit_lengths.push(0);
                    }
                }
                else if (bit_length_symbol === 18) {
                    let repeats = bsr.decode(7) + 11;
                    for (let i = 0; i < repeats; i++) {
                        bit_lengths.push(0);
                    }
                }
                else {
                    throw new Error(`Expected a bit length symbol <= 18!`);
                }
            }
            let literals_bit_lengths = bit_lengths.slice(0, number_of_literal_bit_lengths);
            let literals = huffman_1.HuffmanRecord.create(literals_bit_lengths);
            let distances_bit_lengths = bit_lengths.slice(number_of_literal_bit_lengths);
            let distances = huffman_1.HuffmanRecord.create(distances_bit_lengths);
            decodeHuffmanSequence(literals, distances);
        }
        else if (encoding_method === "RESERVED") {
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
}
exports.inflate = inflate;
;
