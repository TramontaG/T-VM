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
        this.runInstruction();
    }

    private runInstruction() {
        const opCode = this.memory.getUInt8(this.registers.PC.getUInt16(0));

        const instructionMap: { [key: number]: () => void } = {
            0: this.NOP,
            0xff: this.HLT,
        };

        const method = instructionMap[opCode];
        method.bind(this)();
    }

    private incrementPC() {
        this.registers.PC.setUInt16(0, this.registers.PC.getUInt16(0) + 1);
        return this.registers.PC.getUInt16(0);
    }

    private NOP() {
        this.incrementPC();
    }

    private HLT() {
        this.incrementPC();
        this.flags.HLT = true;
    }
}

export default Processor;
