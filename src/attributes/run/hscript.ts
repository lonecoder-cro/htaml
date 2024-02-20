import { createEvent, getHTAMLElementByDomId, htamlEvalHScript, removeHTAMLAttributeFromHTAMLElement, replaceVariable } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function runHScript(htamlElement: any, attribute: any): HTAMLElement | null {
    // runs javscript code
    let value = replaceVariable(attribute.value, htamlElement) as any
    if (value) {
        value = value.replace(/\s\s/g, "")
        htamlElement.variables["hscript"] = htamlEvalHScript(value)
    }
    return htamlElement
}
