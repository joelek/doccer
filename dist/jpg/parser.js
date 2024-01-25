"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJpegData = void 0;
const chunk_1 = require("@joelek/ts-stdlib/dist/lib/data/chunk");
var Markers;
(function (Markers) {
    Markers[Markers["START_OF_FRAME_0"] = 65472] = "START_OF_FRAME_0";
    Markers[Markers["START_OF_FRAME_1"] = 65473] = "START_OF_FRAME_1";
    Markers[Markers["START_OF_FRAME_2"] = 65474] = "START_OF_FRAME_2";
    Markers[Markers["DEFINE_HUFFMAN_TABLE"] = 65476] = "DEFINE_HUFFMAN_TABLE";
    Markers[Markers["RESTART_0"] = 65488] = "RESTART_0";
    Markers[Markers["RESTART_1"] = 65489] = "RESTART_1";
    Markers[Markers["RESTART_2"] = 65490] = "RESTART_2";
    Markers[Markers["RESTART_3"] = 65491] = "RESTART_3";
    Markers[Markers["RESTART_4"] = 65492] = "RESTART_4";
    Markers[Markers["RESTART_5"] = 65493] = "RESTART_5";
    Markers[Markers["RESTART_6"] = 65494] = "RESTART_6";
    Markers[Markers["RESTART_7"] = 65495] = "RESTART_7";
    Markers[Markers["START_OF_IMAGE"] = 65496] = "START_OF_IMAGE";
    Markers[Markers["END_OF_IMAGE"] = 65497] = "END_OF_IMAGE";
    Markers[Markers["START_OF_SCAN"] = 65498] = "START_OF_SCAN";
    Markers[Markers["DEFINE_QUANTIZATION_TABLE"] = 65499] = "DEFINE_QUANTIZATION_TABLE";
    Markers[Markers["DEFINE_RESTART_INTERVAL"] = 65501] = "DEFINE_RESTART_INTERVAL";
    Markers[Markers["APPLICATION_0"] = 65504] = "APPLICATION_0";
    Markers[Markers["COMMENT"] = 65534] = "COMMENT";
})(Markers || (Markers = {}));
;
function parseApplication0(buffer) {
    let dw = new DataView(buffer);
    let offset = 0;
    let identifier = new Uint8Array(buffer.slice(offset, 5));
    offset += 5;
    if (chunk_1.Chunk.toString(identifier, "binary") !== "JFIF\0") {
        throw new Error(`Expected a JFIF identifier!`);
    }
    let major = dw.getUint8(offset);
    offset += 1;
    let minor = dw.getUint8(offset);
    offset += 1;
    let density_unit = dw.getUint8(offset);
    offset += 1;
    if (density_unit !== 0 && density_unit !== 1 && density_unit !== 2) {
        throw new Error(`Expected a valid density unit!`);
    }
    let horizontal_density = dw.getUint16(offset);
    offset += 2;
    if (horizontal_density === 0) {
        throw new Error(`Expected a non-zero horisontal density!`);
    }
    let vertical_density = dw.getUint16(offset);
    offset += 2;
    if (vertical_density === 0) {
        throw new Error(`Expected a non-zero vertical density!`);
    }
    let preview_width = dw.getUint8(offset);
    offset += 1;
    let preview_height = dw.getUint8(offset);
    offset += 1;
    let preview = new Uint8Array(buffer.slice(offset, offset + preview_width * preview_height * 3));
    offset += preview_width * preview_height * 3;
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
}
;
function parseStartOfFrame(buffer) {
    let dw = new DataView(buffer);
    let offset = 0;
    let precision = dw.getUint8(offset);
    offset += 1;
    let height = dw.getUint16(offset);
    offset += 2;
    let width = dw.getUint16(offset);
    offset += 2;
    let component_count = dw.getUint8(offset);
    offset += 1;
    let components = [...Array(component_count).keys()].map(() => {
        let id = dw.getUint8(offset);
        offset += 1;
        let sampling_factor = dw.getUint8(offset);
        offset += 1;
        let quantization_table = dw.getUint8(offset);
        offset += 1;
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
}
;
function parseStartOfFrame0(buffer) {
    return {
        coding: "BASELINE_DCT",
        entropy_coding: "HUFFMAN",
        ...parseStartOfFrame(buffer)
    };
}
;
function parseStartOfFrame1(buffer) {
    return {
        coding: "EXTENDED_DCT",
        entropy_coding: "HUFFMAN",
        ...parseStartOfFrame(buffer)
    };
}
;
function parseStartOfFrame2(buffer) {
    return {
        coding: "PROGRESSIVE_DCT",
        entropy_coding: "HUFFMAN",
        ...parseStartOfFrame(buffer)
    };
}
;
function parseJpegData(buffer) {
    let dw = new DataView(buffer);
    let offset = 0;
    let soi_marker = dw.getUint16(offset);
    offset += 2;
    if (soi_marker !== Markers.START_OF_IMAGE) {
        throw new Error(`Expected SOI marker!`);
    }
    let app0_marker = dw.getUint16(offset);
    offset += 2;
    if (app0_marker !== Markers.APPLICATION_0) {
        throw new Error(`Expected APP0 marker!`);
    }
    let app0_length = dw.getUint16(offset);
    offset += 2;
    if (app0_length < 2) {
        throw new Error(`Expected a valid payload length!`);
    }
    let app0_buffer = buffer.slice(offset, offset + app0_length - 2);
    offset += app0_length - 2;
    let app0 = parseApplication0(app0_buffer);
    let sof;
    while (offset < buffer.byteLength) {
        let segment_marker = dw.getUint16(offset);
        offset += 2;
        let segment_length = dw.getUint16(offset);
        offset += 2;
        if (segment_length < 2) {
            throw new Error(`Expected a valid payload length!`);
        }
        let segment_buffer = buffer.slice(offset, offset + segment_length - 2);
        offset += segment_length - 2;
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
}
exports.parseJpegData = parseJpegData;
;
