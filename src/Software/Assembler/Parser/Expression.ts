import * as T from "@guigalleta/t-parser";
import { name } from "./Atoms";

const lazy = (getParserFn: () => T.Parser) => (parserState: T.ParserState) => {
    const parser = getParserFn();
    return parser(parserState);
};

const betweenParenthesis = T.between(T.str("("), T.str(")"));

const variableRead = T.transform(name, ({ result }) => ({
    type: "variableRead",
    value: result,
}));

const value = T.transform(T.digits, ({ result }) => ({
    type: "directValue",
    value: Number(result),
}));

const add = T.transform(T.str("+"), (_) => "add");
const subtract = T.transform(T.str("-"), (_) => "subtract");
const divide = T.transform(T.str("/"), (_) => "divide");
const multiply = T.transform(T.str("*"), (_) => "multiply");

const operator = T.transform(
    T.choice([add, multiply, divide, subtract], "operator"),
    ({ result }) => ({
        type: "operator",
        value: result,
    })
);

const expression = lazy(() =>
    T.choice(
        [value, variableRead, expression, bracketedExpression],
        "expression"
    )
);

const operation = T.transform(
    T.sequenceOf([expression, operator, expression], "operation"),
    ({ result }) => ({
        type: "operation",
        operator: result[1].value,
        left: result[0],
        right: result[2],
    })
);

const bracketedExpression = T.transform(
    betweenParenthesis(T.choice([operation, expression])),
    ({ result }) => ({
        type: "operation",
        value: result,
    })
);

const string = "(3+2*5)";
const parserResult = T.parse(string, bracketedExpression);
console.log(JSON.stringify(parserResult, null, "    "));

export default expression;

const evaluate = (node: T.ParserState["result"]): number => {
    if (node.type === "directValue") return node.value as number;
    if (node.type === "operation") {
        if (node.value.operator === "add")
            return evaluate(node.value.left) + evaluate(node.value.right);
        if (node.value.operator === "subtract")
            return evaluate(node.value.left) - evaluate(node.value.right);
        if (node.value.operator === "divide")
            return evaluate(node.value.left) / evaluate(node.value.right);
        if (node.value.operator === "multiply")
            return evaluate(node.value.left) * evaluate(node.value.right);
    }
    return NaN;
};

console.log(evaluate(parserResult.result));
