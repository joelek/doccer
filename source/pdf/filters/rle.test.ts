import * as wtf from "@joelek/wtf";
import { RLE } from "./rle";

wtf.test(`RLE should decode raw sequences with length 1.`, (assert) => {
	let observed = RLE.decode(Uint8Array.of(0, ...new Array(1).fill(0).map((value, index) => index)));
	let expected = Uint8Array.from(new Array(1).fill(0).map((value, index) => index));
	assert.equals(observed, expected);
});

wtf.test(`RLE should decode raw sequences with length 128.`, (assert) => {
	let observed = RLE.decode(Uint8Array.of(127, ...new Array(128).fill(0).map((value, index) => index)));
	let expected = Uint8Array.from(new Array(128).fill(0).map((value, index) => index));
	assert.equals(observed, expected);
});

wtf.test(`RLE should decode run sequences with length 2.`, (assert) => {
	let observed = RLE.decode(Uint8Array.of(255, 1));
	let expected = Uint8Array.of(...new Array(2).fill(1));
	assert.equals(observed, expected);
});

wtf.test(`RLE should decode run sequences with length 128.`, (assert) => {
	let observed = RLE.decode(Uint8Array.of(129, 1));
	let expected = Uint8Array.from(new Array(128).fill(1));
	assert.equals(observed, expected);
});

wtf.test(`RLE should stop decoding when encountering END_OF_DATA.`, (assert) => {
	let observed = RLE.decode(Uint8Array.of(128));
	let expected = Uint8Array.from(new Array(0));
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequence (1, 1) transitioning into run sequence (2, 2).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 1, 2, 2));
	let expected = Uint8Array.of(255, 1, 255, 2, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequence (1, 1) transitioning into raw sequence (2, 3).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 1, 2, 3));
	let expected = Uint8Array.of(255, 1, 1, 2, 3, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence (1, 2) transitioning into run sequence (3, 3).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 2, 3, 3));
	let expected = Uint8Array.of(3, 1, 2, 3, 3, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence (1, 2) transitioning into raw sequence (3, 4).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 2, 3, 4));
	let expected = Uint8Array.of(3, 1, 2, 3, 4, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequence (1, 1, 1) transitioning into run sequence (2, 2, 2).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 1, 1, 2, 2, 2));
	let expected = Uint8Array.of(254, 1, 254, 2, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequence (1, 1, 1) transitioning into raw sequence (2, 3, 4).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 1, 1, 2, 3, 4));
	let expected = Uint8Array.of(254, 1, 2, 2, 3, 4, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence (1, 2, 3) transitioning into run sequence (4, 4, 4).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 2, 3, 4, 4, 4));
	let expected = Uint8Array.of(2, 1, 2, 3, 254, 4, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence (1, 2, 3) transitioning into raw sequence (4, 5, 6).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 2, 3, 4, 5, 6));
	let expected = Uint8Array.of(5, 1, 2, 3, 4, 5, 6, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequence (1, 1, 1, 1) transitioning into run sequence (2, 2, 2, 2).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 1, 1, 1, 2, 2, 2, 2));
	let expected = Uint8Array.of(253, 1, 253, 2, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequence (1, 1, 1, 1) transitioning into raw sequence (2, 3, 4, 5).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 1, 1, 1, 2, 3, 4, 5));
	let expected = Uint8Array.of(253, 1, 3, 2, 3, 4, 5, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence (1, 2, 3, 4) transitioning into run sequence (5, 5, 5, 5).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 2, 3, 4, 5, 5, 5, 5));
	let expected = Uint8Array.of(3, 1, 2, 3, 4, 253, 5, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence (1, 2, 3, 4) transitioning into raw sequence (5, 6, 7, 8).`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(1, 2, 3, 4, 5, 6, 7, 8));
	let expected = Uint8Array.of(7, 1, 2, 3, 4, 5, 6, 7, 8, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 126 bytes followed by run sequence with 2 bytes as one sequence.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(126).fill(0).map((value, index) => index), 200, 200));
	let expected = Uint8Array.of(127, ...new Array(126).fill(0).map((value, index) => index), 200, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 127 bytes followed by run sequence with 2 bytes as two sequences.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(127).fill(0).map((value, index) => index), 200, 200));
	let expected = Uint8Array.of(126, ...new Array(127).fill(0).map((value, index) => index), 255, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 128 bytes followed by run sequence with 2 bytes as two sequences.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(128).fill(0).map((value, index) => index), 200, 200));
	let expected = Uint8Array.of(127, ...new Array(128).fill(0).map((value, index) => index), 255, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 125 bytes followed by run sequence with 3 bytes as two sequences.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(125).fill(0).map((value, index) => index), 200, 200, 200));
	let expected = Uint8Array.of(124, ...new Array(125).fill(0).map((value, index) => index), 254, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 126 bytes followed by run sequence with 3 bytes as two sequences.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(126).fill(0).map((value, index) => index), 200, 200, 200));
	let expected = Uint8Array.of(125, ...new Array(126).fill(0).map((value, index) => index), 254, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 127 bytes followed by run sequence with 3 bytes as two sequences.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(127).fill(0).map((value, index) => index), 200, 200, 200));
	let expected = Uint8Array.of(126, ...new Array(127).fill(0).map((value, index) => index), 254, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequence with 128 bytes followed by run sequence with 3 bytes as two sequences.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(128).fill(0).map((value, index) => index), 200, 200, 200));
	let expected = Uint8Array.of(127, ...new Array(128).fill(0).map((value, index) => index), 254, 200, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode raw sequences longer than 128 bytes.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(130).fill(0).map((value, index) => index)));
	let expected = Uint8Array.of(127, ...new Array(128).fill(0).map((value, index) => index), 1, 128, 129, 128);
	assert.equals(observed, expected);
});

wtf.test(`RLE should encode run sequencess longer than 128 bytes.`, (assert) => {
	let observed = RLE.encode(Uint8Array.of(...new Array(130).fill(0).map((value, index) => 1)));
	let expected = Uint8Array.of(129, 1, 255, 1, 128);
	assert.equals(observed, expected);
});
