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
    PSH: {
        register: {
            opCode: 0x10,
            sizeInBytes: 2,
        },
        address: {
            opCode: 0x11,
            sizeInBytes: 3,
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
    ACC: 0x10,
    PC: 0x00,
};
