import { deflate, inflate } from "../../shared";

export const Deflate = {
	decode(encoded: Uint8Array): Uint8Array {
		return inflate(encoded.buffer);
	},

	encode(decoded: Uint8Array): Uint8Array {
		return deflate(decoded.buffer);
	}
};
