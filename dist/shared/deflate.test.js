"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chunk_1 = require("@joelek/ts-stdlib/dist/lib/data/chunk");
const wtf = require("@joelek/wtf");
const deflate_1 = require("./deflate");
const huffman_1 = require("./huffman");
function range(first_value, delta_value, steps) {
    let range = [];
    let next_value = first_value;
    for (let i = 0; i < steps; i++) {
        range.push(next_value);
        next_value += delta_value;
    }
    return range;
}
;
wtf.test(`Distances should be properly computed from indices.`, async (assert) => {
    assert.equals((0, deflate_1.getDistanceFromIndex)(1, 0, 1), 1);
    assert.equals((0, deflate_1.getDistanceFromIndex)(2, 0, 2), 2);
    assert.equals((0, deflate_1.getDistanceFromIndex)(2, 1, 2), 1);
    assert.equals((0, deflate_1.getDistanceFromIndex)(3, 0, 3), 3);
    assert.equals((0, deflate_1.getDistanceFromIndex)(3, 1, 3), 2);
    assert.equals((0, deflate_1.getDistanceFromIndex)(3, 2, 3), 1);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 0, 0), 4);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 1, 0), 3);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 2, 0), 2);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 3, 0), 1);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 1, 1), 4);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 2, 1), 3);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 3, 1), 2);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 0, 1), 1);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 2, 2), 4);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 3, 2), 3);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 0, 2), 2);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 1, 2), 1);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 3, 3), 4);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 0, 3), 3);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 1, 3), 2);
    assert.equals((0, deflate_1.getDistanceFromIndex)(4, 2, 3), 1);
});
wtf.test(`Inflate should inflate zlib streams containing raw blocks.`, (assert) => {
    let bsw = (0, deflate_1.getInitializedBSW)();
    bsw.encode(1, 1);
    bsw.encode(deflate_1.EncodingMethod.RAW, 2);
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
    (0, deflate_1.writeAdler32Checksum)(bsw, (0, deflate_1.computeAdler32)(Uint8Array.from(bytes)));
    let observed = (0, deflate_1.inflate)(bsw.getBuffer().buffer);
    let expected = Uint8Array.from(bytes);
    assert.equals(observed, expected);
});
wtf.test(`Inflate should inflate zlib streams containing blocks encoding using static huffman tables.`, (assert) => {
    let bsw = (0, deflate_1.getInitializedBSW)();
    bsw.encode(1, 1);
    bsw.encode(deflate_1.EncodingMethod.STATIC, 2);
    let length = 257;
    let bytes = range(0, 1, length).map((index) => index % 256);
    for (let byte of [...bytes, 256]) {
        let key = deflate_1.STATIC_LITERALS.keys[byte];
        for (let bit of key) {
            bsw.encode(bit === "1" ? 1 : 0, 1);
        }
    }
    bsw.skipToByteBoundary();
    (0, deflate_1.writeAdler32Checksum)(bsw, (0, deflate_1.computeAdler32)(Uint8Array.from(bytes)));
    let observed = (0, deflate_1.inflate)(bsw.getBuffer().buffer);
    let expected = Uint8Array.from(bytes);
    assert.equals(observed, expected);
});
wtf.test(`Inflate should inflate zlib streams containing blocks encoding using dynamic huffman tables.`, (assert) => {
    let bsw = (0, deflate_1.getInitializedBSW)();
    bsw.encode(1, 1);
    bsw.encode(deflate_1.EncodingMethod.DYNAMIC, 2);
    let length = 257;
    let bytes = range(0, 1, length).map((index) => index % 256);
    let literals_bit_lengths = range(9, 0, 286);
    let literals = huffman_1.HuffmanRecord.create(literals_bit_lengths);
    let distances_bit_lengths = range(5, 0, 30);
    let distances = huffman_1.HuffmanRecord.create(distances_bit_lengths);
    let lengths_bit_lengths = range(5, 0, 19);
    let lengths = huffman_1.HuffmanRecord.create(lengths_bit_lengths);
    bsw.encode(literals_bit_lengths.length - 257, 5);
    bsw.encode(distances_bit_lengths.length - 1, 5);
    bsw.encode(lengths_bit_lengths.length - 4, 4);
    for (let index of deflate_1.CODE_LENGTH_CODES_ORDER) {
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
    bsw.skipToByteBoundary();
    (0, deflate_1.writeAdler32Checksum)(bsw, (0, deflate_1.computeAdler32)(Uint8Array.from(bytes)));
    let observed = (0, deflate_1.inflate)(bsw.getBuffer().buffer);
    let expected = Uint8Array.from(bytes);
    assert.equals(observed, expected);
});
wtf.test(`Inflate should throw an error when attempting to decode blocks with a reserved block type.`, async (assert) => {
    let bsw = (0, deflate_1.getInitializedBSW)();
    bsw.encode(1, 1);
    bsw.encode(deflate_1.EncodingMethod.RESERVED, 2);
    await assert.throws(() => {
        (0, deflate_1.inflate)(bsw.getBuffer().buffer);
    });
});
wtf.test(`Matches should be generated into the lookahead buffer ("AABABABAAB").`, async (assert) => {
    let observed = Array.from((0, deflate_1.generateMatches)(chunk_1.Chunk.fromString("AABABABAAB", "binary"), { max_distance: 4 }));
    let expected = [65, 65, 66, { distance: 2, length: 5 }, 65, 66];
    assert.equals(observed, expected);
});
wtf.test(`Matches should not be generated past the max distance ("ABCDEABCDE").`, async (assert) => {
    let observed = Array.from((0, deflate_1.generateMatches)(chunk_1.Chunk.fromString("ABCDEABCDE", "binary"), { max_distance: 4 }));
    let expected = [65, 66, 67, 68, 69, 65, 66, 67, 68, 69];
    assert.equals(observed, expected);
});
wtf.test(`Deflate should deflate strings lacking long repeated sequences ("hello").`, async (assert) => {
    let buffer = chunk_1.Chunk.fromString("hello", "binary");
    let observed = (0, deflate_1.deflate)(buffer.buffer);
    let expected = Uint8Array.of(0x78, 0x9C, 0xCB, 0x48, 0xCD, 0xC9, 0xC9, 0x07, 0x00, 0x06, 0x2C, 0x02, 0x15);
    assert.equals(observed, expected);
});
wtf.test(`Deflate should deflate strings containing long repeated sequences ("hello hello").`, async (assert) => {
    let buffer = chunk_1.Chunk.fromString("hello hello", "binary");
    let observed = (0, deflate_1.deflate)(buffer.buffer);
    let expected = Uint8Array.of(0x78, 0x9C, 0xCB, 0x48, 0xCD, 0xC9, 0xC9, 0x57, 0x00, 0x93, 0x00, 0x19, 0x91, 0x04, 0x49);
    assert.equals(observed, expected);
});
wtf.test(`Strings lacking long repeated sequences ("hello") shold be deflated and inflated properly.`, async (assert) => {
    let expected = "hello";
    let observed = chunk_1.Chunk.toString((0, deflate_1.inflate)((0, deflate_1.deflate)(chunk_1.Chunk.fromString(expected, "binary").buffer)), "binary");
    assert.equals(observed, expected);
});
wtf.test(`Strings containing long repeated sequences ("hello hello") should be deflated and inflated properly.`, async (assert) => {
    let expected = "hello hello";
    let observed = chunk_1.Chunk.toString((0, deflate_1.inflate)((0, deflate_1.deflate)(chunk_1.Chunk.fromString(expected, "binary").buffer)), "binary");
    assert.equals(observed, expected);
});
