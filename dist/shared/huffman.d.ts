import { BitstreamReaderMSB, BitstreamReaderLSB, BitstreamWriterMSB, BitstreamWriterLSB } from "./bitstreams";
export type HuffmanRecord = {
    bit_lengths: Array<number>;
    codes_lsb: Array<number>;
    codes_msb: Array<number>;
    min_bit_length: number;
    max_bit_length: number;
    tree: Array<number>;
    start_offsets_lsb: Array<number>;
    start_offsets_msb: Array<number>;
};
export declare const HuffmanRecord: {
    create(bit_lengths: Array<number>): HuffmanRecord;
    decodeSymbolLSB(record: HuffmanRecord, bsr: BitstreamReaderLSB): number;
    decodeSymbolMSB(record: HuffmanRecord, bsr: BitstreamReaderMSB): number;
    encodeSymbolLSB(record: HuffmanRecord, bsw: BitstreamWriterLSB, symbol: number): void;
    encodeSymbolMSB(record: HuffmanRecord, bsw: BitstreamWriterMSB, symbol: number): void;
};
