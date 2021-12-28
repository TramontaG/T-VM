import * as atoms from "./Atoms";
import * as T from "@guigalleta/t-parser";

const operand = T.choice([
    atoms.register,
    atoms.immediateValue,
    atoms.byte,
    atoms.address,
    atoms.registerPointer,
    atoms.labelRead,
]);

const singleArgInstruction = T.transform(
    T.sequenceOf(
        [atoms.opcode, T.atLeastOne(T.anySpace), operand, T.str(";")],
        "Single Arg Instruction"
    ),
    ({ result }) => ({
        type: "instruction",
        variant: result[2].type,
        opCode: result[0],
        operands: {
            operand1: result[2],
            operand2: null,
        },
    })
);

const doubleArgInstruction = T.transform(
    T.sequenceOf(
        [
            atoms.opcode,
            T.atLeastOne(T.anySpace),
            operand,
            T.atLeastOne(T.anySpace),
            operand,
            T.str(";"),
        ],
        "Double Arg Instruction"
    ),
    ({ result }) => ({
        type: "instruction",
        variant: `${result[2].type}_${result[4].type}`,
        opCode: result[0],
        operands: {
            operand1: result[2],
            operand2: result[4],
        },
    })
);

const noArgsInstruction = T.transform(
    T.sequenceOf([atoms.opcode, T.str(";")], "noArgsInstruction"),
    ({ result }) => ({
        type: "instruction",
        variant: `noArgs`,
        opCode: result[0],
        operands: {
            operand1: null,
            operand2: null,
        },
    })
);

export const instruction = T.choice(
    [doubleArgInstruction, singleArgInstruction, noArgsInstruction],
    "instruction"
);
