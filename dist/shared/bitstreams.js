"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitstreamWriterLSB = exports.BitstreamWriterMSB = exports.BitstreamReaderLSB = exports.BitstreamReaderMSB = exports.StreamEndError = void 0;
class StreamEndError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.StreamEndError = StreamEndError;
;
class BitstreamReaderMSB {
    bytes;
    byte_index;
    bits_left_in_byte;
    constructor(bytes) {
        this.bytes = bytes;
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
            let bits_to_decode = this.bits_left_in_byte < bits_left ? this.bits_left_in_byte : bits_left;
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
}
exports.BitstreamReaderMSB = BitstreamReaderMSB;
;
class BitstreamReaderLSB {
    bytes;
    byte_index;
    buffer;
    bits_in_buffer;
    constructor(bytes) {
        this.bytes = bytes;
        this.byte_index = 0;
        this.buffer = 0;
        this.bits_in_buffer = 0;
    }
    decode(bit_length) {
        if (bit_length < 1 || bit_length > 24) {
            throw new Error(`Expected bit length to be at least 1 and at most 24!`);
        }
        while (this.bits_in_buffer < bit_length) {
            let byte = this.bytes[this.byte_index++];
            if (byte == null) {
                throw new StreamEndError();
            }
            this.buffer |= (byte << this.bits_in_buffer);
            this.bits_in_buffer += 8;
        }
        let mask = (1 << bit_length) - 1;
        let code = this.buffer & mask;
        this.buffer >>>= bit_length;
        this.bits_in_buffer -= bit_length;
        return code;
    }
    getDecodedBitCount() {
        return (this.byte_index << 3) - this.bits_in_buffer;
    }
    skipToByteBoundary() {
        let bits_to_skip = this.bits_in_buffer & 7;
        this.buffer >>>= bits_to_skip;
        this.bits_in_buffer -= bits_to_skip;
    }
}
exports.BitstreamReaderLSB = BitstreamReaderLSB;
;
class BitstreamWriterMSB {
    bytes;
    bits_left_in_byte;
    constructor() {
        this.bytes = [];
        this.bits_left_in_byte = 0;
    }
    createBuffer() {
        return Uint8Array.from(this.bytes);
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
            let bits_to_encode = this.bits_left_in_byte < bits_left ? this.bits_left_in_byte : bits_left;
            let right_shift = bits_left - this.bits_left_in_byte;
            if (right_shift < 0) {
                right_shift = 0;
            }
            let left_shift = this.bits_left_in_byte - bits_left;
            if (left_shift < 0) {
                left_shift = 0;
            }
            let value = ((code >> right_shift) << left_shift);
            let mask = (1 << this.bits_left_in_byte) - 1;
            byte = (byte & ~mask) | (value & mask);
            this.bytes[this.bytes.length - 1] = byte;
            this.bits_left_in_byte -= bits_to_encode;
            bits_left -= bits_to_encode;
        }
    }
    getEncodedBitCount() {
        return this.bytes.length * 8 - this.bits_left_in_byte;
    }
    skipToByteBoundary() {
        this.bits_left_in_byte = 0;
    }
}
exports.BitstreamWriterMSB = BitstreamWriterMSB;
;
class BitstreamWriterLSB {
    bytes;
    bits_left_in_byte;
    constructor() {
        this.bytes = [];
        this.bits_left_in_byte = 0;
    }
    createBuffer() {
        return Uint8Array.from(this.bytes);
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
            let bits_to_encode = this.bits_left_in_byte < bits_left ? this.bits_left_in_byte : bits_left;
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
    getEncodedBitCount() {
        return this.bytes.length * 8 - this.bits_left_in_byte;
    }
    skipToByteBoundary() {
        this.bits_left_in_byte = 0;
    }
}
exports.BitstreamWriterLSB = BitstreamWriterLSB;
;
