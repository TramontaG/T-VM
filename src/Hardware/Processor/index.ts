import Memory from "../Memory";

enum GeneralRegisters {
    R1 = "R1",
    R2 = "R2",
    R3 = "R3",
    R4 = "R4",
    R5 = "R5",
    R6 = "R6",
    R7 = "R7",
    R8 = "R8",
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
    programCounter: Memory;
    flags: Flags;

    constructor(options: Options) {
        this.memory = options.memory;
        this.registers = {
            R1: new Memory(16),
            R2: new Memory(16),
            R3: new Memory(16),
            R4: new Memory(16),
            R5: new Memory(16),
            R6: new Memory(16),
            R7: new Memory(16),
            R8: new Memory(16),
        };

        this.flags = {
            HLT: false,
        };

        this.programCounter = new Memory(16 / 8);
    }

    onClock() {
        this.runInstruction();
    }

    private runInstruction() {
        const opCode = this.memory.getUInt8(this.programCounter.getUInt16(0));

        const instructionMap: { [key: number]: () => void } = {
            0: this.noOp,
            0xff: this.halt,
        };

        const method = instructionMap[opCode];
        method.bind(this)();
    }

    private incrementPC() {
        this.programCounter.setUInt16(0, this.programCounter.getUInt16(0) + 1);
        return this.programCounter.getUInt16(0);
    }

    private noOp() {
        console.log(this.incrementPC());
    }

    private halt() {
        this.incrementPC();
        this.flags.HLT = true;
    }
}

export default Processor;
