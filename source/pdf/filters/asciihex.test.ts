import { Chunk } from "@joelek/ts-stdlib/dist/lib/data/chunk";
import * as wtf from "@joelek/wtf";
import { AsciiHex } from "./asciihex";

wtf.test(`AsciiHex should encode.`, (assert) => {
	let observed = AsciiHex.encode(Uint8Array.of(0x0F, 0xF0));
	let expected = Chunk.fromString("0FF0", "binary");
	assert.equals(observed, expected);
});

wtf.test(`AsciiHex should decode.`, (assert) => {
	let observed = AsciiHex.decode(Chunk.fromString("0FF0", "binary"));
	let expected = Uint8Array.of(0x0F, 0xF0);
	assert.equals(observed, expected);
});

wtf.test(`AsciiHex should decode.`, (assert) => {
	let observed = AsciiHex.decode(Chunk.fromString("0FF>", "binary"));
	let expected = Uint8Array.of(0x0F, 0xF0);
	assert.equals(observed, expected);
});

wtf.test(`AsciiHex should decode.`, (assert) => {
	let observed = AsciiHex.decode(Chunk.fromString("0F F0", "binary"));
	let expected = Uint8Array.of(0x0F, 0xF0);
	assert.equals(observed, expected);
});
