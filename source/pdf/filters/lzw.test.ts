import * as wtf from "@joelek/wtf";
import { LZW } from "./lzw";

wtf.test(`LZW should encode the test case from the PDF specification.`, (assert) => {
	let observed = LZW.encode(Uint8Array.of(45, 45, 45, 45, 45, 65, 45, 45, 45, 66));
	let expected = Uint8Array.of(0x80, 0x0B, 0x60, 0x50, 0x22, 0x0C, 0x0C, 0x85, 0x01);
	assert.equals(observed, expected);
});

wtf.test(`LZW should decode the test case from the PDF specification.`, (assert) => {
	let observed = LZW.decode(Uint8Array.of(0x80, 0x0B, 0x60, 0x50, 0x22, 0x0C, 0x0C, 0x85, 0x01));
	let expected = Uint8Array.of(45, 45, 45, 45, 45, 65, 45, 45, 45, 66);
	assert.equals(observed, expected);
});

wtf.test(`LZW should encode and decode long buffers.`, (assert) => {
	let buffer = new Uint8Array(256 * 1024);
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = i % 256;
	}
	let observed = LZW.decode(LZW.encode(buffer));
	let expected = buffer;
	assert.equals(observed, expected);
});
