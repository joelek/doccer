import * as wtf from "@joelek/wtf";
import { Typesetter } from "./";

wtf.test(`Typesetter should clamp strings narrower than the target width.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(".", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.clampString("aaa", 4), [
		{
			line_string: "aaa",
			line_width: 3
		}
	]);
});

wtf.test(`Typesetter should clamp strings as wide as the target width.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(".", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.clampString("aaaa", 4), [
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should clamp strings wider than the target width.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(".", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.clampString("aaaaa", 4), [
		{
			line_string: "a...",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should measure the width of "" when there is no width information.`, (assert) => {
	let widths = new Map<string, number>();
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString(""), 0);
});

wtf.test(`Typesetter should measure the width of "a" when there is no width information.`, (assert) => {
	let widths = new Map<string, number>();
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("a"), 1000);
});

wtf.test(`Typesetter should measure the width of "ab" when there is no width information.`, (assert) => {
	let widths = new Map<string, number>();
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("ab"), 2000);
});

wtf.test(`Typesetter should measure the width of "aba" when there is no width information.`, (assert) => {
	let widths = new Map<string, number>();
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("aba"), 3000);
});

wtf.test(`Typesetter should measure the width of "abab" when there is no width information.`, (assert) => {
	let widths = new Map<string, number>();
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("abab"), 4000);
});

wtf.test(`Typesetter should measure the width of "" when there is width information for "a".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString(""), 0);
});

wtf.test(`Typesetter should measure the width of "a" when there is width information for "a".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("a"), 1);
});

wtf.test(`Typesetter should measure the width of "ab" when there is width information for "a".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("ab"), 1001);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("aba"), 1002);
});

wtf.test(`Typesetter should measure the width of "abab" when there is width information for "a".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("abab"), 2002);
});

wtf.test(`Typesetter should measure the width of "" when there is width information for "a" and "b".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString(""), 0);
});

wtf.test(`Typesetter should measure the width of "a" when there is width information for "a" and "b".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("a"), 1);
});

wtf.test(`Typesetter should measure the width of "ab" when there is width information for "a" and "b".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("ab"), 11);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a" and "b".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("aba"), 12);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a" and "b".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.measureString("abab"), 22);
});

wtf.test(`Typesetter should measure the width of "" when there is width information for "a", "b" and "ab".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>();
	kernings.set("ab", 100);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString(""), 0);
});

wtf.test(`Typesetter should measure the width of "a" when there is width information for "a", "b" and "ab".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("a"), 1);
});

wtf.test(`Typesetter should measure the width of "ab" when there is width information for "a", "b" and "ab".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("ab"), 111);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a", "b" and "ab".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("aba"), 112);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a", "b" and "ab".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("abab"), 222);
});

wtf.test(`Typesetter should measure the width of "" when there is width information for "a", "b", "ab" and "ba".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	kernings.set("ba", 1000);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString(""), 0);
});

wtf.test(`Typesetter should measure the width of "a" when there is width information for "a", "b", "ab" and "ba".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	kernings.set("ba", 1000);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("a"), 1);
});

wtf.test(`Typesetter should measure the width of "ab" when there is width information for "a", "b", "ab" and "ba".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	kernings.set("ba", 1000);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("ab"), 111);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a", "b", "ab" and "ba".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	kernings.set("ba", 1000);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("aba"), 1112);
});

wtf.test(`Typesetter should measure the width of "aba" when there is width information for "a", "b", "ab" and "ba".`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set("b", 10);
	let kernings = new Map<string, number>()
	kernings.set("ab", 100);
	kernings.set("ba", 1000);
	let typesetter = new Typesetter(widths, 1000, kernings);
	assert.equals(typesetter.measureString("abab"), 1222);
});

wtf.test(`Typesetter should always output at least one line.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString("", 10), [
		{
			line_string: "",
			line_width: 0
		}
	]);
});

wtf.test(`Typesetter should not remove whitespace separating words when wrapping strings.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString("aaaa aaaa", 10), [
		{
			line_string: "aaaa aaaa",
			line_width: 9
		}
	]);
});

wtf.test(`Typesetter should remove leading whitespace when wrapping strings into one line of width 4.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString(" aaaa", 4), [
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove leading whitespace when wrapping strings into one line of width 5.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString(" aaaa", 5), [
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove leading whitespace when wrapping strings into two lines of width 4.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString(" aaaa aaaa", 4), [
		{
			line_string: "aaaa",
			line_width: 4
		},
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove leading whitespace when wrapping strings into two lines of width 5.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString(" aaaa aaaa", 5), [
		{
			line_string: "aaaa",
			line_width: 4
		},
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove trailing whitespace when wrapping strings into one line of width 4.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString("aaaa ", 4), [
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove trailing whitespace when wrapping strings into one line of width 5.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString("aaaa ", 5), [
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove trailing whitespace when wrapping strings into two lines of width 4.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString("aaaa aaaa ", 4), [
		{
			line_string: "aaaa",
			line_width: 4
		},
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});

wtf.test(`Typesetter should remove trailing whitespace when wrapping strings into two lines of width 5.`, (assert) => {
	let widths = new Map<string, number>();
	widths.set("a", 1);
	widths.set(" ", 1);
	let typesetter = new Typesetter(widths, 1000);
	assert.equals(typesetter.wrapString("aaaa aaaa ", 5), [
		{
			line_string: "aaaa",
			line_width: 4
		},
		{
			line_string: "aaaa",
			line_width: 4
		}
	]);
});
