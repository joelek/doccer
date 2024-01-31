"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitstreamWriterLSB = exports.BitstreamWriter = exports.BitstreamReaderLSB = exports.BitstreamReader = exports.StreamEndError = void 0;
class StreamEndError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.StreamEndError = StreamEndError;
;
class BitstreamReader {
    bytes;
    byte_index;
    bits_left_in_byte;
    constructor(bytes) {
        this.bytes = Array.from(bytes);
        this.byte_index = 0;
        this.bits_left_in_byte = bytes.length > 0 ? 8 : 0;
    }
    decode(bit_length) {
        if (bit_length < 1 || bit_length > 24) {
            throw new Error(`Expected bit length to be at least 1 and at most 24!`);
        }
        let bits_left = bit_length;
        let code = 0;
        while (bits_left > 0) {
            if (this.bits_left_in_byte === 0) {
                this.byte_index += 1;
                this.bits_left_in_byte = 8;
                if (this.byte_index >= this.bytes.length) {
                    if (bits_left === bit_length) {
                        throw new StreamEndError();
                    }
                    else {
                        throw new Error(`Expected stream to contain additional bits!`);
                    }
                }
            }
            let bits_to_decode = Math.min(this.bits_left_in_byte, bits_left);
            let byte = this.bytes[this.byte_index];
            let mask = (1 << bits_to_decode) - 1;
            let right_shift = this.bits_left_in_byte - bits_to_decode;
            let left_shift = bits_left - bits_to_decode;
            let bits_to_embed = ((byte >> right_shift) & mask) << left_shift;
            code |= bits_to_embed;
            bits_left -= bits_to_decode;
            this.bits_left_in_byte -= bits_to_decode;
        }
        return code;
    }
    getDecodedBitCount() {
        return this.byte_index * 8 + (8 - this.bits_left_in_byte);
    }
    skipToByteBoundary() {
        this.bits_left_in_byte = 0;
    }
    skipBytes(bytes) {
        if (this.bits_left_in_byte !== 0) {
            throw new Error(`Expected bitstream to be positioned at a byte boundary!`);
        }
        this.byte_index += bytes;
    }
}
exports.BitstreamReader = BitstreamReader;
;
class BitstreamReaderLSB extends BitstreamReader {
    constructor(bytes) {
        super(bytes);
    }
    decode(bit_length) {
        if (bit_length < 1 || bit_length > 24) {
            throw new Error(`Expected bit length to be at least 1 and at most 24!`);
        }
        let bits_left = bit_length;
        let code = 0;
        while (bits_left > 0) {
            if (this.bits_left_in_byte === 0) {
                this.byte_index += 1;
                this.bits_left_in_byte = 8;
                if (this.byte_index >= this.bytes.length) {
                    if (bits_left === bit_length) {
                        throw new StreamEndError();
                    }
                    else {
                        throw new Error(`Expected stream to contain additional bits!`);
                    }
                }
            }
            let bits_to_decode = Math.min(this.bits_left_in_byte, bits_left);
            let byte = this.bytes[this.byte_index];
            let mask = (1 << bits_to_decode) - 1;
            let right_shift = 8 - this.bits_left_in_byte;
            let left_shift = bit_length - bits_left;
            let bits_to_embed = ((byte >> right_shift) & mask) << left_shift;
            code |= bits_to_embed;
            bits_left -= bits_to_decode;
            this.bits_left_in_byte -= bits_to_decode;
        }
        return code;
    }
}
exports.BitstreamReaderLSB = BitstreamReaderLSB;
;
class BitstreamWriter {
    bytes;
    bits_left_in_byte;
    constructor() {
        this.bytes = [];
        this.bits_left_in_byte = 0;
    }
    encode(code, bit_length) {
        if (code < 0 || code > (1 << bit_length) - 1) {
            throw new Error(`Expected code (${code}) to be at least 0 and at most ${(1 << bit_length) - 1}!`);
        }
        if (bit_length < 1 || bit_length > 24) {
            throw new Error(`Expected bit length to be at least 1 and at most 24!`);
        }
        let bits_left = bit_length;
        while (bits_left > 0) {
            if (this.bits_left_in_byte === 0) {
                this.bytes.push(0);
                this.bits_left_in_byte = 8;
            }
            let byte = this.bytes[this.bytes.length - 1];
            let bits_to_encode = Math.min(this.bits_left_in_byte, bits_left);
            let right_shift = Math.max(0, bits_left - this.bits_left_in_byte);
            let left_shift = Math.max(0, this.bits_left_in_byte - bits_left);
            let value = ((code >> right_shift) << left_shift);
            let mask = (1 << this.bits_left_in_byte) - 1;
            byte = (byte & ~mask) | (value & mask);
            this.bytes[this.bytes.length - 1] = byte;
            this.bits_left_in_byte -= bits_to_encode;
            bits_left -= bits_to_encode;
        }
    }
    getBuffer() {
        return Uint8Array.from(this.bytes);
    }
    getEncodedBitCount() {
        return this.bytes.length * 8 - this.bits_left_in_byte;
    }
    skipToByteBoundary() {
        this.bits_left_in_byte = 0;
    }
}
exports.BitstreamWriter = BitstreamWriter;
;
class BitstreamWriterLSB extends BitstreamWriter {
    constructor() {
        super();
    }
    encode(code, bit_length) {
        if (code < 0 || code > (1 << bit_length) - 1) {
            throw new Error(`Expected code (${code}) to be at least 0 and at most ${(1 << bit_length) - 1}!`);
        }
        if (bit_length < 1 || bit_length > 24) {
            throw new Error(`Expected bit length to be at least 1 and at most 24!`);
        }
        let bits_left = bit_length;
        while (bits_left > 0) {
            if (this.bits_left_in_byte === 0) {
                this.bytes.push(0);
                this.bits_left_in_byte = 8;
            }
            let byte = this.bytes[this.bytes.length - 1];
            let bits_to_encode = Math.min(this.bits_left_in_byte, bits_left);
            let bits_used_in_byte = 8 - this.bits_left_in_byte;
            let bits_encoded = bit_length - bits_left;
            let right_shift = bits_encoded;
            let mask = (1 << bits_to_encode) - 1;
            let left_shift = bits_used_in_byte;
            byte = (((code >> right_shift) & mask) << left_shift) | byte;
            this.bytes[this.bytes.length - 1] = byte;
            this.bits_left_in_byte -= bits_to_encode;
            bits_left -= bits_to_encode;
        }
    }
}
exports.BitstreamWriterLSB = BitstreamWriterLSB;
;
