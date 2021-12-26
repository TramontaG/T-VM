import { register } from "../../Software/Assembler/Parser/Atoms";
import Memory from "../Memory";
import Register from "./Register";

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
    [property in GeneralRegisters]: Register;
};

class Processor {
    memory: Memory;
    registers: Registers;
    flags: Flags;

    constructor(options: Options) {
        this.memory = options.memory;
        this.registers = {
            R1: new Register(2),
            R2: new Register(2),
            R3: new Register(2),
            R4: new Register(2),
            R5: new Register(2),
            R6: new Register(2),
            R7: new Register(2),
            R8: new Register(2),
            ACC: new Register(2),
            SP: new Register(2),
            FP: new Register(2),
            PC: new Register(16 / 8),
        };

        this.registers.SP.setValue(0xfffe);
        this.registers.FP.setValue(0xfffe);

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
        this.incrementPC(2);
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
            0x1a: this.PSH_REG,
            0x1b: this.PSH_IMM,
            0x1c: this.POP_REG,
        };

        const method = instructionMap[opCode];
        this.incrementPC();
        method.bind(this)();
    }

    private incrementPC(amount?: number) {
        this.registers.PC.increment(amount);
        return this.registers.PC.getValue();
    }

    private NOP() {}

    private HLT() {
        this.flags.HLT = true;
    }

    private MOV_REG_REG() {
        const register1 = this.getRegisterFromNumber(this.fetch8());
        const register2 = this.getRegisterFromNumber(this.fetch8());

        if (!register1 || !register2) return;

        register2.setValue(register1.getValue());
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
        register.setValue(value);
    }

    private PSH_REG() {
        const register = this.getRegisterFromNumber(this.fetch8());
        const whereStackPointerIsPointing = this.registers.SP.getUInt16(0);
        if (!register) return;
        this.memory.setUInt16(whereStackPointerIsPointing, register.getValue());
        this.registers.SP.decrement(2);
    }

    private PSH_IMM() {
        const value = this.fetch16();
        const whereStackPointerIsPointing = this.registers.SP.getUInt16(0);
        this.memory.setUInt16(whereStackPointerIsPointing, value);
        this.registers.SP.decrement(2);
    }

    private POP_REG() {
        this.registers.SP.increment(2);
        const whereStackPointerIsPointing = this.registers.SP.getUInt16(0);
        const value = this.memory.getUInt16(whereStackPointerIsPointing);
        const register = this.getRegisterFromNumber(this.fetch8());
        if (!register) return;
        register.setValue(value);
    }
}

export default Processor;
