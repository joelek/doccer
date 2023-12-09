"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CP_PDFDOC = void 0;
const cp_pdfdoc = require("./cp_pdfdoc.json");
const codepage = require("../codepage");
exports.CP_PDFDOC = new codepage.Codepage(cp_pdfdoc);
