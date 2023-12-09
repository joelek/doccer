import * as wtf from "@joelek/wtf";
import { Codec } from "./utils";

wtf.test(`Codec should convert unicode strings into ascii strings.`, (assert) => {
	assert.equals(Codec.asciiFromUnicode("räksmörgås"), "r\xC3\xA4ksm\xC3\xB6rg\xC3\xA5s");
});

wtf.test(`Codec should convert ascii strings into unicode strings.`, (assert) => {
	assert.equals(Codec.unicodeFromAscii("r\xC3\xA4ksm\xC3\xB6rg\xC3\xA5s"), "räksmörgås");
});
