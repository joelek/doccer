import * as wtf from "@joelek/wtf";
import { Deflate } from "./deflate";
import { Chunk } from "@joelek/stdlib/dist/lib/data/chunk";

wtf.test(`Deflate should encode strings.`, (assert) => {
	let observed = Deflate.encode(Chunk.fromString("hello hello", "binary"));
	let expected = Uint8Array.of(0x78, 0x9C, 0xCB, 0x48, 0xCD, 0xC9, 0xC9, 0x57, 0x00, 0x93, 0x00, 0x19, 0x91, 0x04, 0x49);
	assert.equals(observed, expected);
});

wtf.test(`Deflate should decode strings.`, (assert) => {
	let observed = Chunk.toString(Deflate.decode(Uint8Array.of(0x78, 0x9C, 0xCB, 0x48, 0xCD, 0xC9, 0xC9, 0x57, 0x00, 0x93, 0x00, 0x19, 0x91, 0x04, 0x49)), "binary");
	let expected = "hello hello";
	assert.equals(observed, expected);
});
