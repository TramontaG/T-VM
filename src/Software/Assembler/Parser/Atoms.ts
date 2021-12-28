import * as T from "@guigalleta/t-parser";

export const lineBreak = T.choice([T.str("\r\n"), T.str("\n")]);

export const name = T.transform(
    T.sequenceOf([T.letter, T.lettersOrDigits], "name"),
    ({ result }) => result[0] + result[1]
);

export const labelDeclaration = T.transform(
    T.sequenceOf([name, T.str(":")], "label"),
    ({ result }) => ({
        type: "label",
        value: result[0],
    })
);

export const labelRead = T.transform(
    T.sequenceOf([T.str("$"), name]),
    ({ result }) => ({
        type: "address",
        value: result[1],
    })
);

export const opcode = T.transform(
    T.repeat(3)(T.upperCaseLetter, "letters from OPCode"),
    ({ result }) => result.join("")
);

export const register = T.transform(
    T.choice(
        [
            T.str("R1"),
            T.str("R2"),
            T.str("R3"),
            T.str("R4"),
            T.str("R6"),
            T.str("R7"),
            T.str("R8"),
            T.str("ACC"),
            T.str("PC"),
        ],
        "Register"
    ),
    ({ result }) => ({
        type: "register",
        value: result,
    })
);

export const hexValue = T.transform(
    T.sequenceOf([T.str("0x"), T.regexMatch(/^[0-9a-fA-F]+/)]),
    ({ result }) => ({
        type: "hexValue",
        value: Number(`0x${result[1]}`) & 0xffff,
    })
);

export const binaryValue = T.transform(
    T.sequenceOf([T.str("0b"), T.digits]),
    ({ result }) => ({
        type: "binaryValue",
        value: Number(`0b${result[1]}`) & 0xffff,
    })
);

export const decimalValue = T.transform(T.digits, ({ result }) => ({
    type: "decimalValue",
    value: Number(result) & 0xffff,
}));

export const immediateValue = T.transform(
    T.choice([hexValue, binaryValue, decimalValue]),
    ({ result }) => ({
        type: "immediate",
        value: result.value,
    })
);

export const byte = T.transform(
    T.sequenceOf([T.str("@"), immediateValue]),
    ({ result }) => ({
        type: "immediateByte",
        value: result.value & 0xff,
    })
);

export const registerPointer = T.transform(
    T.sequenceOf([T.str("*"), register]),
    ({ result }) => ({
        type: "registerPointer",
        value: result[1].value,
    })
);

export const address = T.transform(
    T.sequenceOf([T.str("$"), immediateValue]),
    ({ result }) => ({
        ...result[1],
        type: "address",
    })
);
