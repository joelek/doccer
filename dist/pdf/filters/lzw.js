"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LZW = void 0;
const shared_1 = require("../../shared");
const CLEAR_TABLE = 256;
const END_OF_DATA = 257;
const DEBUG = false;
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
        function getNextCode() {
            try {
                return bsr.decode(bit_length);
            }
            catch (error) {
                if (!(error instanceof shared_1.StreamEndError)) {
                    throw error;
                }
            }
        }
        clearTable();
        let bsr = new shared_1.BitstreamReaderMSB(source);
        let keys = [];
        let last_key = "";
        let should_clear = false;
        while (true) {
            let code = getNextCode();
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
        let bsw = new shared_1.BitstreamWriterMSB();
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
        return bsw.createBuffer();
    }
};
