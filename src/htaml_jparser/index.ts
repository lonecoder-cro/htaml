import Lexer from "./lexer";
import Parser from "./parser";

export default class HTAMLJParser {
  constructor(jsonLikeString: string) {
    const tokens = new Lexer().toTokens(jsonLikeString);
    const json = new Parser(tokens).parse();
    return json;
  }
}
