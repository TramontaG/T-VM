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

    ADD: {
        register_register: {
            opCode: 0xa0,
            sizeInBytes: 3,
        },
        immediate_register: {
            opCode: 0xa1,
            sizeInBytes: 4,
        },
    },
    SUB: {
        register_register: {
            opCode: 0xa2,
            sizeInBytes: 3,
        },
        register_immediate: {
            opCode: 0xa3,
            sizeInBytes: 4,
        },
    },
    AOR: {
        register_register: {
            opCode: 0xa4,
            sizeInBytes: 3,
        },
        immediate_register: {
            opCode: 0xa5,
            sizeInBytes: 4,
        },
    },
    AND: {
        register_register: {
            opCode: 0xa6,
            sizeInBytes: 3,
        },
        immediate_register: {
            opCode: 0xa7,
            sizeInBytes: 4,
        },
    },
    NOT: {
        register: {
            opCode: 0xa8,
            sizeInBytes: 2,
        },
    },
    SFL: {
        register_immediateByte: {
            opCode: 0xa9,
            sizeInBytes: 3,
        },
    },
    SFR: {
        register_immediateByte: {
            opCode: 0xaa,
            sizeInBytes: 3,
        },
    },
    //conditions
    EQL: {
        register_register: {
            opCode: 0xb0,
            sizeInBytes: 3,
        },
        register_immediate: {
            opCode: 0xb1,
            sizeInBytes: 4,
        },
        register_address: {
            opCode: 0xb2,
            sizeInBytes: 4,
        },
    },
    GTR: {
        register_register: {
            opCode: 0xb3,
            sizeInBytes: 3,
        },
        register_immediate: {
            opCode: 0xb4,
            sizeInBytes: 4,
        },
        register_address: {
            opCode: 0xb5,
            sizeInBytes: 4,
        },
    },
    LSS: {
        register_register: {
            opCode: 0xb6,
            sizeInBytes: 3,
        },
        register_immediate: {
            opCode: 0xb7,
            sizeInBytes: 4,
        },
        register_address: {
            opCode: 0xb8,
            sizeInBytes: 4,
        },
    },
    GEQ: {
        register_register: {
            opCode: 0xb9,
            sizeInBytes: 3,
        },
        register_immediate: {
            opCode: 0xba,
            sizeInBytes: 4,
        },
        register_address: {
            opCode: 0xbb,
            sizeInBytes: 4,
        },
    },
    LEQ: {
        register_register: {
            opCode: 0xbc,
            sizeInBytes: 3,
        },
        register_immediate: {
            opCode: 0xbd,
            sizeInBytes: 4,
        },
        register_address: {
            opCode: 0xbe,
            sizeInBytes: 4,
        },
    },
    EIF: {
        noArgs: {
            opCode: 0xbf,
            sizeInBytes: 1,
        },
    },
    REP: {
        immediateByte: {
            opCode: 0xc0,
            sizeInBytes: 2,
        },
    },
    ERP: {
        noArgs: {
            opCode: 0xc1,
            sizeInBytes: 1,
        },
    },
    //Subrotines

    JSR: {
        address: {
            opCode: 0xc2,
            sizeInBytes: 3,
        },
    },
    RET: {
        noArgs: {
            opCode: 0xc4,
            sizeInBytes: 1,
        },
    },

    ARG: {
        immediateByte_register: {
            opCode: 0xc5,
            sizeInBytes: 1,
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
    ACC: 0x0f,
    SP: 0x0a,
    FP: 0x0b,
};
