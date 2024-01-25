"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageHandler = void 0;
class ImageHandler {
    entries;
    id;
    constructor() {
        this.entries = new Map();
        this.id = 0;
    }
    addEntry(key, width, height) {
        let entry = this.entries.get(key);
        if (entry != null) {
            throw new Error();
        }
        let id = this.id;
        this.entries.set(key, {
            id: id,
            width,
            height
        });
        this.id += 1;
        return this;
    }
    getEntry(key) {
        let entry = this.entries.get(key);
        if (entry == null) {
            throw new Error(`Expected an image handler entry for key "${key}"!`);
        }
        return entry;
    }
}
exports.ImageHandler = ImageHandler;
;
