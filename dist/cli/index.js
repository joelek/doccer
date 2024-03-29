#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libfs = require("fs");
const app = require("../app.json");
const lib = require("../lib");
function edf2pdf() {
    let options = {};
    let unrecognized_arguments = [];
    for (let [index, arg] of process.argv.slice(3).entries()) {
        let parts = null;
        if ((parts = /^--source=(.+)$/.exec(arg)) != null) {
            options.source = parts[1];
            continue;
        }
        if ((parts = /^--target=(.+)$/.exec(arg)) != null) {
            options.target = parts[1];
            continue;
        }
        if ((parts = /^--stream-filter=(LZW|RLE|ASCII85|ASCIIHEX|DEFLATE)$/.exec(arg)) != null) {
            options.filter = parts[1];
            continue;
        }
        if (index === 0) {
            options.source = arg;
            continue;
        }
        if (index === 1) {
            options.target = arg;
            continue;
        }
        unrecognized_arguments.push(arg);
    }
    if (unrecognized_arguments.length > 0 || options.source == null || options.target == null) {
        process.stderr.write(`${app.name} v${app.version}\n`);
        process.stderr.write(`\n`);
        for (let unrecognized_argument of unrecognized_arguments) {
            process.stderr.write(`Unrecognized argument "${unrecognized_argument}"!\n`);
        }
        process.stderr.write(`\n`);
        process.stderr.write(`Arguments:\n`);
        process.stderr.write(`	--source=string\n`);
        process.stderr.write(`		Set source file.\n`);
        process.stderr.write(`	--target=string\n`);
        process.stderr.write(`		Set target file.\n`);
        process.stderr.write(`	--stream-filter=LZW|RLE|ASCII85|ASCIIHEX|DEFLATE\n`);
        process.stderr.write(`		Set stream filter.\n`);
        process.exit(0);
    }
    else {
        let json = JSON.parse(libfs.readFileSync(options.source, "utf8"));
        let edf = lib.edf.format.Document.as(json);
        let pdf = lib.edf.document.DocumentUtils.convertToPDF(edf, options);
        libfs.writeFileSync(options.target, pdf.tokenize().join("\n"), "binary");
        process.exit(0);
    }
}
function embed() {
    let options = {
        source: "stdin",
        target: "stdout"
    };
    let unrecognized_arguments = [];
    for (let [index, arg] of process.argv.slice(3).entries()) {
        let parts = null;
        if ((parts = /^--source=(.+)$/.exec(arg)) != null) {
            options.source = parts[1];
            continue;
        }
        if ((parts = /^--target=(.+)$/.exec(arg)) != null) {
            options.target = parts[1];
            continue;
        }
        if (index === 0) {
            options.source = arg;
            continue;
        }
        if (index === 1) {
            options.target = arg;
            continue;
        }
        unrecognized_arguments.push(arg);
    }
    if (unrecognized_arguments.length > 0 || options.source == null || options.target == null) {
        process.stderr.write(`${app.name} v${app.version}\n`);
        process.stderr.write(`\n`);
        for (let unrecognized_argument of unrecognized_arguments) {
            process.stderr.write(`Unrecognized argument "${unrecognized_argument}"!\n`);
        }
        process.stderr.write(`\n`);
        process.stderr.write(`Arguments:\n`);
        process.stderr.write(`	--source=string\n`);
        process.stderr.write(`		Set source file (default stdin).\n`);
        process.stderr.write(`	--target=string\n`);
        process.stderr.write(`		Set target file (default stdout).\n`);
        process.exit(0);
    }
    else {
        let source = options.source === "stdin" ? process.stdin.fd : options.source;
        let target = options.target === "stdout" ? process.stdout.fd : options.target;
        let json = JSON.parse(libfs.readFileSync(source, "utf8"));
        let edf = lib.edf.format.Document.as(json);
        let embedded_edf = lib.edf.document.DocumentUtils.embedResources(edf);
        libfs.writeFileSync(target, JSON.stringify(embedded_edf, null, "\t"));
        process.exit(0);
    }
}
function parsefont() {
    let options = {
        source: "stdin",
        target: "stdout"
    };
    let unrecognized_arguments = [];
    for (let [index, arg] of process.argv.slice(3).entries()) {
        let parts = null;
        if ((parts = /^--source=(.+)$/.exec(arg)) != null) {
            options.source = parts[1];
            continue;
        }
        if ((parts = /^--target=(.+)$/.exec(arg)) != null) {
            options.target = parts[1];
            continue;
        }
        if (index === 0) {
            options.source = arg;
            continue;
        }
        if (index === 1) {
            options.target = arg;
            continue;
        }
        unrecognized_arguments.push(arg);
    }
    if (unrecognized_arguments.length > 0 || options.source == null || options.target == null) {
        process.stderr.write(`${app.name} v${app.version}\n`);
        process.stderr.write(`\n`);
        for (let unrecognized_argument of unrecognized_arguments) {
            process.stderr.write(`Unrecognized argument "${unrecognized_argument}"!\n`);
        }
        process.stderr.write(`\n`);
        process.stderr.write(`Arguments:\n`);
        process.stderr.write(`	--source=string\n`);
        process.stderr.write(`		Set source file (default stdin).\n`);
        process.stderr.write(`	--target=string\n`);
        process.stderr.write(`		Set target file (default stdout).\n`);
        process.exit(0);
    }
    else {
        let source = options.source === "stdin" ? process.stdin.fd : options.source;
        let target = options.target === "stdout" ? process.stdout.fd : options.target;
        let buffer = libfs.readFileSync(source).buffer;
        let ttdata = lib.truetype.parseTrueTypeData(buffer);
        libfs.writeFileSync(target, JSON.stringify(ttdata, (key, value) => {
            if (typeof value === "bigint") {
                return value.toString(16);
            }
            else {
                return value;
            }
        }, "\t"));
        process.exit(0);
    }
}
function run() {
    let command = process.argv[2] ?? "";
    if (command === "edf2pdf") {
        return edf2pdf();
    }
    if (command === "embed") {
        return embed();
    }
    if (command === "parsefont") {
        return parsefont();
    }
    process.stderr.write(`${app.name} v${app.version}\n`);
    process.stderr.write(`\n`);
    process.stderr.write(`Unrecognized command "${command}"!\n`);
    process.stderr.write(`\n`);
    process.stderr.write(`Commands:\n`);
    process.stderr.write(`	edf2pdf\n`);
    process.stderr.write(`		Convert EDF file to PDF file.\n`);
    process.stderr.write(`	embed\n`);
    process.stderr.write(`		Embed resources into EDF file.\n`);
    process.stderr.write(`	parsefont\n`);
    process.stderr.write(`		Parse font file.\n`);
    process.exit(0);
}
run();
