export type ImageHandlerEntry = {
    id: number;
    width: number;
    height: number;
};
export declare class ImageHandler {
    protected entries: Map<string, ImageHandlerEntry>;
    protected id: number;
    constructor();
    addEntry(key: string, width: number, height: number): ImageHandler;
    getEntry(key: string): ImageHandlerEntry;
}
