import { BitstreamReaderLSB, BitstreamWriterLSB } from "./bitstreams";
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
export type Match = {
    distance: number;
    length: number;
};
export type MatchOptions = {
    max_distance_bits: number;
    min_length: number;
    max_length: number;
    max_searches: number;
    great_match_length: number;
    good_match_length: number;
};
export declare function getDistanceFromIndex(i: number, index: number, max_distance_mask: number): number;
export declare function generateMatches(bytes: Uint8Array, options?: Partial<MatchOptions>): Generator<number | Match>;
export declare function getInitializedBSW(): BitstreamWriterLSB;
export declare function computeAdler32(buffer: Uint8Array): number;
export declare function writeAdler32Checksum(bsw: BitstreamWriterLSB, checksum: number): void;
export declare function readAdler32Checksum(bsr: BitstreamReaderLSB): number;
export declare function deflate(buffer: ArrayBuffer): Uint8Array;
export declare function inflate(buffer: ArrayBuffer): Uint8Array;
