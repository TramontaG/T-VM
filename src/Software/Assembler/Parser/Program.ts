import * as T from "@guigalleta/t-parser";
import * as atoms from "./Atoms";
import { instruction } from "./Instruction";
import { comment } from "./Comments";

const lineFeed = T.str("\n");
const lineContent = T.choice([
    atoms.labelDeclaration,
    instruction,
    comment,
    lineFeed,
]);

const line = T.transform(
    T.sequenceOf([
        T.maybeSome(atoms.lineBreak),
        T.maybeSome(T.anySpace),
        lineContent,
        T.maybeSome(T.anySpace),
        atoms.lineBreak,
    ]),
    ({ result }) => result[2]
);

const programParser = T.atLeastOne(line);

export default (string: string) => T.parse(string, programParser);
