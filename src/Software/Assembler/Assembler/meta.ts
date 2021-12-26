export const instructions = {
    NOP: {
        noArgs: {
            opCode: 0x00,
            sizeInBytes: 1,
        },
    },
    HLT: {
        noArgs: {
            opCode: 0xff,
            sizeInBytes: 1,
        },
    },
    MOV: {
        register_register: {
            opCode: 0x10,
            sizeInBytes: 3,
        },
        register_address: {
            opCode: 0x11,
            sizeInBytes: 4,
        },
        immediate_register: {
            opCode: 0x12,
            sizeInBytes: 4,
        },
        address_register: {
            opCode: 0x13,
            sizeInBytes: 4,
        },
        address_registerPointer: {
            opCode: 0x14,
            sizeInBytes: 4,
        },
        immediate_address: {
            opCode: 0x15,
            sizeInBytes: 5,
        },
    },

    PSH: {
        register: {
            opCode: 0x1a,
            sizeInBytes: 2,
        },
        immediate: {
            opCode: 0x1b,
            sizeInBytes: 3,
        },
    },

    POP: {
        register: {
            opCode: 0x1c,
            sizeInBytes: 2,
        },
    },

    JMP: {
        address: {
            opCode: 0x20,
            sizeInBytes: 3,
        },
        registerPointer: {
            opCode: 0x21,
            sizeInBytes: 2,
        },
    },
};

export const registers = {
    R1: 0x01,
    R2: 0x02,
    R3: 0x03,
    R4: 0x04,
    R5: 0x05,
    R6: 0x06,
    R7: 0x07,
    R8: 0x08,
    ACC: 0x00,
    SP: 0x0a,
    FP: 0x0b,
};
