import { PDFBytestring, PDFInteger, PDFName, PDFReal, PDFString } from "../format";

export abstract class Operand<A> {
	constructor() {}

	abstract getToken(value: A): string;
};

export class IntegerOperand extends Operand<number> {
	constructor() {
		super();
	}

	getToken(value: number): string {
		if (typeof value !== "number") {
			throw new Error();
		}
		return new PDFInteger(value).tokenize().join(" ");
	}
};

export const INTEGER = new IntegerOperand();

export class RealOperand extends Operand<number> {
	constructor() {
		super();
	}

	getToken(value: number): string {
		if (typeof value !== "number") {
			throw new Error();
		}
		return new PDFReal(Number.parseFloat(value.toFixed(3))).tokenize().join(" ");
	}
};

export const REAL = new RealOperand();

export class ArrayOperand<A> extends Operand<Array<A>> {
	protected operand: Operand<A>;

	constructor(operand: Operand<A>) {
		super();
		this.operand = operand;
	}

	getToken(value: Array<A>): string {
		if (!Array.isArray(value)) {
			throw new Error();
		}
		return "[" + value.map((value) => this.operand.getToken(value)).join(" ") + "]";
	}
};

export const REAL_ARRAY = new ArrayOperand(REAL);

export class NameOperand extends Operand<string> {
	constructor() {
		super();
	}

	getToken(value: string): string {
		if (typeof value !== "string") {
			throw new Error();
		}
		return new PDFName(value).tokenize().join(" ");
	}
};

export const NAME = new NameOperand();

export class StringOperand extends Operand<string> {
	constructor() {
		super();
	}

	getToken(value: string): string {
		if (typeof value !== "string") {
			throw new Error();
		}
		return new PDFString(value).tokenize().join(" ");
	}
};

export const STRING = new StringOperand();

export class BytestringOperand extends Operand<Uint8Array> {
	constructor() {
		super();
	}

	getToken(value: Uint8Array): string {
		if (!(value instanceof Uint8Array)) {
			throw new Error();
		}
		return new PDFBytestring(value).tokenize().join(" ");
	}
};

export const BYTESTRING = new BytestringOperand();

type Operands<A extends any[]> = {
	[B in keyof A]: Operand<A[B]>;
};

export class UnionOperand<A extends any[]> extends Operand<A[number]> {
	protected operands: Operands<A>;

	constructor(...operands: Operands<A>) {
		super();
		this.operands = operands;
	}

	getToken(value: A[number]): string {
		for (let operand of this.operands) {
			try {
				return operand.getToken(value);
			} catch (error) {}
		}
		throw new Error();
	}
};

export const TEXT = new UnionOperand(STRING, BYTESTRING);
