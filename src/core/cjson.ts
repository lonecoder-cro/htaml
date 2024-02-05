import { isColon, isComma, isLetter, isWhiteSpace } from "./utils"

enum Token {
    LEFT_BRACE = '{',
    COLON = ':',
}

abstract class CToken {

    token: any = {
        name: ''
    }

    static newCToken(litteral: string, index: number) {


    }

    static createToken(litteral: string, index: number) {
        switch (litteral) {
            case Token.LEFT_BRACE:
            // return CToken.newCToken(Token.LEFT_BRACE,index)
        }

    }

}

export default class CJson {

    __index: number = 0
    __tokens: Array<any> = []
    __litterals: Array<string> = []
    __json: any = []

    constructor() {

    }

    private __advance(skipWhiteSpace: boolean = true) {
        ++this.__index
        if (skipWhiteSpace) {
            while (isWhiteSpace(this.__getLitteral())) {
                console.log(this.__getLitteral())
                this.__advance()
            }
        }
    }

    parseToJSON(data: string) {
        this.__litterals = data.split('')
        this.__lexer()
        return new Object(this.__json);
    }

    private __hasLitteral() {
        return true ? this.__index < this.__litterals.length : false
    }

    private __getLitteral() {
        return this.__litterals[this.__index].trim()
    }

    private __createStringFromLetter() {
        let string = ''
        while (isLetter(this.__getLitteral())) {
            string += this.__getLitteral()
            this.__advance(false)
        }
        return string
    }

    private __extractValue() {
        //values van be a string,number,array or object
        let value = null
        if (this.__getLitteral() === "'" || this.__getLitteral() === '"') {
            this.__advance()
            //extract string if (isLetter(this.__getLitteral())) value = this.__createStringFromLetter()
            value = this.__createStringFromLetter()

        }

        //end of a stirng will be ' or a " so we advance
        this.__advance()
        return value
    }

    private __lexer() {
        if (this.__getLitteral() !== Token.LEFT_BRACE) return
        this.__advance()

        while (this.__hasLitteral()) {
            if (!isLetter(this.__getLitteral())) return
            const key = this.__createStringFromLetter()

            //after each key should be a colon
            if (!isColon(this.__getLitteral())) return
            this.__advance()

            const value = this.__extractValue()
            this.__json[`${key}`] = value

            //after each value should be a comma or a right bracket
            if (isComma(this.__getLitteral())) this.__advance()
            else break
        }


    }
}
