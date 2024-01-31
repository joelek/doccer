export declare class StreamEndError extends Error {
    constructor(message?: string);
}
export declare class BitstreamReader {
    protected bytes: Array<number>;
    protected byte_index: number;
    protected bits_left_in_byte: number;
    constructor(bytes: Uint8Array);
    decode(bit_length: number): number;
    getDecodedBitCount(): number;
    skipToByteBoundary(): void;
    skipBytes(bytes: number): void;
}
export declare class BitstreamReaderLSB extends BitstreamReader {
    constructor(bytes: Uint8Array);
    decode(bit_length: number): number;
}
export declare class BitstreamWriter {
    protected bytes: Array<number>;
    protected bits_left_in_byte: number;
    constructor();
    encode(code: number, bit_length: number): void;
    getBuffer(): Uint8Array;
    getEncodedBitCount(): number;
    skipToByteBoundary(): void;
}
export declare class BitstreamWriterLSB extends BitstreamWriter {
    constructor();
    encode(code: number, bit_length: number): void;
}
