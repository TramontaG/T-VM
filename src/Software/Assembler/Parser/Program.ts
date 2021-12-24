import * as T from "@guigalleta/t-parser";
import * as atoms from "./Atoms";
import { instruction } from "./Instruction";
import { comment } from "./Comments";

const lineFeed = T.str("\n");
const lineContent = T.choice([atoms.label, instruction, comment, lineFeed]);

const line = T.transform(
    T.sequenceOf([
        T.maybeSome(T.str("\n")),
        T.maybeSome(T.anySpace),
        lineContent,
        T.maybeSome(T.anySpace),
        T.str("\n"),
    ]),
    ({ result }) => result[2]
);

const programParser = T.atLeastOne(line);

const program = `
label: 
    ADD R2 R3;
    //mano esse é um comentário taligado
    PSH R1;
    POP R2;
    /* apenas um comment 
label:
    HLT;*/
`;

const parser = programParser;
const parserResult = T.parse(program, parser);
console.log(parserResult);
