import { Chunk } from "@joelek/ts-stdlib/dist/lib/data/chunk";

export enum ColorType {
	GRAYSCALE = 0,
	TRUECOLOR = 2,
	INDEXED = 3,
	GRAYSCALE_AND_ALPHA = 4,
	TRUECOLOR_AND_ALPHA = 6
};

export enum CompressionMethod {
	DEFLATE = 0
};

export enum FilterMethod {
	PREDICTOR = 0
};

export enum InterlaceMethod {
	NONE = 0,
	ADAM7 = 1
};

export function parseIHDRChunk(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let offset = 0;
	let width = dw.getUint32(offset); offset += 4;
	let height = dw.getUint32(offset); offset += 4;
	let bit_depth = dw.getUint8(offset); offset += 1;
	let color_type = ColorType[dw.getUint8(offset)]; offset += 1;
	let compression_method = CompressionMethod[dw.getUint8(offset)]; offset += 1;
	let filter_method = FilterMethod[dw.getUint8(offset)]; offset += 1;
	let interlace_method = InterlaceMethod[dw.getUint8(offset)]; offset += 1;
	return {
		width,
		height,
		bit_depth,
		color_type,
		compression_method,
		filter_method,
		interlace_method
	};
};

export function parsePNGChunk(buffer: ArrayBuffer, offset: number) {
	let dw = new DataView(buffer);
	let length = dw.getUint32(offset); offset += 4;
	let type = Chunk.toString(new Uint8Array(buffer.slice(offset, offset + 4)), "binary"); offset += 4;
	let data = buffer.slice(offset, offset + length); offset += length;
	let crc = dw.getUint32(offset); offset += 4;
	return {
		type,
		data,
		crc
	};
};

export type PNGChunk = ReturnType<typeof parsePNGChunk>;

export function parsePNGData(buffer: ArrayBuffer) {
	let offset = 0;
	let identifier = buffer.slice(offset, offset + 8); offset += 8;
	if (Chunk.toString(new Uint8Array(identifier), "binary") !== "\x89PNG\x0D\x0A\x1A\x0A") {
		throw new Error(`Expected a PNG identifier!`);
	}
	let chunk = parsePNGChunk(buffer, offset);
	offset += 4 + 4 + chunk.data.byteLength + 4;
	if (chunk.type !== "IHDR") {
		throw new Error(`Expected PNG file to contain an IHDR chunk!`);
	}
	let ihdr = parseIHDRChunk(chunk.data);
	let chunks = [] as Array<PNGChunk>;
	while (offset < buffer.byteLength) {
		let chunk = parsePNGChunk(buffer, offset);
		offset += 4 + 4 + chunk.data.byteLength + 4;
		chunks.push(chunk);
		if (chunk.type === "IEND") {
			break;
		}
	}
	return {
		ihdr,
		chunks
	};
};

export type PNGData = ReturnType<typeof parsePNGData>;
