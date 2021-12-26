import Memory from "./../Memory";

class Register extends Memory {
    constructor(sizeInBytes: number) {
        super(sizeInBytes);
    }

    increment(amount?: number) {
        this.memoryManager.setUint16(
            0,
            this.memoryManager.getUint16(0) + (amount || 1)
        );
    }

    decrement(amount?: number) {
        this.memoryManager.setUint16(
            0,
            this.memoryManager.getUint16(0) - (amount || 1)
        );
    }

    setValue(value: number) {
        this.memoryManager.setUint16(0, value);
    }

    getValue() {
        return this.memoryManager.getUint16(0);
    }
}

export default Register;
