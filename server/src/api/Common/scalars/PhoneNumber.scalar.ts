import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

function serialize(val: string) {
    const result = val.replace(/[\s-]+/g, "");
    const validation = result.length < 14 && /^[0-9+]+\w$/g.test(result);
    if (!validation) {
        throw new Error("Invalid PhoneNumber");
    }
    return result;
}

function parseValue(value: string) {
    return serialize(value);
}

function parseLiteral(ast) {
    return ast.kind === Kind.STRING ? parseValue(ast.value) : null;
}

export default new GraphQLScalarType({
    name: "PhoneNumber",
    description:
        "전화번호임. 특수문자(+,-만 사용 가능), 문자열 수 14자 이하, 숫자 only",
    serialize,
    parseValue,
    parseLiteral
});