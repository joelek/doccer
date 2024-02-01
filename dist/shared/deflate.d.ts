import { BitstreamReaderLSB } from "./bitstreams";
import { HuffmanRecord } from "./huffman";
export declare const CODE_LENGTH_CODES_ORDER: number[];
export declare const STATIC_LITERALS: HuffmanRecord;
export declare const STATIC_DISTANCES: HuffmanRecord;
export declare enum EncodingMethod {
    RAW = 0,
    STATIC = 1,
    DYNAMIC = 2,
    RESERVED = 3
}
export declare enum CompressionMethod {
    DEFLATE = 8
}
export declare enum CompressionLevel {
    FASTEST = 0,
    FAST = 1,
    DEFAULT = 2,
    BEST = 3
}
export declare function readDeflateHeader(bsr: BitstreamReaderLSB): {
    compression_method: string;
    compression_info: number;
    compression_level: string;
    dictionary_id: number | undefined;
};
export type DeflateHeader = ReturnType<typeof readDeflateHeader>;
export declare function deflate(buffer: ArrayBuffer): Uint8Array;
export declare function inflate(buffer: ArrayBuffer): Uint8Array;
