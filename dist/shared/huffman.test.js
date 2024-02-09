"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const huffman = require("./huffman");
const bitstreams_1 = require("./bitstreams");
const RFC_EXAMPLE = {
    symbols: {
        "010": 0,
        "011": 1,
        "100": 2,
        "101": 3,
        "110": 4,
        "00": 5,
        "1110": 6,
        "1111": 7
    },
    keys: {
        0: "010",
        1: "011",
        2: "100",
        3: "101",
        4: "110",
        5: "00",
        6: "1110",
        7: "1111"
    },
    min_bit_length: 2,
    max_bit_length: 4,
    tree: [-1, -1, -1, 5, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 6, 7, -1],
    start_offsets_lsb: {
        0: 3,
        1: 5,
        2: 4,
        3: 6
    }
};
wtf.test(`HuffmanRecord should be properly created from the example in the RFC.`, (assert) => {
    let observed = huffman.HuffmanRecord.create([3, 3, 3, 3, 3, 2, 4, 4]);
    let expected = RFC_EXAMPLE;
    assert.equals(observed, expected);
});
wtf.test(`HuffmanRecord should decode symbols using a BistreamReader.`, (assert) => {
    let bsr = new bitstreams_1.BitstreamReader(Uint8Array.of(0b01001110, 0b01011100, 0b01110111, 0b10000000));
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 0);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 1);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 2);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 3);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 4);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 5);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 6);
    assert.equals(huffman.HuffmanRecord.decodeSymbolMSB(RFC_EXAMPLE, bsr), 7);
});
