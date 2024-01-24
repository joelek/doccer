"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const lzw_1 = require("./lzw");
wtf.test(`BitstreamWriter should encode codes spanning over multiple bytes when starting at a byte boundary.`, (assert) => {
    let bsw = new lzw_1.BitstreamWriter();
    bsw.encode(257, 9);
    let observed = bsw.getBuffer();
    let expected = Uint8Array.of(0b1000_0000, 0b1000_0000);
    assert.equals(observed, expected);
});
wtf.test(`BitstreamWriter should encode codes spanning over multiple bytes when ending at a byte boundary.`, (assert) => {
    let bsw = new lzw_1.BitstreamWriter();
    bsw.encode(0, 7);
    bsw.encode(257, 9);
    let observed = bsw.getBuffer();
    let expected = Uint8Array.of(0b0000_0001, 0b0000_0001);
    assert.equals(observed, expected);
});
wtf.test(`BitstreamWriter should encode codes spanning over multiple bytes.`, (assert) => {
    let bsw = new lzw_1.BitstreamWriter();
    bsw.encode(0, 3);
    bsw.encode(257, 9);
    let observed = bsw.getBuffer();
    let expected = Uint8Array.of(0b0001_0000, 0b0001_0000);
    assert.equals(observed, expected);
});
wtf.test(`BitstreamReader should decode codes spanning over multiple bytes when starting at a byte boundary.`, (assert) => {
    let bsr = new lzw_1.BitstreamReader(Uint8Array.of(0b1000_0000, 0b1000_0000));
    assert.equals(bsr.decode(9), 257);
    assert.equals(bsr.decode(7), 0);
});
wtf.test(`BitstreamReader should decode codes spanning over multiple bytes when ending at a byte boundary.`, (assert) => {
    let bsr = new lzw_1.BitstreamReader(Uint8Array.of(0b0000_0001, 0b0000_0001));
    assert.equals(bsr.decode(7), 0);
    assert.equals(bsr.decode(9), 257);
});
wtf.test(`BitstreamReader should decode codes spanning over multiple bytes.`, (assert) => {
    let bsr = new lzw_1.BitstreamReader(Uint8Array.of(0b0001_0000, 0b0001_0000));
    assert.equals(bsr.decode(3), 0);
    assert.equals(bsr.decode(9), 257);
    assert.equals(bsr.decode(4), 0);
});
wtf.test(`LZW should encode the test case from the PDF specification.`, (assert) => {
    let observed = lzw_1.LZW.encode(Uint8Array.of(45, 45, 45, 45, 45, 65, 45, 45, 45, 66));
    let expected = Uint8Array.of(0x80, 0x0B, 0x60, 0x50, 0x22, 0x0C, 0x0C, 0x85, 0x01);
    assert.equals(observed, expected);
});
wtf.test(`LZW should decode the test case from the PDF specification.`, (assert) => {
    let observed = lzw_1.LZW.decode(Uint8Array.of(0x80, 0x0B, 0x60, 0x50, 0x22, 0x0C, 0x0C, 0x85, 0x01));
    let expected = Uint8Array.of(45, 45, 45, 45, 45, 65, 45, 45, 45, 66);
    assert.equals(observed, expected);
});
wtf.test(`LZW should encode and decode long buffers.`, (assert) => {
    let buffer = new Uint8Array(256 * 1024);
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] = i % 256;
    }
    let observed = lzw_1.LZW.decode(lzw_1.LZW.encode(buffer));
    let expected = buffer;
    assert.equals(observed, expected);
});
