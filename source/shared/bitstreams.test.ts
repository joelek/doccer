import * as wtf from "@joelek/wtf";
import { BitstreamReader, BitstreamReaderLSB, BitstreamWriter, BitstreamWriterLSB } from "./bitstreams";

wtf.test(`BitstreamWriter should encode codes spanning over multiple bytes when starting at a byte boundary.`, (assert) => {
	let bsw = new BitstreamWriter();
	bsw.encode(257, 9);
	bsw.encode(0, 7);
	let observed = bsw.getBuffer();
	let expected = Uint8Array.of(0b1000_0000, 0b1000_0000);
	assert.equals(observed, expected);
});

wtf.test(`BitstreamWriter should encode codes spanning over multiple bytes when ending at a byte boundary.`, (assert) => {
	let bsw = new BitstreamWriter();
	bsw.encode(0, 7);
	bsw.encode(257, 9);
	let observed = bsw.getBuffer();
	let expected = Uint8Array.of(0b0000_0001, 0b0000_0001);
	assert.equals(observed, expected);
});

wtf.test(`BitstreamWriter should encode codes spanning over multiple bytes.`, (assert) => {
	let bsw = new BitstreamWriter();
	bsw.encode(0, 3);
	bsw.encode(257, 9);
	bsw.encode(0, 4);
	let observed = bsw.getBuffer();
	let expected = Uint8Array.of(0b0001_0000, 0b0001_0000);
	assert.equals(observed, expected);
});

wtf.test(`BitstreamReader should decode codes spanning over multiple bytes when starting at a byte boundary.`, (assert) => {
	let bsr = new BitstreamReader(Uint8Array.of(0b1000_0000, 0b1000_0000));
	assert.equals(bsr.decode(9), 257);
	assert.equals(bsr.decode(7), 0);
});

wtf.test(`BitstreamReader should decode codes spanning over multiple bytes when ending at a byte boundary.`, (assert) => {
	let bsr = new BitstreamReader(Uint8Array.of(0b0000_0001, 0b0000_0001));
	assert.equals(bsr.decode(7), 0);
	assert.equals(bsr.decode(9), 257);
});

wtf.test(`BitstreamReader should decode codes spanning over multiple bytes.`, (assert) => {
	let bsr = new BitstreamReader(Uint8Array.of(0b0001_0000, 0b0001_0000));
	assert.equals(bsr.decode(3), 0);
	assert.equals(bsr.decode(9), 257);
	assert.equals(bsr.decode(4), 0);
});

wtf.test(`BitstreamReaderLSB should decode codes spanning over multiple bytes when starting at a byte boundary.`, (assert) => {
	let bsr = new BitstreamReaderLSB(Uint8Array.of(0b0000_0001, 0b0000_0001));
	assert.equals(bsr.decode(9), 257);
	assert.equals(bsr.decode(7), 0);
});

wtf.test(`BitstreamReaderLSB should read codes spanning over multiple bytes when ending at a byte boundary.`, (assert) => {
	let bsr = new BitstreamReaderLSB(Uint8Array.of(0b1000_0000, 0b1000_0000));
	assert.equals(bsr.decode(7), 0);
	assert.equals(bsr.decode(9), 257);
});

wtf.test(`BitstreamReaderLSB should decode codes spanning over multiple bytes.`, (assert) => {
	let bsr = new BitstreamReaderLSB(Uint8Array.of(0b0000_1000, 0b0000_1000));
	assert.equals(bsr.decode(3), 0);
	assert.equals(bsr.decode(9), 257);
	assert.equals(bsr.decode(4), 0);
});

wtf.test(`BitstreamWriterLSB should encode codes spanning over multiple bytes when starting at a byte boundary.`, (assert) => {
	let bsw = new BitstreamWriterLSB();
	bsw.encode(257, 9);
	bsw.encode(0, 7);
	let observed = bsw.getBuffer();
	let expected = Uint8Array.of(0b0000_0001, 0b0000_0001);
	assert.equals(observed, expected);
});

wtf.test(`BitstreamWriterLSB should encode codes spanning over multiple bytes when ending at a byte boundary.`, (assert) => {
	let bsw = new BitstreamWriterLSB();
	bsw.encode(0, 7);
	bsw.encode(257, 9);
	let observed = bsw.getBuffer();
	let expected = Uint8Array.of(0b1000_0000, 0b1000_0000);
	assert.equals(observed, expected);
});

wtf.test(`BitstreamWriterLSB should encode codes spanning over multiple bytes.`, (assert) => {
	let bsw = new BitstreamWriterLSB();
	bsw.encode(0, 3);
	bsw.encode(257, 9);
	bsw.encode(0, 4);
	let observed = bsw.getBuffer();
	let expected = Uint8Array.of(0b0000_1000, 0b0000_1000);
	assert.equals(observed, expected);
});
