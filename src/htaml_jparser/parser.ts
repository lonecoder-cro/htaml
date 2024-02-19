import Token from "./token";
import Types from "./types";

export default class Parser {
  tokens: Array<Token>;
  index: number = 0;
  current_token: any = null;
  json: any = {};

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.current_token = this.tokens[this.index];
  }

  private advance() {
    if (this.index >= this.tokens.length) {
      this.current_token = null;
    } else this.current_token = this.tokens[++this.index];
  }

  private lookahead(position: number) {
    if (position >= this.tokens.length) return null;
    return this.tokens[this.index + position];
  }

  private lookback(position: number) {
    if (position >= this.tokens.length) return null;
    return this.tokens[this.index - position];
  }

  parse() {
    if (this.current_token.type != Types.LEFT_BRACE) return;
    this.advance();
    while (this.current_token != null) {
      if (this.current_token.type == Types.ID && this.lookahead(1)?.type == Types.COLON) { //key value paris
        this.json[this.current_token.value] = this.lookahead(2)?.value;
      }
      this.advance();
    }

    return this.json;
  }
}
