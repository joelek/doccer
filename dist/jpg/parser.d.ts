type Application0 = {
    major_version: number;
    minor_version: number;
    density_unit: number;
    horizontal_density: number;
    vertical_density: number;
    preview_width: number;
    preview_height: number;
    preview: Uint8Array;
};
type StartOfFrame = {
    precision: number;
    height: number;
    width: number;
    components: {
        id: number;
        sampling_factor: number;
        quantization_table: number;
    }[];
};
type StartOfFrame0 = StartOfFrame & {
    coding: "BASELINE_DCT";
    entropy_coding: "HUFFMAN";
};
type StartOfFrame1 = StartOfFrame & {
    coding: "EXTENDED_DCT";
    entropy_coding: "HUFFMAN";
};
type StartOfFrame2 = StartOfFrame & {
    coding: "PROGRESSIVE_DCT";
    entropy_coding: "HUFFMAN";
};
export declare function parseJpegData(buffer: ArrayBuffer): {
    app0: Application0;
    sof: StartOfFrame0 | StartOfFrame1 | StartOfFrame2;
};
export type JpegData = ReturnType<typeof parseJpegData>;
export {};
