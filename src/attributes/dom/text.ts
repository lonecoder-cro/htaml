import { htamlEval, replaceVariable } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function domText(htamlElement: HTAMLElement, attribute: any) {
  // set the inner text of a element
  let value = attribute.value
  const element = <HTMLElement | any>htamlElement.root

  element.removeAttribute(attribute.action)
  const variables = value.split(",").reverse()
  for (const variable of variables) {
    value = replaceVariable(variable, htamlElement)
    if (value) {
      value = htamlEval(value)
      if (value) element.insertAdjacentText("afterbegin", value)
    }
  }
}