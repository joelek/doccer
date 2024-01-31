import { BitstreamReader } from "./bitstreams";
export type HuffmanRecord = {
    symbols: Record<string, number>;
    keys: Record<number, string>;
    max_bit_length: number;
};
export declare const HuffmanRecord: {
    create(bit_lengths: Array<number>): HuffmanRecord;
    decodeSymbol(record: HuffmanRecord, bsr: BitstreamReader): number;
};
