import { HTAMLElement } from "../../htaml/interface"

export default function reqOut(htamlElement: any, attribute: any): HTAMLElement {
    htamlElement.variables[attribute.value] = htamlElement.response.body
    return htamlElement
}
