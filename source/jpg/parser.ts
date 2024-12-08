import { Chunk } from "@joelek/stdlib/dist/lib/data/chunk";

enum Markers {
	START_OF_FRAME_0 = 0xFFC0,
	START_OF_FRAME_1 = 0xFFC1,
	START_OF_FRAME_2 = 0xFFC2,
	DEFINE_HUFFMAN_TABLE = 0xFFC4,
	RESTART_0 = 0xFFD0,
	RESTART_1 = 0xFFD1,
	RESTART_2 = 0xFFD2,
	RESTART_3 = 0xFFD3,
	RESTART_4 = 0xFFD4,
	RESTART_5 = 0xFFD5,
	RESTART_6 = 0xFFD6,
	RESTART_7 = 0xFFD7,
	START_OF_IMAGE = 0xFFD8,
	END_OF_IMAGE = 0xFFD9,
	START_OF_SCAN = 0xFFDA,
	DEFINE_QUANTIZATION_TABLE = 0xFFDB,
	DEFINE_RESTART_INTERVAL = 0xFFDD,
	APPLICATION_0 = 0xFFE0,
	COMMENT = 0xFFFE
};

type Application0 = {
	major_version: number;
	minor_version: number;
	density_unit: number;
	horizontal_density: number;
	vertical_density: number;
	preview_width: number;
	preview_height: number;
	preview: Uint8Array;
};

function parseApplication0(buffer: ArrayBuffer): Application0 {
	let dw = new DataView(buffer);
	let offset = 0;
	let identifier = new Uint8Array(buffer.slice(offset, 5)); offset += 5;
	if (Chunk.toString(identifier, "binary") !== "JFIF\0") {
		throw new Error(`Expected a JFIF identifier!`);
	}
	let major = dw.getUint8(offset); offset += 1;
	let minor = dw.getUint8(offset); offset += 1;
	let density_unit = dw.getUint8(offset); offset += 1;
	if (density_unit !== 0 && density_unit !== 1 && density_unit !== 2) {
		throw new Error(`Expected a valid density unit!`);
	}
	let horizontal_density = dw.getUint16(offset); offset += 2;
	if (horizontal_density === 0) {
		throw new Error(`Expected a non-zero horisontal density!`);
	}
	let vertical_density = dw.getUint16(offset); offset += 2;
	if (vertical_density === 0) {
		throw new Error(`Expected a non-zero vertical density!`);
	}
	let preview_width = dw.getUint8(offset); offset += 1;
	let preview_height = dw.getUint8(offset); offset += 1;
	let preview = new Uint8Array(buffer.slice(offset, offset + preview_width * preview_height * 3)); offset += preview_width * preview_height * 3;
	if (preview.length !== preview_width * preview_height * 3) {
		throw new Error(`Expected a valid thumbnail!`);
	}
	return {
		major_version: major,
		minor_version: minor,
		density_unit,
		horizontal_density,
		vertical_density,
		preview_width,
		preview_height,
		preview
	};
};

type StartOfFrame = {
	precision: number;
	height: number;
	width: number;
	components: {
		id: number;
		sampling_factor: number;
		quantization_table: number;
	}[];
};

function parseStartOfFrame(buffer: ArrayBuffer): StartOfFrame {
	let dw = new DataView(buffer);
	let offset = 0;
	let precision = dw.getUint8(offset); offset += 1;
	let height = dw.getUint16(offset); offset += 2;
	let width = dw.getUint16(offset); offset += 2;
	let component_count = dw.getUint8(offset); offset += 1;
	let components = [...Array(component_count).keys()].map(() => {
		let id = dw.getUint8(offset); offset += 1;
		let sampling_factor = dw.getUint8(offset); offset += 1;
		let quantization_table = dw.getUint8(offset); offset += 1;
		return {
			id,
			sampling_factor,
			quantization_table
		};
	});
	return {
		precision,
		height,
		width,
		components
	};
};

type StartOfFrame0 = StartOfFrame & {
	coding: "BASELINE_DCT";
	entropy_coding: "HUFFMAN";
};

function parseStartOfFrame0(buffer: ArrayBuffer): StartOfFrame0 {
	return {
		coding: "BASELINE_DCT",
		entropy_coding: "HUFFMAN",
		...parseStartOfFrame(buffer)
	};
};

type StartOfFrame1 = StartOfFrame & {
	coding: "EXTENDED_DCT";
	entropy_coding: "HUFFMAN";
};

function parseStartOfFrame1(buffer: ArrayBuffer): StartOfFrame1 {
	return {
		coding: "EXTENDED_DCT",
		entropy_coding: "HUFFMAN",
		...parseStartOfFrame(buffer)
	};
};

type StartOfFrame2 = StartOfFrame & {
	coding: "PROGRESSIVE_DCT";
	entropy_coding: "HUFFMAN";
};

function parseStartOfFrame2(buffer: ArrayBuffer): StartOfFrame2 {
	return {
		coding: "PROGRESSIVE_DCT",
		entropy_coding: "HUFFMAN",
		...parseStartOfFrame(buffer)
	};
};

export function parseJpegData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let offset = 0;
	let soi_marker = dw.getUint16(offset); offset += 2;
	if (soi_marker !== Markers.START_OF_IMAGE) {
		throw new Error(`Expected SOI marker!`);
	}
	let app0_marker = dw.getUint16(offset); offset += 2;
	if (app0_marker !== Markers.APPLICATION_0) {
		throw new Error(`Expected APP0 marker!`);
	}
	let app0_length = dw.getUint16(offset); offset += 2;
	if (app0_length < 2) {
		throw new Error(`Expected a valid payload length!`);
	}
	let app0_buffer = buffer.slice(offset, offset + app0_length - 2); offset += app0_length - 2;
	let app0 = parseApplication0(app0_buffer);
	let sof: StartOfFrame0 | StartOfFrame1 | StartOfFrame2 | undefined;
	while (offset < buffer.byteLength) {
		let segment_marker = dw.getUint16(offset); offset += 2;
		let segment_length = dw.getUint16(offset); offset += 2;
		if (segment_length < 2) {
			throw new Error(`Expected a valid payload length!`);
		}
		let segment_buffer = buffer.slice(offset, offset + segment_length - 2); offset += segment_length - 2;
		if (segment_marker === Markers.START_OF_FRAME_0) {
			sof = parseStartOfFrame0(segment_buffer);
			break;
		}
		if (segment_marker === Markers.START_OF_FRAME_1) {
			sof = parseStartOfFrame1(segment_buffer);
			break;
		}
		if (segment_marker === Markers.START_OF_FRAME_2) {
			sof = parseStartOfFrame2(segment_buffer);
			break;
		}
		if (segment_marker === Markers.START_OF_SCAN) {
			break;
		}
	}
	if (sof == null) {
		throw new Error(`Expected a SOF segment!`);
	}
	return {
		app0,
		sof
	};
};

export type JpegData = ReturnType<typeof parseJpegData>;
