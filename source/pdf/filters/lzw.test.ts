import * as wtf from "@joelek/wtf";
import { LZW } from "./lzw";

wtf.test(`LZW should encode...`, (assert) => {
	let observed = LZW.encode(Uint8Array.of(45, 45, 45, 45, 45, 65, 45, 45, 45, 66));
	let expected = Uint8Array.of(0x80, 0x0B, 0x60, 0x50, 0x22, 0x0C, 0x0C, 0x85, 0x01);
	assert.equals(observed, expected);
});
