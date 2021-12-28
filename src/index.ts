import Memory from "./Hardware/Memory";
import Processor from "./Hardware/Processor";
import assemble from "./Software/Assembler/Assembler";
import { createCpuDebugger, createMemoryDebugger } from "./Util/Log/Logger";

assemble().then((program) => {
    const memory = new Memory(0x10000);
    memory.memoryManager = program;
    const processor = new Processor({
        memory,
    });

    const CPUDebugger = createCpuDebugger(processor);
    const MemoryDebugger = createMemoryDebugger(memory, "MainMemory");
    const StackDebugger = createMemoryDebugger(memory, "Stack");
    MemoryDebugger.debugAt(0);

    let instructionCount = 0;
    while (instructionCount < 50) {
        processor.onClock();
        if (processor.flags.HLT) break;
        instructionCount++;
    }

    StackDebugger.debugAt(0xfff0);
    CPUDebugger.debugRegisters();
    console.log(processor.flags);
});
