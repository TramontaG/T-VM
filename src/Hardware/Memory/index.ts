class Memory {
    memory: ArrayBuffer;
    memoryManager: DataView;

    constructor(sizeInBytes: number) {
        this.memory = new ArrayBuffer(sizeInBytes);
        this.memoryManager = new DataView(this.memory);
    }

    getUInt16(offset: number) {
        return this.memoryManager.getUint16(offset);
    }

    setUInt16(offset: number, value: number) {
        return this.memoryManager.setUint16(offset, value);
    }

    getUInt8(offset: number) {
        return this.memoryManager.getUint8(offset);
    }

    setUInt8(offset: number, value: number) {
        return this.memoryManager.setUint8(offset, value);
    }
}

export default Memory;
