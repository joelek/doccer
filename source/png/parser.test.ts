import * as wtf from "@joelek/wtf";
import * as fs from "fs";
import * as parser from "./parser";

wtf.test(`It should parse "normal_4x2_grayscale_8bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_grayscale_8bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 8,
		color_type: "GRAYSCALE",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		  0,   0, 255, 255,
		255, 255,   0,   0
	);
	assert.equals(observed, expected);
});

wtf.test(`It should parse "normal_4x2_grayscale_and_alpha_8bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_grayscale_and_alpha_8bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 8,
		color_type: "GRAYSCALE_AND_ALPHA",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		  0,  64,   0, 128, 255, 192, 255, 255,
		255,  64, 255, 128,   0, 192,  0, 255
	);
	assert.equals(observed, expected);
});

wtf.test(`It should parse "normal_4x2_indexed_1bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_indexed_1bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 1,
		color_type: "INDEXED",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		  0b0011_0000,
		  0b1100_0000
	);
	assert.equals(observed, expected);
});

wtf.test(`It should parse "normal_4x2_indexed_4bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_indexed_4bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 4,
		color_type: "INDEXED",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		  0b0000_0001, 0b0010_0011,
		  0b0100_0101, 0b0110_0111
	);
	assert.equals(observed, expected);
});

wtf.test(`It should parse "normal_4x2_indexed_8bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_indexed_8bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 8,
		color_type: "INDEXED",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		  0,   1,   2,   3,
		  4,   5,   6,   7
	);
	assert.equals(observed, expected);
});

wtf.test(`It should parse "normal_4x2_truecolor_8bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_truecolor_8bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 8,
		color_type: "TRUECOLOR",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		255,   0,   0,   0, 255,   0,   0,   0, 255, 255, 255, 255,
		  0, 255, 255, 255,   0, 255, 255, 255,   0,   0,   0,   0
	);
	assert.equals(observed, expected);
});

wtf.test(`It should parse "normal_4x2_truecolor_and_alpha_8bit.png".`, (assert) => {
	let buffer = new Uint8Array(fs.readFileSync("./public/png/normal_4x2_truecolor_and_alpha_8bit.png"));
	let png = parser.parsePNGData(buffer.buffer);
	assert.equals(png.ihdr, {
		width: 4,
		height: 2,
		bit_depth: 8,
		color_type: "TRUECOLOR_AND_ALPHA",
		compression_method: "DEFLATE",
		filter_method: "PREDICTOR",
		interlace_method: "NONE"
	});
	let observed = parser.decodeImageData(png);
	let expected = Uint8Array.of(
		255,   0,   0,  64,   0, 255,   0, 128,   0,   0, 255, 192, 255, 255, 255, 255,
		  0, 255, 255,  64, 255,   0, 255, 128, 255, 255,   0, 192,   0,   0,   0, 255
	);
	assert.equals(observed, expected);
});
