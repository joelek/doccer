import { Chunk } from "@joelek/ts-stdlib/dist/lib/data/chunk";
import { inflate } from "../shared";

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
	let permitted_bit_depths = getPermittedBitDepths(color_type);
	if (!permitted_bit_depths.includes(bit_depth)) {
		throw new Error(`Expected a permitted bit depth of ${permitted_bit_depths.join(", ")} for color type ${color_type}!`);
	}
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

export type IHDRChunk = ReturnType<typeof parseIHDRChunk>;

export function getPermittedBitDepths(color_type: typeof ColorType[number]): Array<number> {
	if (color_type === "GRAYSCALE") {
		return [1, 2, 4, 8, 16];
	}
	if (color_type === "TRUECOLOR") {
		return [8, 16];
	}
	if (color_type === "INDEXED") {
		return [1, 2, 4, 8];
	}
	if (color_type === "GRAYSCALE_AND_ALPHA") {
		return [8, 16];
	}
	if (color_type === "TRUECOLOR_AND_ALPHA") {
		return [8, 16];
	}
	throw new Error(`Expected a valid color type!`);
};

export function getNumberOfChannels(color_type: typeof ColorType[number]): number {
	if (color_type === "GRAYSCALE") {
		return 1;
	}
	if (color_type === "TRUECOLOR") {
		return 3;
	}
	if (color_type === "INDEXED") {
		return 1;
	}
	if (color_type === "GRAYSCALE_AND_ALPHA") {
		return 2;
	}
	if (color_type === "TRUECOLOR_AND_ALPHA") {
		return 4;
	}
	throw new Error(`Expected a valid color type!`);
};

export function getBitsPerPixel(ihdr: IHDRChunk): number {
	return getNumberOfChannels(ihdr.color_type) * ihdr.bit_depth;
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

export function averagePredictor(left: number, top: number): number {
	return (left + top) >> 2;
};

export function paethPredictor(left: number, top: number, top_left: number): number {
	let p = left + top - top_left;
	let pa = Math.abs(p - left);
	let pb = Math.abs(p - top);
	let pc = Math.abs(p - top_left);
	if (pa <= pb && pa <= pc) {
		return left;
	} else if (pb <= pc) {
		return top;
	} else {
		return top_left;
	}
};

export function modulo(number: number, modulo: number): number {
	return ((number % modulo) + modulo) % modulo;
};

export enum PredictorType {
	NONE = 0,
	SUB = 1,
	UP = 2,
	AVERAGE = 3,
	PAETH = 4
};

export function decodeImageData(png: PNGData): Uint8Array {
	let idats = png.chunks.filter((chunk) => chunk.type === "IDAT");
	if (idats.length !== 1) {
		throw new Error(`Expected exactly one IDAT chunk!`);
	}
	let deflated_idat = idats[0].data;
	let inflated_idat = inflate(deflated_idat);
	let bits_per_pixel = getBitsPerPixel(png.ihdr);
	let x_delta = Math.ceil(bits_per_pixel / 8);
	let y_delta = 1;
	let bytes_per_scanline = Math.ceil(bits_per_pixel * png.ihdr.width / 8);
	let bytes = [] as Array<number>;
	let offset = 0;
	function getLeftByte(x: number, y: number): number {
		return x >= x_delta ? bytes[(y) * bytes_per_scanline + (x - x_delta)] : 0;
	}
	function getTopByte(x: number, y: number): number {
		return y >= y_delta ? bytes[(y - y_delta) * bytes_per_scanline + (x)] : 0;
	}
	function getTopLeftByte(x: number, y: number): number {
		return y >= y_delta && x >= x_delta ? bytes[(y - y_delta) * bytes_per_scanline + (x - x_delta)] : 0;
	}
	for (let y = 0; y < png.ihdr.height; y++) {
		let predictor = inflated_idat[offset++];
		if (predictor === PredictorType.NONE) {
			for (let x = 0; x < bytes_per_scanline; x++) {
				bytes.push(inflated_idat[offset++]);
			}
		} else if (predictor === PredictorType.SUB) {
			for (let x = 0; x < bytes_per_scanline; x++) {
				let left_byte = getLeftByte(x, y);
				let byte = modulo(inflated_idat[offset++] + left_byte, 256);
				bytes.push(byte);
			}
		} else if (predictor === PredictorType.UP) {
			for (let x = 0; x < bytes_per_scanline; x++) {
				let top_byte = getTopByte(x, y);
				let byte = modulo(inflated_idat[offset++] + top_byte, 256);
				bytes.push(byte);
			}
		} else if (predictor === PredictorType.AVERAGE) {
			for (let x = 0; x < bytes_per_scanline; x++) {
				let left_byte = getLeftByte(x, y);
				let top_byte = getTopByte(x, y);
				let byte = modulo(inflated_idat[offset++] + averagePredictor(left_byte, top_byte), 256);
				bytes.push(byte);
			}
		} else if (predictor === PredictorType.PAETH) {
			for (let x = 0; x < bytes_per_scanline; x++) {
				let left_byte = getLeftByte(x, y);
				let top_byte = getTopByte(x, y);
				let top_left_byte = getTopLeftByte(x, y);
				let byte = modulo(inflated_idat[offset++] + paethPredictor(left_byte, top_byte, top_left_byte), 256);
				bytes.push(byte);
			}
		} else {
			throw new Error(`Expected a valid PNG predictor!`);
		}
	}
	return Uint8Array.from(bytes);
};

export function splitImageData(png: PNGData): { color: Uint8Array; alpha?: Uint8Array; } {
	let image_data = decodeImageData(png);
	if (png.ihdr.color_type === "GRAYSCALE_AND_ALPHA") {
		let color_bytes = [] as Array<number>;
		let alpha_bytes = [] as Array<number>;
		let offset = 0;
		for (let y = 0; y < png.ihdr.height; y++) {
			for (let x = 0; x < png.ihdr.width; x++) {
				color_bytes.push(image_data[offset++]);
				alpha_bytes.push(image_data[offset++]);
			}
		}
		return {
			color: Uint8Array.from(color_bytes),
			alpha: Uint8Array.from(alpha_bytes)
		};
	} else if (png.ihdr.color_type === "TRUECOLOR_AND_ALPHA") {
		let color_bytes = [] as Array<number>;
		let alpha_bytes = [] as Array<number>;
		let offset = 0;
		for (let y = 0; y < png.ihdr.height; y++) {
			for (let x = 0; x < png.ihdr.width; x++) {
				color_bytes.push(image_data[offset++]);
				color_bytes.push(image_data[offset++]);
				color_bytes.push(image_data[offset++]);
				alpha_bytes.push(image_data[offset++]);
			}
		}
		return {
			color: Uint8Array.from(color_bytes),
			alpha: Uint8Array.from(alpha_bytes)
		};
	} else {
		return {
			color: image_data
		};
	}
};
