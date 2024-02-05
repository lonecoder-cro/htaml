import { isColon, isComma, isLetter, isWhiteSpace } from "./utils";

enum JTypes {
  ID,
  STR,
  NUMBER,
  LEFT_BRACE,
  RIGHT_BRACE,
  LEFT_BRACK,
  RIGHT_BRACK,
  LEFT_PAREN,
  RIGHT_PAREN,
}

class JToken {
  __type: number;
  __name: string;
  __index: number;

  constructor(name: string, type: number, index: number) {
    this.__name = name;
    this.__type = type;
    this.__index = index;
  }

  get name() {
    return this.__name;
  }
  get type() {
    return this.__type;
  }
  get index() {
    return this.__index;
  }
}

export default class ToJObject {
  __index: number = 0;
  __tokens: Array<any> = [];
  __litterals: Array<string> = [];
  __json: any = [];

  constructor() {}

  public toJavascriptObject(jsonLikeObject: string) {
    this.lexer(jsonLikeObject);
  }

  private parse() {
    for (const token of this.__tokens) {
      if (token.type != JTypes.LEFT_BRACE) return;

      // console.log(token.name);
    }
  }

  private lexer(str: any) {
    for (const index in str) {
      const token = str[index];
      if (token === "{") this.__tokens.push(new JToken("LEFT_BRACE", JTypes.LEFT_BRACE, Number(index)));
      else if (token === "}") this.__tokens.push(new JToken("RIGHT_BRACE", JTypes.LEFT_BRACE, Number(index)));
      if (token === "[") this.__tokens.push(new JToken("LEFT_BRACK", JTypes.LEFT_BRACE, Number(index)));
      else if (token === "]") this.__tokens.push(new JToken("RIGHT_BRACK", JTypes.LEFT_BRACE, Number(index)));
      if (token === "(") this.__tokens.push(new JToken("LEFT_PAREN", JTypes.LEFT_BRACE, Number(index)));
      else if (token === ")") this.__tokens.push(new JToken("RIGHT_PAREN", JTypes.LEFT_BRACE, Number(index)));
    }

    this.parse();
  }
}
