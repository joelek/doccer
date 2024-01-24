export declare class BitstreamReader {
    protected bytes: Array<number>;
    protected byte_index: number;
    protected bits_left_in_byte: number;
    constructor(bytes: Uint8Array);
    decode(bit_length: number): number | undefined;
    getDecodedBitCount(): number;
}
export declare class BitstreamWriter {
    protected bytes: Array<number>;
    protected bits_left_in_byte: number;
    constructor();
    encode(code: number, bit_length: number): void;
    getBuffer(): Uint8Array;
    getEncodedBitCount(): number;
}
export declare const LZW: {
    decode(source: Uint8Array): Uint8Array;
    encode(source: Uint8Array): Uint8Array;
};
