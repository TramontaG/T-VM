import fs from "fs/promises";
import programParser from "./../Parser/Program";
import { instructions, registers } from "./meta";

type Operand = {
    type: string;
    value: string | number;
};

type LabelMap = { [key: string]: number };

const getProgram = () =>
    fs.readFile("src/Software/software.tvm", { encoding: "utf-8" });

const encodeOperand = (operand: Operand, labelMap: LabelMap) => {
    if (!operand)
        return {
            sizeInBytes: undefined,
            value: undefined,
        };

    if (operand.type === "register") {
        const registerKey = operand.value as keyof typeof registers;
        return {
            sizeInBytes: 1,
            value: registers[registerKey],
        };
    }

    if (operand.type === "registerPointer") {
        const registerKey = operand.value as keyof typeof registers;
        return {
            sizeInBytes: 1,
            value: registers[registerKey],
        };
    }

    if (operand.type === "immediate") {
        return {
            sizeInBytes: 2,
            value: operand.value as number,
        };
    }

    if (operand.type === "address") {
        if (typeof operand.value === "number") {
            return {
                sizeInBytes: 2,
                value: operand.value,
            };
        }
        if (typeof operand.value === "string") {
            return {
                sizeInBytes: 2,
                value: labelMap[operand.value],
            };
        }
    }

    return {
        sizeInBytes: undefined,
        value: undefined,
    };
};

const loadOperand = (
    operand: Operand,
    memory: DataView,
    byteOffset: number,
    labelMap: LabelMap
) => {
    const { value, sizeInBytes } = encodeOperand(operand, labelMap);

    if (!value || !sizeInBytes) return;
    if (sizeInBytes == 2) {
        memory.setUint16(byteOffset, value);
        byteOffset += 2;
    }
    if (sizeInBytes == 1) {
        memory.setUint8(byteOffset, value);
        byteOffset += 1;
    }
    return byteOffset;
};

const assemble = (ast: any) => {
    if (ast.isError) throw ast.errorStack;

    const buffer = new ArrayBuffer(0x10000);
    const memory = new DataView(buffer);

    const labelMap = hoistLabels(ast.result);

    let byte = 0;

    ast.result.forEach((node: any) => {
        if (node.type === "instruction") {
            //typescript being a bitch lmao
            const opCode = node.opCode as keyof typeof instructions;
            const operands = node.operands as {
                operand1: Operand;
                operand2: Operand;
            };
            const variant =
                node.variant as keyof typeof instructions[keyof typeof instructions];

            const mappedInstruction = instructions[opCode][variant] as {
                opCode: number;
                sizeInBytes: number;
            };
            memory.setUint8(byte, mappedInstruction.opCode);
            byte++;

            const { operand1, operand2 } = operands;
            byte = loadOperand(operand1, memory, byte, labelMap) || byte;
            byte = loadOperand(operand2, memory, byte, labelMap) || byte;
        }
    });

    return memory;
};

const hoistLabels = (ast: any[]) => {
    let byte = 0;
    const labelMap = {} as LabelMap;

    ast.forEach((node) => {
        if (node.type === "label") {
            labelMap[node.value] = byte;
        }
        if (node.type === "instruction") {
            //typescript being a bitch lmao
            const opCode = node.opCode as keyof typeof instructions;
            const variant =
                node.variant as keyof typeof instructions[keyof typeof instructions];

            const mappedInstruction = instructions[opCode][variant] as {
                opCode: number;
                sizeInBytes: number;
            };
            byte += mappedInstruction.sizeInBytes;
        }
    });

    return labelMap;
};

export default () =>
    getProgram().then((program) => {
        const ast = programParser(program);
        console.log(ast);
        const assembled = assemble(ast);
        return assembled;
    });
