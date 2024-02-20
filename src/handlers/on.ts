import { onTrigger } from "../attributes/on"

export default function handleOnAttribute(htamlElement: any, attribute: any, stepThroughHTAMLElement: any, stepThroughHTAMLElements: any) {
    switch (attribute.action) {
        case "trigger"://identifier for a element,can be overwritten
            onTrigger(htamlElement, attribute, stepThroughHTAMLElement)
            break
    }

    return htamlElement
}
