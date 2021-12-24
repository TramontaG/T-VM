import * as T from "@guigalleta/t-parser";
import * as atoms from "./Atoms";

export const anythingUntilLineBreak = T.regexMatch(/^.+/);
export const anythingUntilEndComment = T.regexMatch(/(.*)(?=\*\/)/);

export const singleLineComment = T.transform(
    T.sequenceOf([T.str("//"), anythingUntilLineBreak], "singleLineComment"),
    ({ result }) => ({
        type: "comment",
        value: result[1],
    })
);

export const multipleLinesComment = T.transform(
    T.sequenceOf([
        T.str("/*"),
        T.maybeSome(T.sequenceOf([anythingUntilLineBreak, T.str("\n")])),
        T.maybe(anythingUntilEndComment),
        T.str("*/"),
    ]),
    ({ result }) => ({
        type: "comment",
        value: result[1]?.flat() + result[2],
    })
);

export const comment = T.choice([singleLineComment, multipleLinesComment]);
