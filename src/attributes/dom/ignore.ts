import { removeHTAMLAttributeFromHTAMLElement } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function domIgnore(htamlElement: HTAMLElement, attribute: any, stepThroughHTAMLElements: any) {
  // ignore any element with this attribute
  if (attribute.value === "this") { //ignore the current element only, all child elements or processed
    htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)
    stepThroughHTAMLElements(htamlElement.childrens)
  } else if (attribute.value === "all") {//ignore all
  }
  return null

}
