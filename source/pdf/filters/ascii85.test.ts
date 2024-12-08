import * as stdlib from "@joelek/stdlib";
import * as wtf from "@joelek/wtf";
import { Ascii85 } from "./ascii85";

wtf.test(`Ascii85 should encode "Man sure.".`, (assert) => {
	assert.equals(Ascii85.encode(stdlib.data.chunk.Chunk.fromString("Man sure.", "binary")), "9jqo^F*2M7/c~>");
});

wtf.test(`Ascii85 should decode "Man sure.".`, (assert) => {
	assert.equals(Ascii85.decode("9jqo^F*2M7/c~>"), stdlib.data.chunk.Chunk.fromString("Man sure.", "binary"));
});

wtf.test(`Ascii85 should encode buffers with a byte length of 0.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of()), "~>");
});

wtf.test(`Ascii85 should decode buffers with a byte length of 0.`, (assert) => {
	assert.equals(Ascii85.decode("~>"), Uint8Array.of());
});

wtf.test(`Ascii85 should encode buffers with a byte length of 1.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(1)), "!<~>");
});

wtf.test(`Ascii85 should decode buffers with a byte length of 1.`, (assert) => {
	assert.equals(Ascii85.decode("!<~>"), Uint8Array.of(1));
});

wtf.test(`Ascii85 should encode buffers with a byte length of 2.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(1, 2)), "!<N~>");
});

wtf.test(`Ascii85 should decode buffers with a byte length of 2.`, (assert) => {
	assert.equals(Ascii85.decode("!<N~>"), Uint8Array.of(1, 2));
});

wtf.test(`Ascii85 should encode buffers with a byte length of 3.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(1, 2, 3)), "!<N?~>");
});

wtf.test(`Ascii85 should decode buffers with a byte length of 3.`, (assert) => {
	assert.equals(Ascii85.decode("!<N?~>"), Uint8Array.of(1, 2, 3));
});

wtf.test(`Ascii85 should encode buffers with a byte length of 4.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(1, 2, 3, 4)), "!<N?+~>");
});

wtf.test(`Ascii85 should decode buffers with a byte length of 4.`, (assert) => {
	assert.equals(Ascii85.decode("!<N?+~>"), Uint8Array.of(1, 2, 3, 4));
});

wtf.test(`Ascii85 should encode buffers with a byte length of 5.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(1, 2, 3, 4, 5)), "!<N?+\"T~>");
});

wtf.test(`Ascii85 should decode buffers with a byte length of 5.`, (assert) => {
	assert.equals(Ascii85.decode("!<N?+\"T~>"), Uint8Array.of(1, 2, 3, 4, 5));
});

wtf.test(`Ascii85 should encode buffers with stretches of zeroes in unpadded groups.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(0, 0, 0, 0)), "z~>");
});

wtf.test(`Ascii85 should decode buffers with stretches of zeroes in unpadded groups.`, (assert) => {
	assert.equals(Ascii85.decode("z~>"), Uint8Array.of(0, 0, 0, 0));
});

wtf.test(`Ascii85 should encode buffers with stretches of zeroes in padded groups.`, (assert) => {
	assert.equals(Ascii85.encode(Uint8Array.of(0, 0, 0)), "!!!!~>");
});

wtf.test(`Ascii85 should decode buffers with stretches of zeroes in padded groups.`, (assert) => {
	assert.equals(Ascii85.decode("!!!!~>"), Uint8Array.of(0, 0, 0));
});
