"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePNGData = exports.parsePNGChunk = exports.parseIHDRChunk = exports.InterlaceMethod = exports.FilterMethod = exports.CompressionMethod = exports.ColorType = void 0;
const chunk_1 = require("@joelek/ts-stdlib/dist/lib/data/chunk");
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
