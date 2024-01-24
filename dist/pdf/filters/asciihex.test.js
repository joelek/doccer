"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chunk_1 = require("@joelek/ts-stdlib/dist/lib/data/chunk");
const wtf = require("@joelek/wtf");
const asciihex_1 = require("./asciihex");
wtf.test(`AsciiHex should encode.`, (assert) => {
    let observed = asciihex_1.AsciiHex.encode(Uint8Array.of(0x0F, 0xF0));
    let expected = chunk_1.Chunk.fromString("0FF0", "binary");
    assert.equals(observed, expected);
});
wtf.test(`AsciiHex should decode.`, (assert) => {
    let observed = asciihex_1.AsciiHex.decode(chunk_1.Chunk.fromString("0FF0", "binary"));
    let expected = Uint8Array.of(0x0F, 0xF0);
    assert.equals(observed, expected);
});
wtf.test(`AsciiHex should decode.`, (assert) => {
    let observed = asciihex_1.AsciiHex.decode(chunk_1.Chunk.fromString("0FF>", "binary"));
    let expected = Uint8Array.of(0x0F, 0xF0);
    assert.equals(observed, expected);
});
wtf.test(`AsciiHex should decode.`, (assert) => {
    let observed = asciihex_1.AsciiHex.decode(chunk_1.Chunk.fromString("0F F0", "binary"));
    let expected = Uint8Array.of(0x0F, 0xF0);
    assert.equals(observed, expected);
});
