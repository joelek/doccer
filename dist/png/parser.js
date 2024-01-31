"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitImageData = exports.decodeImageData = exports.modulo = exports.paethPredictor = exports.averagePredictor = exports.parsePNGData = exports.parsePNGChunk = exports.getBitsPerPixel = exports.getNumberOfChannels = exports.getPermittedBitDepths = exports.parseIHDRChunk = exports.InterlaceMethod = exports.FilterMethod = exports.CompressionMethod = exports.ColorType = void 0;
const chunk_1 = require("@joelek/ts-stdlib/dist/lib/data/chunk");
const shared_1 = require("../shared");
var ColorType;
(function (ColorType) {
    ColorType[ColorType["GRAYSCALE"] = 0] = "GRAYSCALE";
    ColorType[ColorType["TRUECOLOR"] = 2] = "TRUECOLOR";
    ColorType[ColorType["INDEXED"] = 3] = "INDEXED";
    ColorType[ColorType["GRAYSCALE_AND_ALPHA"] = 4] = "GRAYSCALE_AND_ALPHA";
    ColorType[ColorType["TRUECOLOR_AND_ALPHA"] = 6] = "TRUECOLOR_AND_ALPHA";
})(ColorType = exports.ColorType || (exports.ColorType = {}));
;
var CompressionMethod;
(function (CompressionMethod) {
    CompressionMethod[CompressionMethod["DEFLATE"] = 0] = "DEFLATE";
})(CompressionMethod = exports.CompressionMethod || (exports.CompressionMethod = {}));
;
var FilterMethod;
(function (FilterMethod) {
    FilterMethod[FilterMethod["PREDICTOR"] = 0] = "PREDICTOR";
})(FilterMethod = exports.FilterMethod || (exports.FilterMethod = {}));
;
var InterlaceMethod;
(function (InterlaceMethod) {
    InterlaceMethod[InterlaceMethod["NONE"] = 0] = "NONE";
    InterlaceMethod[InterlaceMethod["ADAM7"] = 1] = "ADAM7";
})(InterlaceMethod = exports.InterlaceMethod || (exports.InterlaceMethod = {}));
;
function parseIHDRChunk(buffer) {
    let dw = new DataView(buffer);
    let offset = 0;
    let width = dw.getUint32(offset);
    offset += 4;
    let height = dw.getUint32(offset);
    offset += 4;
    let bit_depth = dw.getUint8(offset);
    offset += 1;
    let color_type = ColorType[dw.getUint8(offset)];
    offset += 1;
    let permitted_bit_depths = getPermittedBitDepths(color_type);
    if (!permitted_bit_depths.includes(bit_depth)) {
        throw new Error(`Expected a permitted bit depth of ${permitted_bit_depths.join(", ")} for color type ${color_type}!`);
    }
    let compression_method = CompressionMethod[dw.getUint8(offset)];
    offset += 1;
    let filter_method = FilterMethod[dw.getUint8(offset)];
    offset += 1;
    let interlace_method = InterlaceMethod[dw.getUint8(offset)];
    offset += 1;
    return {
        width,
        height,
        bit_depth,
        color_type,
        compression_method,
        filter_method,
        interlace_method
    };
}
exports.parseIHDRChunk = parseIHDRChunk;
;
function getPermittedBitDepths(color_type) {
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
}
exports.getPermittedBitDepths = getPermittedBitDepths;
;
function getNumberOfChannels(color_type) {
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
}
exports.getNumberOfChannels = getNumberOfChannels;
;
function getBitsPerPixel(ihdr) {
    return getNumberOfChannels(ihdr.color_type) * ihdr.bit_depth;
}
exports.getBitsPerPixel = getBitsPerPixel;
;
function parsePNGChunk(buffer, offset) {
    let dw = new DataView(buffer);
    let length = dw.getUint32(offset);
    offset += 4;
    let type = chunk_1.Chunk.toString(new Uint8Array(buffer.slice(offset, offset + 4)), "binary");
    offset += 4;
    let data = buffer.slice(offset, offset + length);
    offset += length;
    let crc = dw.getUint32(offset);
    offset += 4;
    return {
        type,
        data,
        crc
    };
}
exports.parsePNGChunk = parsePNGChunk;
;
function parsePNGData(buffer) {
    let offset = 0;
    let identifier = buffer.slice(offset, offset + 8);
    offset += 8;
    if (chunk_1.Chunk.toString(new Uint8Array(identifier), "binary") !== "\x89PNG\x0D\x0A\x1A\x0A") {
        throw new Error(`Expected a PNG identifier!`);
    }
    let chunk = parsePNGChunk(buffer, offset);
    offset += 4 + 4 + chunk.data.byteLength + 4;
    if (chunk.type !== "IHDR") {
        throw new Error(`Expected PNG file to contain an IHDR chunk!`);
    }
    let ihdr = parseIHDRChunk(chunk.data);
    let chunks = [];
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
}
exports.parsePNGData = parsePNGData;
;
function averagePredictor(left, top) {
    return (left + top) >> 2;
}
exports.averagePredictor = averagePredictor;
;
function paethPredictor(left, top, top_left) {
    let p = left + top - top_left;
    let pa = Math.abs(p - left);
    let pb = Math.abs(p - top);
    let pc = Math.abs(p - top_left);
    if (pa <= pb && pa <= pc) {
        return left;
    }
    else if (pb <= pc) {
        return top;
    }
    else {
        return top_left;
    }
}
exports.paethPredictor = paethPredictor;
;
function modulo(number, modulo) {
    return ((number % modulo) + modulo) % modulo;
}
exports.modulo = modulo;
;
function decodeImageData(png) {
    let idats = png.chunks.filter((chunk) => chunk.type === "IDAT");
    if (idats.length !== 1) {
        throw new Error(`Expected exactly one IDAT chunk!`);
    }
    let deflated_idat = idats[0].data;
    let inflated_idat = (0, shared_1.inflate)(deflated_idat);
    let bits_per_pixel = getBitsPerPixel(png.ihdr);
    let x_delta = Math.ceil(bits_per_pixel / 8);
    let y_delta = 1;
    let bytes_per_scanline = Math.ceil(bits_per_pixel * png.ihdr.width / 8);
    let bytes = [];
    let offset = 0;
    function getLeftByte(x, y) {
        return x >= x_delta ? bytes[(y) * bytes_per_scanline + (x - x_delta)] : 0;
    }
    function getTopByte(x, y) {
        return y >= y_delta ? bytes[(y - y_delta) * bytes_per_scanline + (x)] : 0;
    }
    function getTopLeftByte(x, y) {
        return y >= y_delta && x >= x_delta ? bytes[(y - y_delta) * bytes_per_scanline + (x - x_delta)] : 0;
    }
    for (let y = 0; y < png.ihdr.height; y++) {
        let predictor = inflated_idat[offset++];
        if (predictor === 0) {
            for (let x = 0; x < bytes_per_scanline; x++) {
                bytes.push(inflated_idat[offset++]);
            }
        }
        else if (predictor === 1) {
            for (let x = 0; x < bytes_per_scanline; x++) {
                let left_byte = getLeftByte(x, y);
                let byte = modulo(inflated_idat[offset++] + left_byte, 256);
                bytes.push(byte);
            }
        }
        else if (predictor === 2) {
            for (let x = 0; x < bytes_per_scanline; x++) {
                let top_byte = getTopByte(x, y);
                let byte = modulo(inflated_idat[offset++] + top_byte, 256);
                bytes.push(byte);
            }
        }
        else if (predictor === 3) {
            for (let x = 0; x < bytes_per_scanline; x++) {
                let left_byte = getLeftByte(x, y);
                let top_byte = getTopByte(x, y);
                let byte = modulo(inflated_idat[offset++] + averagePredictor(left_byte, top_byte), 256);
                bytes.push(byte);
            }
        }
        else if (predictor === 4) {
            for (let x = 0; x < bytes_per_scanline; x++) {
                let left_byte = getLeftByte(x, y);
                let top_byte = getTopByte(x, y);
                let top_left_byte = getTopLeftByte(x, y);
                let byte = modulo(inflated_idat[offset++] + paethPredictor(left_byte, top_byte, top_left_byte), 256);
                bytes.push(byte);
            }
        }
        else {
            throw new Error(`Expected a valid PNG predictor!`);
        }
    }
    return Uint8Array.from(bytes);
}
exports.decodeImageData = decodeImageData;
;
function splitImageData(png) {
    let image_data = decodeImageData(png);
    if (png.ihdr.color_type === "GRAYSCALE_AND_ALPHA") {
        let color_bytes = [];
        let alpha_bytes = [];
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
    }
    else if (png.ihdr.color_type === "TRUECOLOR_AND_ALPHA") {
        let color_bytes = [];
        let alpha_bytes = [];
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
    }
    else {
        return {
            color: image_data
        };
    }
}
exports.splitImageData = splitImageData;
;
