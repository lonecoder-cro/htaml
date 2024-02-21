export default class Token {
  __type: number;
  __name: string;
  __index: number;
  __value: string|number;

  constructor(name: string, type: number, value: string|number, index: number) {
    this.__name = name;
    this.__type = type;
    this.__value = value;
    this.__index = index;
  }

  get value() {
    return this.__value;
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
