import { HTAMLElement } from "./interface"
import handleDomAttribute from "../handlers/dom"
import handleOnAttribute from "../handlers/on"
import handleRunAttribute from "../handlers/run"
import handleHScript from "../handlers/hscript"
import handleReqAttribute from "../handlers/req"

function stepThroughHTAMLElement(htamlElement: any): HTAMLElement | null {
  for (const _a of htamlElement.attributes) {
    switch (_a.id.split("-")[1]) {
      case "hscript":
        if (_a.value) handleHScript(htamlElement)
        return null
      case "run":
        htamlElement = handleRunAttribute(htamlElement, _a, stepThroughHTAMLElement)
        if (!htamlElement) return null
        break
      case "req":
        htamlElement = handleReqAttribute(htamlElement, _a, stepThroughHTAMLElement)
        if (!htamlElement) return null
        break
      case "on":
        return handleOnAttribute(htamlElement, _a, stepThroughHTAMLElement, stepThroughHTAMLElements,)
      case "dom":
        htamlElement = handleDomAttribute(htamlElement, _a, stepThroughHTAMLElement, stepThroughHTAMLElements,)
        if (!htamlElement) return null
        break
    }
  }
  return htamlElement
}

export function stepThroughHTAMLElements(htamlElements: any) {
  htamlElements = htamlElements

  if (htamlElements) {
    for (let _a of htamlElements) {
      _a = stepThroughHTAMLElement(_a)
      if (_a) if (_a.childrens) _a = stepThroughHTAMLElements(_a.childrens) as any
    }
  }
}
