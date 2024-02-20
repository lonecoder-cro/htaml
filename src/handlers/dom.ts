import { HTAMLElement } from "../htaml/interface"

import HTAMLJParser from "../htaml_jparser"
import { domIgnore, domBindTo, domCloak, domId, domData, domDefaultAttr, domProc, domSwap, domText, domSwitch } from "../attributes/dom"

export default function handleDomAttribute(htamlElement: HTAMLElement, attribute: any, stepThroughHTAMLElement: any, stepThroughHTAMLElements: any,): HTAMLElement | null {
    switch (attribute.action) {
        case "id"://identifier for a element,can be overwritten
            domId(htamlElement, attribute)
            break
        case "switch":
            domSwitch(htamlElement, attribute)
            break
        case "bindto":
            domBindTo(htamlElement, attribute)
            break
        case "proc":
            domProc(htamlElement, attribute, stepThroughHTAMLElement, stepThroughHTAMLElements)
            break
        case "ignore": // ignore any element with this attribute
            return domIgnore(htamlElement, attribute, stepThroughHTAMLElements)
        case "swap": // replaces the given target with the element.response.body Takes a dom id r a html element
            domSwap(htamlElement, attribute, stepThroughHTAMLElements)
            break
        case "cloak":
            domCloak(htamlElement, attribute)
            break
        case "data": //used to declare variables
            domData(htamlElement, attribute, HTAMLJParser)
            break
        case "text": // set the inner text of a element
            domText(htamlElement, attribute)
            break
        default://  any default element attributes
            domDefaultAttr(htamlElement, attribute)
            break
    }
    return htamlElement
}
