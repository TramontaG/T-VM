import Memory from "./Hardware/Memory";
import Processor from "./Hardware/Processor";
import assemble from "./Software/Assembler/Assembler";
import startDebug from "./Util/Debug";
import { createCpuDebugger, createMemoryDebugger } from "./Util/Log/Logger";

const debugMode = true;

assemble().then((program) => {
    const memory = new Memory(0x10000);
    memory.memoryManager = program;
    const processor = new Processor({
        memory,
    });

    if (debugMode) return manualExecute(processor);
    execute(processor);
});

const execute = (processor: Processor) => {
    const CPUDebugger = createCpuDebugger(processor);

    for (let i = 0; i < 50; i++) {
        processor.onClock();
        if (processor.flags.HLT) break;
    }

    CPUDebugger.debugRegisters();
    console.log(processor.flags);
};

const manualExecute = (processor: Processor) => {
    const manualClock = startDebug(processor);

    const askManualClock = async () => {
        console.clear();
        await manualClock();
        if (processor.flags.HLT) return;
        askManualClock();
    };

    askManualClock();
};
