"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RLE = void 0;
const END_OF_DATA = 128;
exports.RLE = {
    decode(encoded) {
        let bytes = [];
        let offset = 0;
        while (offset < encoded.length) {
            let control = encoded[offset++];
            if (control < 128) {
                let length = 1 + control;
                for (let i = 0; i < length; i++) {
                    let byte = encoded[offset++];
                    bytes.push(byte);
                }
                continue;
            }
            if (control > 128) {
                let length = 257 - control;
                let byte = encoded[offset++];
                for (let i = 0; i < length; i++) {
                    bytes.push(byte);
                }
                continue;
            }
            break;
        }
        let decoded = Uint8Array.from(bytes);
        return decoded;
    },
    encode(decoded) {
        let bytes = [];
        let offset = 0;
        function encodeRawSequence(sequence) {
            if (sequence.raw_length > 0) {
                let control = sequence.raw_length - 1;
                bytes.push(control);
                bytes.push(...sequence.bytes);
            }
        }
        function encodeRunSequence(sequence) {
            if (sequence.run_length > 1) {
                let control = 257 - sequence.run_length;
                bytes.push(control);
                bytes.push(sequence.byte);
            }
        }
        let queued_raw_sequence;
        function appendRawSequence(sequence) {
            if (queued_raw_sequence == null) {
                queued_raw_sequence = sequence;
            }
            else {
                let combined_sequence = {
                    raw_length: queued_raw_sequence.raw_length + sequence.raw_length,
                    bytes: [...queued_raw_sequence.bytes, ...sequence.bytes]
                };
                let segmented_sequences = [];
                for (let i = 0; i < combined_sequence.raw_length; i += 128) {
                    let raw_length = Math.min(combined_sequence.raw_length - i, 128);
                    let segmented_sequence = {
                        raw_length: raw_length,
                        bytes: combined_sequence.bytes.slice(i, i + raw_length)
                    };
                    segmented_sequences.push(segmented_sequence);
                }
                queued_raw_sequence = segmented_sequences.pop();
                for (let segmented_sequence of segmented_sequences) {
                    encodeRawSequence(segmented_sequence);
                }
            }
        }
        function appendRunSequence(sequence) {
            if (queued_raw_sequence == null) {
                encodeRunSequence(sequence);
            }
            else {
                if (sequence.run_length === 2 && queued_raw_sequence.raw_length <= 126) {
                    appendRawSequence({ raw_length: 2, bytes: [sequence.byte, sequence.byte] });
                }
                else {
                    encodeRawSequence(queued_raw_sequence);
                    queued_raw_sequence = undefined;
                    encodeRunSequence(sequence);
                }
            }
        }
        while (offset < decoded.length) {
            let raw_length = 1;
            for (let i = offset + 1; i < decoded.length; i++) {
                if (decoded[i] !== decoded[i - 1]) {
                    raw_length += 1;
                    if (raw_length === 128 + 1) {
                        raw_length -= 1;
                        break;
                    }
                }
                else {
                    raw_length -= 1;
                    break;
                }
            }
            if (raw_length > 0) {
                let bytes = Array.from(decoded.slice(offset, offset + raw_length));
                appendRawSequence({ raw_length, bytes });
                offset += raw_length;
            }
            let run_length = 1;
            for (let i = offset + 1; i < decoded.length; i++) {
                if (decoded[i] === decoded[i - 1]) {
                    run_length += 1;
                    if (run_length === 128) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            if (run_length > 1) {
                let byte = decoded[offset];
                appendRunSequence({ run_length, byte });
                offset += run_length;
            }
        }
        if (queued_raw_sequence != null) {
            encodeRawSequence(queued_raw_sequence);
        }
        bytes.push(END_OF_DATA);
        return Uint8Array.from(bytes);
    }
};
