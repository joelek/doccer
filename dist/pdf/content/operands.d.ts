export declare abstract class Operand<A> {
    constructor();
    abstract getToken(value: A): string;
}
export declare class IntegerOperand extends Operand<number> {
    constructor();
    getToken(value: number): string;
}
export declare const INTEGER: IntegerOperand;
export declare class RealOperand extends Operand<number> {
    constructor();
    getToken(value: number): string;
}
export declare const REAL: RealOperand;
export declare class ArrayOperand<A> extends Operand<Array<A>> {
    protected operand: Operand<A>;
    constructor(operand: Operand<A>);
    getToken(value: Array<A>): string;
}
export declare const REAL_ARRAY: ArrayOperand<number>;
export declare class NameOperand extends Operand<string> {
    constructor();
    getToken(value: string): string;
}
export declare const NAME: NameOperand;
export declare class StringOperand extends Operand<string> {
    constructor();
    getToken(value: string): string;
}
export declare const STRING: StringOperand;
type Operands<A extends any[]> = {
    [B in keyof A]: Operand<A[B]>;
};
export declare class UnionOperand<A extends any[]> extends Operand<A[number]> {
    protected operands: Operands<A>;
    constructor(...operands: Operands<A>);
    getToken(value: A[number]): string;
}
export {};
