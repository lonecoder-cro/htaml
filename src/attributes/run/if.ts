import { htamlEval, removeClassesFromHTAMLElement, removeHTAMLAttributeFromHTAMLElement, replaceVariable } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function runIf(htamlElement: any, attribute: any): HTAMLElement | null {
    const element = htamlElement.root as HTMLElement
    element.classList.add("htaml-hide")
    let value = replaceVariable(attribute.value, htamlElement, { isIf: true })
    if (!value) return null
    const result = htamlEval(value)
    if (!result) { element.remove(); return null }

    htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, { action: 'cloak' } as any)
    removeClassesFromHTAMLElement(htamlElement, ["htaml-cloak", "htaml-hide"])

    return htamlElement
}
