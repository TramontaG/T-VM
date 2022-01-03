import util from "util";
import Memory from "../../Hardware/Memory";
import Processor from "../../Hardware/Processor";
import colorLog from "./colorLog";
import { GeneralRegisters } from "./../../Hardware/Processor";
import { register } from "../../Software/Assembler/Parser/Atoms";

const getHexByte = (byte: number) =>
    byte.toString(16).toUpperCase().padStart(2, "0");
const getHex16 = (value: number) =>
    value.toString(16).toUpperCase().padStart(4, "0");

export const getStringFromByte = (value: number) => `0x${getHexByte(value)}`;
export const getStringFrom16bits = (value: number) => `0x${getHex16(value)}`;

export const createMemoryDebugger = (memory: Memory, title: string) => {
    const debugAt = (address: number) => {
        let header = `|`;
        let debugString = "| ";
        for (let i = address; i < address + 16; i++) {
            header += `${getHex16(i)}|`;
            debugString += `${getHexByte(memory.getUInt8(i))} | `;
        }

        colorLog(`\n${title}`, "magenta");
        colorLog(header, "cyan");
        colorLog(debugString, "green");
    };

    const debugRange = (start: number, end: number) => {
        let header = `|`;
        let debugString = "| ";

        for (let i = start; i < end; i++) {
            header += `${getHex16(i)}|`;
            debugString += `${getHexByte(memory.getUInt8(i))} | `;
        }
    };

    return {
        debugAt,
    };
};

export const createCpuDebugger = (cpu: Processor) => {
    const debugRegisters = () => {
        const loggedRegisters = [
            GeneralRegisters.R1,
            GeneralRegisters.R2,
            GeneralRegisters.R3,
            GeneralRegisters.R4,
            GeneralRegisters.R5,
            GeneralRegisters.R6,
            GeneralRegisters.R7,
            GeneralRegisters.R8,
            GeneralRegisters.ACC,
            GeneralRegisters.SP,
            GeneralRegisters.FP,
            GeneralRegisters.PC,
            GeneralRegisters.RR,
        ];
        const header = loggedRegisters
            .map((register) => `  ${register}\t|`)
            .join("");
        const log = loggedRegisters.reduce((msg, register) => {
            const registerValue = cpu.registers[register].getUInt16(0);
            return (msg += " " + getHex16(registerValue)) + "\t|";
        }, "");

        colorLog("\nProcessor", "magenta");
        colorLog(header, "green");
        colorLog(log, "cyan");
        colorLog(debugFlags(), "yellow");
    };

    const logRegister = (register: keyof typeof GeneralRegisters) => {
        return `${getHex16(cpu.registers[register].getUInt16(0))}`;
    };

    const debugFlags = () => {
        return Object.keys(cpu.flags)
            .map((flagName) => {
                const flagValue = cpu.flags[flagName as keyof typeof cpu.flags];
                return `${flagName} - ${flagValue ? "1" : "0"}`;
            })
            .join(" | ");
    };

    return {
        debugRegisters,
        logRegister,
        debugFlags,
    };
};

export const deepLog = (obj: any) => {
    console.log(
        util.inspect(obj, {
            colors: true,
            depth: null,
            showHidden: true,
        })
    );
};
