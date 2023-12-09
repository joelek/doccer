export declare const Codec: {
    unicodeFromAscii(ascii: string): string;
    asciiFromUnicode(unicode: string): string;
    utf16FromAscii(ascii: string): string;
    decodeAsciiBuffer(bytes: Uint8Array): string;
    encodeAsciiBuffer(ascii: string): Uint8Array;
    decodeUnicodeBuffer(bytes: Uint8Array): string;
    encodeUnicodeBuffer(unicode: string): Uint8Array;
};
