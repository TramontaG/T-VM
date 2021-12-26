import { register } from "../../Software/Assembler/Parser/Atoms";
import Memory from "../Memory";

export enum GeneralRegisters {
    R1 = "R1",
    R2 = "R2",
    R3 = "R3",
    R4 = "R4",
    R5 = "R5",
    R6 = "R6",
    R7 = "R7",
    R8 = "R8",
    ACC = "ACC",
    SP = "SP",
    FP = "FP",
    PC = "PC",
}

type Flags = {
    HLT: boolean;
};

type Options = {
    memory: Memory;
};

type Registers = {
    [property in GeneralRegisters]: Memory;
};

class Processor {
    memory: Memory;
    registers: Registers;
    flags: Flags;

    constructor(options: Options) {
        this.memory = options.memory;
        this.registers = {
            R1: new Memory(2),
            R2: new Memory(2),
            R3: new Memory(2),
            R4: new Memory(2),
            R5: new Memory(2),
            R6: new Memory(2),
            R7: new Memory(2),
            R8: new Memory(2),
            ACC: new Memory(2),
            SP: new Memory(2),
            FP: new Memory(2),
            PC: new Memory(16 / 8),
        };

        this.flags = {
            HLT: false,
        };
    }

    onClock() {
        console.log(
            "RUNNING INSTRUCTION ON ADDRESS",
            this.registers.PC.getUInt16(0)
        );
        this.runInstruction();
    }

    getRegisterFromNumber(number: number) {
        const registerArr = [
            this.registers.ACC,
            this.registers.R1,
            this.registers.R2,
            this.registers.R3,
            this.registers.R4,
            this.registers.R5,
            this.registers.R6,
            this.registers.R7,
            this.registers.R8,
            undefined,
            this.registers.SP,
            this.registers.FP,
        ];

        return registerArr[number];
    }

    private fetch8() {
        const address = this.registers.PC.getUInt16(0);
        this.incrementPC();
        return this.memory.getUInt8(address);
    }

    private fetch16() {
        const address = this.registers.PC.getUInt16(0);
        this.incrementPC();
        this.incrementPC();
        return this.memory.getUInt16(address);
    }

    private runInstruction() {
        const opCode = this.memory.getUInt8(this.registers.PC.getUInt16(0));

        const instructionMap: { [key: number]: () => void } = {
            0: this.NOP,
            0xff: this.HLT,
            0x10: this.MOV_REG_REG,
            0x11: this.MOV_REG_ADD,
            0x12: this.MOV_IMM_REG,
        };

        const method = instructionMap[opCode];
        this.incrementPC();
        method.bind(this)();
    }

    private incrementPC() {
        this.registers.PC.setUInt16(0, this.registers.PC.getUInt16(0) + 1);
        return this.registers.PC.getUInt16(0);
    }

    private NOP() {}

    private HLT() {
        this.flags.HLT = true;
    }

    private MOV_REG_REG() {
        const register1 = this.getRegisterFromNumber(this.fetch8());
        const register2 = this.getRegisterFromNumber(this.fetch8());

        if (!register1 || !register2) return;

        register2.setUInt16(0, register1.getUInt16(0));
    }

    private MOV_REG_ADD() {
        const register = this.getRegisterFromNumber(this.fetch8());
        const address = this.fetch16();

        if (!register) return;

        this.memory.setUInt16(address, register.getUInt16(0));
    }

    private MOV_IMM_REG() {
        const value = this.fetch16();
        const register = this.getRegisterFromNumber(this.fetch8());
        if (!register) return;
        register.setUInt16(0, value);
    }
}

export default Processor;
