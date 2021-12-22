import Memory from "./Hardware/Memory";

const testMemory = new Memory(128);
testMemory.setUInt16(0, 0xffff);

console.log(testMemory.getUInt16(0));
console.log(testMemory.getUInt8(0));
console.log(testMemory.getUInt8(1));
console.log(testMemory.getUInt8(2));

testMemory.setUInt16(126, 0x0506);
console.log(testMemory.getUInt8(126));
console.log(testMemory.getUInt8(127));

try {
    console.log(testMemory.getUInt8(128));
} catch (e) {
    console.log("offset is outside the bounds of dataview");
}
