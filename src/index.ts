import Memory from "./Hardware/Memory";
import Processor from "./Hardware/Processor";

const processorMemory = new Memory(0xffff);
const processor = new Processor({
    memory: processorMemory,
});

while (true) {
    processor.onClock();
    if (processor.flags.HLT) break;
}
