import { htamlEvalHScript, replaceVariable } from "../core/utils"

export default function hScript(htamlElement: any): null {
    /*        Note: The results of a hscript will always be place on the parent tag    */
    let root: HTMLElement = htamlElement.root
    let code: string = root.innerText
    let variable: any = code.match(/return\s(\w+)/) //the name of the return variable

    if (variable && variable.length > 2) return null// only allow one return variable
    if (variable && variable.length == 2) variable = variable[1]

    code = replaceVariable(code, htamlElement) as any
    if (code) {
        code = code.replace(/\s\s/g, "")
        const result = htamlEvalHScript(code)
        if (result && variable) htamlElement.parent.variables[variable] = result
    }
    return null
}
