import { runFor, runHScript, runIf } from "../attributes/run"

export default function handleRunAttribute(htamlElement: any, attribute: any, stepThroughHTAMLElement: any) {
    switch (attribute.action) {
        case 'hscript':
            htamlElement = runHScript(htamlElement, attribute)
            break
        case "for":
            htamlElement = runFor(htamlElement, attribute, stepThroughHTAMLElement)
            break
        case 'if':
            htamlElement = runIf(htamlElement, attribute)
            break
    }

    return htamlElement
}
