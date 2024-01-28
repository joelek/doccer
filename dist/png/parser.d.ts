export declare enum ColorType {
    GRAYSCALE = 0,
    TRUECOLOR = 2,
    INDEXED = 3,
    GRAYSCALE_AND_ALPHA = 4,
    TRUECOLOR_AND_ALPHA = 6
}
export declare enum CompressionMethod {
    DEFLATE = 0
}
export declare enum FilterMethod {
    PREDICTOR = 0
}
export declare enum InterlaceMethod {
    NONE = 0,
    ADAM7 = 1
}
export declare function parseIHDRChunk(buffer: ArrayBuffer): {
    width: number;
    height: number;
    bit_depth: number;
    color_type: string;
    compression_method: string;
    filter_method: string;
    interlace_method: string;
};
export declare function parsePNGChunk(buffer: ArrayBuffer, offset: number): {
    type: string;
    data: ArrayBuffer;
    crc: number;
};
export type PNGChunk = ReturnType<typeof parsePNGChunk>;
export declare function parsePNGData(buffer: ArrayBuffer): {
    ihdr: {
        width: number;
        height: number;
        bit_depth: number;
        color_type: string;
        compression_method: string;
        filter_method: string;
        interlace_method: string;
    };
    chunks: {
        type: string;
        data: ArrayBuffer;
        crc: number;
    }[];
};
export type PNGData = ReturnType<typeof parsePNGData>;
