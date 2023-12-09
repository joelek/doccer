"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const utils_1 = require("./utils");
wtf.test(`Codec should convert unicode strings into ascii strings.`, (assert) => {
    assert.equals(utils_1.Codec.asciiFromUnicode("räksmörgås"), "r\xC3\xA4ksm\xC3\xB6rg\xC3\xA5s");
});
wtf.test(`Codec should convert ascii strings into unicode strings.`, (assert) => {
    assert.equals(utils_1.Codec.unicodeFromAscii("r\xC3\xA4ksm\xC3\xB6rg\xC3\xA5s"), "räksmörgås");
});
