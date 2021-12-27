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
    CARRY: boolean;
    ZERO: boolean;
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
            PC: new Register(2),
        };

        this.registers.SP.setValue(0xfffe);
        this.registers.FP.setValue(0xfffe);

        this.flags = {
            HLT: false,
            CARRY: false,
            ZERO: false,
        };
    }

    onClock() {
        console.log(
            "RUNNING INSTRUCTION ON ADDRESS",
            this.registers.PC.getUInt16(0)
                .toString(16)
                .toUpperCase()
                .padStart(2, "0")
        );
        this.runInstruction();
    }

    getRegisterFromNumber(number: number) {
        const registerArr: { [key: number]: Register } = {
            0x01: this.registers.R1,
            0x02: this.registers.R2,
            0x03: this.registers.R3,
            0x04: this.registers.R4,
            0x05: this.registers.R5,
            0x06: this.registers.R6,
            0x07: this.registers.R8,
            0x08: this.registers.R7,
            0x0a: this.registers.SP,
            0x0b: this.registers.FP,
            0x0f: this.registers.ACC,
        };

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

    private fetchRegister() {
        return this.getRegisterFromNumber(this.fetch8());
    }

    private runInstruction() {
        const opCode = this.memory.getUInt8(this.registers.PC.getUInt16(0));

        const instructionMap: { [key: number]: () => void } = {
            0: this.NOP,
            0xff: this.HLT,
            0x10: this.MOV_REG_REG,
            0x11: this.MOV_REG_ADD,
            0x12: this.MOV_IMM_REG,
            0x13: this.MOV_ADD_REG,
            0x14: this.MOV_ADD_REGP,
            0x15: this.MOV_IMM_ADD,
            0x1a: this.PSH_REG,
            0x1b: this.PSH_IMM,
            0x1c: this.POP_REG,
            0x20: this.JMP_ADD,
            0x21: this.JMP_REGP,
            0xa0: this.ADD_REG_REG,
            0xa1: this.ADD_IMM_REG,
            0xa2: this.SUB_REG_REG,
            0xa3: this.SUB_IMM_REG,
        };

        const method = instructionMap[opCode];
        console.log("RUNNING METHOD", method);
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

    //Moving data
    private MOV_REG_REG() {
        const register1 = this.fetchRegister();
        const register2 = this.fetchRegister();

        console.log("reg1 =", register1, "reg2 =", register2);
        if (!register1 || !register2) return;

        register2.setValue(register1.getValue());
    }

    private MOV_REG_ADD() {
        const register = this.fetchRegister();
        const address = this.fetch16();

        if (!register) return;

        this.memory.setUInt16(address, register.getUInt16(0));
    }

    private MOV_IMM_REG() {
        const value = this.fetch16();
        const register = this.fetchRegister();
        if (!register) return;
        register.setValue(value);
    }

    private MOV_ADD_REG() {
        const address = this.fetch16();
        const register = this.fetchRegister();
        if (!register) return;
        register.setValue(this.memory.getUInt16(address));
    }

    private MOV_ADD_REGP() {
        const address = this.fetch16();
        const register = this.fetchRegister();
        if (!register) return;
        register.setValue(address);
    }

    private MOV_IMM_ADD() {
        const value = this.fetch16();
        const address = this.fetch16();
        this.memory.setUInt16(address, value);
    }

    //Stack manipulation
    private PSH_REG() {
        const register = this.fetchRegister();
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
        const register = this.fetchRegister();
        if (!register) return;
        register.setValue(value);
    }

    //Branching
    private JMP_ADD() {
        const address = this.fetch16();
        this.registers.PC.setValue(address);
    }

    private JMP_REGP() {
        const register = this.fetchRegister();
        if (!register) return;
        this.registers.PC.setValue(register.getValue());
    }

    //ALU
    private ADD_REG_REG() {
        const reg1 = this.fetchRegister();
        const reg2 = this.fetchRegister();
        if (!reg1 || !reg2) return;

        const value = reg1.getValue() + reg2.getValue();
        if (value > 0xffff) this.flags.CARRY = true;

        this.registers.ACC.setValue(value & 0xffff);
    }

    private ADD_IMM_REG() {
        const immediate = this.fetch16();
        const register = this.fetchRegister();
        if (!register) return;

        const value = immediate + register.getValue();
        if (value > 0xffff) this.flags.CARRY = true;

        this.registers.ACC.setValue(value & 0xffff);
    }

    private SUB_REG_REG() {
        const reg1 = this.fetchRegister();
        const reg2 = this.fetchRegister();
        if (!reg1 || !reg2) return;

        const value = reg1.getValue() - reg2.getValue();
        if (value < 0) this.flags.ZERO = true;

        this.registers.ACC.setValue(value & 0xffff);
    }

    private SUB_IMM_REG() {
        const register = this.fetchRegister();
        const immediate = this.fetch16();
        if (!register) return;

        const value = register.getValue() - immediate;
        console.log(`${immediate} - ${register.getValue()} = ${value}`);
        if (value < 0) this.flags.ZERO = true;

        this.registers.ACC.setValue(value & 0xffff);
    }
}

export default Processor;
