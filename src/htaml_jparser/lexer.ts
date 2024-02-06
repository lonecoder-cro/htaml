import Parser from "./parser";
import Types from "./types";
import Token from "./token";
import { isLetter, isNumber } from "../core/utils";

export default class Lexer {
  index: number = 0;
  tokens: Array<any> = [];
  jsonLikeObject: string = "";
  current_character: any = null;

  private advance() {
    if (this.index >= this.jsonLikeObject.length) {
      this.current_character = null;
    } else this.current_character = this.jsonLikeObject[this.index++];
  }

  private createId() {
    let token = "";
    while (isLetter(this.current_character) || this.current_character == "_") {
      token += this.current_character;
      this.advance();
    }
    return token;
  }

  private createString() {
    const matchCharacter = this.current_character;
    this.advance();
    let tmp_str: string = "";
    while (this.current_character != matchCharacter) {
      tmp_str += this.current_character;
      this.advance();
    }
    return tmp_str;
  }

  private createNumber() {
    let tmp_str: string = "";
    while (isNumber(this.current_character)) {
      tmp_str += this.current_character;
      this.advance();
    }
    return Number(tmp_str);
  }

  public toTokens(jsonLikeObject: string) {
    this.jsonLikeObject = jsonLikeObject;
    this.advance();

    while (this.current_character != null) {
      if (isNumber(this.current_character)) this.tokens.push(new Token("INT", Types.INT, this.createNumber(), Number(this.index)));
      if (this.current_character === '"' || this.current_character === "'") this.tokens.push(new Token("STR", Types.STR, this.createString(), Number(this.index)));
      if (isLetter(this.current_character)) this.tokens.push(new Token("ID", Types.ID, this.createId(), Number(this.index)));

      switch (this.current_character) {
        case "\n":
          continue;
        case ":":
          this.tokens.push(new Token("COLON", Types.COLON, this.current_character, Number(this.index)));
          break;
        case "{":
          this.tokens.push(new Token("LEFT_BRACE", Types.LEFT_BRACE, this.current_character, Number(this.index)));
          break;
        case "}":
          this.tokens.push(new Token("RIGHT_BRACE", Types.RIGHT_BRACE, this.current_character, Number(this.index)));
          break;
        case "[":
          this.tokens.push(new Token("LEFT_BRACK", Types.LEFT_BRACK, this.current_character, Number(this.index)));
          break;
        case "]":
          this.tokens.push(new Token("RIGHT_BRACK", Types.RIGHT_BRACK, this.current_character, Number(this.index)));
          break;
        case "(":
          this.tokens.push(new Token("LEFT_PAREN", Types.LEFT_PAREN, this.current_character, Number(this.index)));
          break;
        case ")":
          this.tokens.push(new Token("RIGHT_PAREN", Types.RIGHT_PAREN, this.current_character, Number(this.index)));
          break;
      }
      this.advance();
    }
    return this.tokens;
  }
}
