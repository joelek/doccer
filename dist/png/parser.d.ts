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
export type IHDRChunk = ReturnType<typeof parseIHDRChunk>;
export declare function getPermittedBitDepths(color_type: typeof ColorType[number]): Array<number>;
export declare function getNumberOfChannels(color_type: typeof ColorType[number]): number;
export declare function getBitsPerPixel(ihdr: IHDRChunk): number;
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
export declare function averagePredictor(left: number, top: number): number;
export declare function paethPredictor(left: number, top: number, top_left: number): number;
export declare function modulo(number: number, modulo: number): number;
export declare enum PredictorType {
    NONE = 0,
    SUB = 1,
    UP = 2,
    AVERAGE = 3,
    PAETH = 4
}
export declare function decodeImageData(png: PNGData): Uint8Array;
export type Predictor = (x: number, y: number) => number;
export declare function createScanlineData(ihdr: IHDRChunk, data: Uint8Array): Uint8Array;
export declare function encodeImageData(ihdr: IHDRChunk, data: Uint8Array): Uint8Array;
export declare function splitImageData(png: PNGData): {
    color: Uint8Array;
    alpha?: Uint8Array;
};
