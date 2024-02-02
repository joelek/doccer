"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deflate = void 0;
const shared_1 = require("../../shared");
exports.Deflate = {
    decode(encoded) {
        return (0, shared_1.inflate)(encoded.buffer);
    },
    encode(decoded) {
        return (0, shared_1.deflate)(decoded.buffer);
    }
};
