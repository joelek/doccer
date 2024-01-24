"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LZW = exports.BitstreamWriter = exports.BitstreamReader = void 0;
const CLEAR_TABLE = 256;
const END_OF_DATA = 257;
const DEBUG = false;
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
                    return;
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
}
exports.BitstreamReader = BitstreamReader;
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
}
exports.BitstreamWriter = BitstreamWriter;
;
exports.LZW = {
    decode(source) {
        let table = [];
        let dictionary = new Map();
        let bit_length = 9;
        function clearTable() {
            table = [];
            dictionary = new Map();
            for (let i = 0; i < 256; i++) {
                let key = String.fromCharCode(i);
                table.push(key);
                dictionary.set(key, table.length - 1);
            }
            table.push(""); // CLEAR_TABLE
            table.push(""); // END_OF_DATA
            bit_length = 9;
        }
        function appendTable(key, force) {
            let code = dictionary.get(key);
            if (code != null && !force) {
                return;
            }
            table.push(key);
            dictionary.set(key, table.length - 1);
            // The encoder is ahead of the decoder by one code unit.
            if (table.length + 1 === 1 << bit_length) {
                bit_length += 1;
                if (bit_length > 12) {
                    bit_length = 12;
                }
                else {
                    if (DEBUG)
                        console.log(`Decoder increasing bit length to ${bit_length} with a total of ${bsr.getDecodedBitCount()} bits decoded.`);
                }
            }
        }
        clearTable();
        let bsr = new BitstreamReader(source);
        let keys = [];
        let last_key = "";
        let should_clear = false;
        while (true) {
            let code = bsr.decode(bit_length);
            if (code == null) {
                break;
            }
            else if (code === CLEAR_TABLE) {
                if (DEBUG)
                    console.log(`Decoded CLEAR_TABLE using ${bit_length} bits with a total of ${bsr.getDecodedBitCount()} bits decoded.`);
                should_clear = true;
                bit_length = 9;
            }
            else if (code === END_OF_DATA) {
                if (DEBUG)
                    console.log(`Decoded END_OF_DATA using ${bit_length} bits with a total of ${bsr.getDecodedBitCount()} bits decoded.`);
                break;
            }
            else if (code < table.length) {
                let key = table[code];
                keys.push(key);
                let key_to_append = last_key + key[0];
                appendTable(key_to_append, false);
                if (should_clear) {
                    clearTable();
                    should_clear = false;
                }
                last_key = key;
            }
            else if (code === table.length) {
                let key_to_append = last_key + last_key[0];
                appendTable(key_to_append, false);
                if (should_clear) {
                    clearTable();
                    should_clear = false;
                }
                let key = key_to_append;
                keys.push(key);
                last_key = key_to_append;
            }
            else {
                throw new Error(`Expected code ${code} to be in table with length ${table.length}!`);
            }
        }
        let string = keys.join("");
        let buffer = Uint8Array.from([...string].map((character) => character.charCodeAt(0)));
        return buffer;
    },
    encode(source) {
        let table = [];
        let dictionary = new Map();
        let bit_length = 9;
        function clearTable() {
            table = [];
            dictionary = new Map();
            for (let i = 0; i < 256; i++) {
                let key = String.fromCharCode(i);
                table.push(key);
                dictionary.set(key, table.length - 1);
            }
            table.push(""); // CLEAR_TABLE
            table.push(""); // END_OF_DATA
            bit_length = 9;
        }
        function appendTable(key, force) {
            let code = dictionary.get(key);
            if (code != null && !force) {
                return;
            }
            table.push(key);
            dictionary.set(key, table.length - 1);
            if (table.length === 1 << bit_length) {
                bit_length += 1;
                if (bit_length > 12) {
                    bit_length = 12;
                }
                else {
                    if (DEBUG)
                        console.log(`Encoder increasing bit length to ${bit_length} with a total of ${bsw.getEncodedBitCount()} bits encoded.`);
                }
            }
        }
        let bsw = new BitstreamWriter();
        bsw.encode(CLEAR_TABLE, bit_length);
        clearTable();
        if (DEBUG)
            console.log(`Encoded CLEAR_TABLE using ${bit_length} bits with a total of ${bsw.getEncodedBitCount()} bits encoded.`);
        if (source.length > 0) {
            let last_key = "";
            let last_code = 0;
            for (let i = 0; i <= source.length; i++) {
                let key_suffix_code = source[i];
                let key_suffix = String.fromCharCode(key_suffix_code);
                let new_key = last_key + key_suffix;
                let new_code = dictionary.get(new_key);
                if (new_code != null && i < source.length) {
                    last_key = new_key;
                    last_code = new_code;
                }
                else {
                    bsw.encode(last_code, bit_length);
                    appendTable(new_key, i === source.length);
                    if (table.length === 1 << 12) {
                        bsw.encode(CLEAR_TABLE, bit_length);
                        if (DEBUG)
                            console.log(`Encoded CLEAR_TABLE using ${bit_length} bits with a total of ${bsw.getEncodedBitCount()} bits encoded.`);
                        clearTable();
                    }
                    last_key = key_suffix;
                    last_code = key_suffix_code;
                }
            }
        }
        bsw.encode(END_OF_DATA, bit_length);
        if (DEBUG)
            console.log(`Encoded END_OF_DATA using ${bit_length} bits with a total of ${bsw.getEncodedBitCount()} bits encoded.`);
        return bsw.getBuffer();
    }
};
