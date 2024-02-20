import { HTAMLElement } from "../../htaml/interface"

export default function reqConfig(htamlElement: any, attribute: any): HTAMLElement {
    attribute.value = attribute.value.replace(/\s/g, "")
    attribute.value = attribute.value.replace(/\'/g, '"')
    htamlElement.request.config = JSON.parse(attribute.value)
    return htamlElement
}
