export declare class StreamEndError extends Error {
    constructor(message?: string);
}
export declare class BitstreamReaderMSB {
    protected bytes: Uint8Array;
    protected byte_index: number;
    protected bits_left_in_byte: number;
    constructor(bytes: Uint8Array);
    decode(bit_length: number): number;
    getDecodedBitCount(): number;
    skipToByteBoundary(): void;
}
export declare class BitstreamReaderLSB {
    protected bytes: Uint8Array;
    protected byte_index: number;
    protected buffer: number;
    protected bits_in_buffer: number;
    constructor(bytes: Uint8Array);
    decode(bit_length: number): number;
    getDecodedBitCount(): number;
    skipToByteBoundary(): void;
}
export declare class BitstreamWriterMSB {
    protected bytes: Array<number>;
    protected bits_left_in_byte: number;
    constructor();
    createBuffer(): Uint8Array;
    encode(code: number, bit_length: number): void;
    getEncodedBitCount(): number;
    skipToByteBoundary(): void;
}
export declare class BitstreamWriterLSB {
    protected bytes: Array<number>;
    protected bits_left_in_byte: number;
    constructor();
    createBuffer(): Uint8Array;
    encode(code: number, bit_length: number): void;
    getEncodedBitCount(): number;
    skipToByteBoundary(): void;
}
