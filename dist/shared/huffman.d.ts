import { BitstreamReader, BitstreamReaderLSB } from "./bitstreams";
export type HuffmanRecord = {
    symbols: Record<string, number>;
    keys: Record<number, string>;
    min_bit_length: number;
    max_bit_length: number;
    tree: Array<number>;
    start_offsets_lsb: Record<number, number>;
};
export declare const HuffmanRecord: {
    create(bit_lengths: Array<number>): HuffmanRecord;
    decodeSymbolLSB(record: HuffmanRecord, bsr: BitstreamReaderLSB): number;
    decodeSymbolMSB(record: HuffmanRecord, bsr: BitstreamReader): number;
};
