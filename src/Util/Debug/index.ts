import Processor from "../../Hardware/Processor";
import { createCpuDebugger, createMemoryDebugger } from "../Log/Logger";
import * as readline from "readline";
import util from "util";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);

const startDebug = (processor: Processor) => {
    const CPUDebugger = createCpuDebugger(processor);
    const memoryDebugger = createMemoryDebugger(
        processor.memory,
        "Memory debugger"
    );

    return async () => {
        processor.onClock();
        CPUDebugger.debugRegisters();
        CPUDebugger.debugFlags();

        memoryDebugger.debugFrom(0xffc0).to(0xffff);

        const result = await question("Press Enter for next clock");
    };
};

export default startDebug;
