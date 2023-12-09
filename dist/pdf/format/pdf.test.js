"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const pdf_1 = require("./pdf");
const TOKENIZER = pdf_1.PDFTokenizer.create();
wtf.test(`PDFName should parse ascii names.`, (assert) => {
    let parser = TOKENIZER.tokenize("/ascii");
    let name = pdf_1.PDFName.parseFrom(parser);
    assert.equals(name.value, "ascii");
});
wtf.test(`PDFName should parse ascii names with escape sequences.`, (assert) => {
    let parser = TOKENIZER.tokenize("/ascii#20with#20spaces");
    let name = pdf_1.PDFName.parseFrom(parser);
    assert.equals(name.value, "ascii with spaces");
});
wtf.test(`PDFName should parse unicode names.`, (assert) => {
    let parser = TOKENIZER.tokenize("/r#C3#A4ksm#C3#B6rg#C3#A5s");
    let name = pdf_1.PDFName.parseFrom(parser);
    assert.equals(name.value, "räksmörgås");
});
wtf.test(`PDFDate should parse dates containing year.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:2000");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-01-01T00:00:00.000Z");
});
wtf.test(`PDFDate should parse dates containing year and month.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:200005");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-01T00:00:00.000Z");
});
wtf.test(`PDFDate should parse dates containing year, month and day.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T00:00:00.000Z");
});
wtf.test(`PDFDate should parse dates containing year, month, day and hour.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:2000050902");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T02:00:00.000Z");
});
wtf.test(`PDFDate should parse dates containing year, month, day, hour and minute.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:200005090203");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T02:03:00.000Z");
});
wtf.test(`PDFDate should parse dates containing year, month, day, hour, minute and second.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509020304");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T02:03:04.000Z");
});
wtf.test(`PDFDate should parse dates with a "Z" suffix.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509020304Z");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T02:03:04.000Z");
});
wtf.test(`PDFDate should parse dates with a positive time zone offset containing hour.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509020304+01");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T01:03:04.000Z");
});
wtf.test(`PDFDate should parse dates with a positive time zone offset containing hour and minute.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509020304+01'02");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T01:01:04.000Z");
});
wtf.test(`PDFDate should parse dates with a negative time zone offset containing hour.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509020304-01");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T03:03:04.000Z");
});
wtf.test(`PDFDate should parse dates with a negative time zone offset containing hour and minute.`, (assert) => {
    let parser = TOKENIZER.tokenize("D:20000509020304-01'02");
    let date = pdf_1.PDFDate.parseFrom(parser);
    assert.equals(date.value.toISOString(), "2000-05-09T03:05:04.000Z");
});
wtf.test(`PDFDate should not parse invalid dates.`, async (assert) => {
    let parser = TOKENIZER.tokenize("D:00000000");
    await assert.throws(() => {
        pdf_1.PDFDate.parseFrom(parser);
    });
});
wtf.test(`PDFString should parse ascii strings.`, (assert) => {
    let parser = TOKENIZER.tokenize("(ascii)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "ascii");
});
wtf.test(`PDFString should parse unicode strings.`, (assert) => {
    let parser = TOKENIZER.tokenize("(r\\344ksm\\366rg\\345s)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "räksmörgås");
});
wtf.test(`PDFString should parse strings containing characters not defined in the PDFDocCharset.`, (assert) => {
    let parser = TOKENIZER.tokenize("(\\376\\377\\3\\300)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "π");
});
wtf.test(`PDFString should parse strings containing characters defined using surrogate pairs.`, (assert) => {
    let parser = TOKENIZER.tokenize("(\\376\\377\\330=\\336\\200)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "🚀");
});
wtf.test(`PDFString should parse strings containing escape sequences.`, (assert) => {
    let parser = TOKENIZER.tokenize("(\\\\ \\( \\) \\n \\r \\t \\b \\f \\1 \\12 \\123)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "\\ ( ) \n \r \t \b \f \x01 \x0A \x53");
});
wtf.test(`PDFString should parse strings containing escaped end of line markers.`, (assert) => {
    let parser = TOKENIZER.tokenize("(one\\\ntwo\\\rthree\\\r\nfour)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "onetwothreefour");
});
wtf.test(`PDFString should parse strings containing end of line markers.`, (assert) => {
    let parser = TOKENIZER.tokenize("(one\ntwo\rthree\r\nfour)");
    let string = pdf_1.PDFString.parseFrom(parser);
    assert.equals(string.value, "one\ntwo\nthree\nfour");
});
wtf.test(`PDFString should serialize ascii strings.`, (assert) => {
    let string = new pdf_1.PDFString("ascii");
    assert.equals(string.tokenize(), ["(ascii)"]);
});
wtf.test(`PDFString should serialize unicode strings.`, (assert) => {
    let string = new pdf_1.PDFString("räksmörgås");
    assert.equals(string.tokenize(), ["(r\\344ksm\\366rg\\345s)"]);
});
wtf.test(`PDFString should serialize backslashes and right parentheses.`, (assert) => {
    let string = new pdf_1.PDFString("\\ ) \\)");
    assert.equals(string.tokenize(), ["(\\\\ \\) \\\\\\))"]);
});
wtf.test(`PDFString should serialize strings containing characters not defined in the PDFDocCharset.`, (assert) => {
    let string = new pdf_1.PDFString("π");
    assert.equals(string.tokenize(), ["(\\376\\377\\3\\300)"]);
});
wtf.test(`PDFString should serialize strings containing characters defined using surrogate pairs.`, (assert) => {
    let string = new pdf_1.PDFString("🚀");
    assert.equals(string.tokenize(), ["(\\376\\377\\330=\\336\\200)"]);
});
wtf.test(`PDFStream should parse streams with \n as end of line marker.`, (assert) => {
    let parser = TOKENIZER.tokenize("stream\n\x01\x02\x03\x04\nendstream");
    let stream = pdf_1.PDFStream.parseFrom(parser);
    assert.equals(stream.value, Uint8Array.of(1, 2, 3, 4));
});
wtf.test(`PDFStream should parse streams with \r as end of line marker.`, (assert) => {
    let parser = TOKENIZER.tokenize("stream\r\x01\x02\x03\x04\rendstream");
    let stream = pdf_1.PDFStream.parseFrom(parser);
    assert.equals(stream.value, Uint8Array.of(1, 2, 3, 4));
});
wtf.test(`PDFStream should parse streams with \r\n as end of line marker.`, (assert) => {
    let parser = TOKENIZER.tokenize("stream\r\n\x01\x02\x03\x04\r\nendstream");
    let stream = pdf_1.PDFStream.parseFrom(parser);
    assert.equals(stream.value, Uint8Array.of(1, 2, 3, 4));
});
wtf.test(`PDFBytestring should parse strings containing one hex digit.`, (assert) => {
    let parser = TOKENIZER.tokenize("<0>");
    let bytestring = pdf_1.PDFBytestring.parseFrom(parser);
    assert.equals(bytestring.value, Uint8Array.of(0));
});
wtf.test(`PDFBytestring should parse strings containing two hex digits.`, (assert) => {
    let parser = TOKENIZER.tokenize("<01>");
    let bytestring = pdf_1.PDFBytestring.parseFrom(parser);
    assert.equals(bytestring.value, Uint8Array.of(1));
});
wtf.test(`PDFBytestring should parse strings containing three hex digits.`, (assert) => {
    let parser = TOKENIZER.tokenize("<012>");
    let bytestring = pdf_1.PDFBytestring.parseFrom(parser);
    assert.equals(bytestring.value, Uint8Array.of(1, 32));
});
wtf.test(`PDFBytestring should parse strings containing four hex digits.`, (assert) => {
    let parser = TOKENIZER.tokenize("<0123>");
    let bytestring = pdf_1.PDFBytestring.parseFrom(parser);
    assert.equals(bytestring.value, Uint8Array.of(1, 35));
});
wtf.test(`PDFReal should parse numbers with a dot suffix.`, (assert) => {
    let parser = TOKENIZER.tokenize("1.");
    let real = pdf_1.PDFReal.parseFrom(parser);
    assert.equals(real.value, 1);
});
wtf.test(`PDFReal should parse numbers with a dot prefix.`, (assert) => {
    let parser = TOKENIZER.tokenize(".2");
    let real = pdf_1.PDFReal.parseFrom(parser);
    assert.equals(real.value, 0.2);
});
wtf.test(`PDFReal should parse numbers with a dot infix.`, (assert) => {
    let parser = TOKENIZER.tokenize("1.2");
    let real = pdf_1.PDFReal.parseFrom(parser);
    assert.equals(real.value, 1.2);
});
wtf.test(`PDFReal should serialize very large numbers without using scientific notation.`, (assert) => {
    let real = new pdf_1.PDFReal(1.23456789e+21);
    assert.equals(real.tokenize(), ["1234567890000000000000"]);
});
wtf.test(`PDFReal should serialize very small numbers without using scientific notation.`, (assert) => {
    let real = new pdf_1.PDFReal(1.23456789e-12);
    assert.equals(real.tokenize(), ["0.00000000000123456789"]);
});
