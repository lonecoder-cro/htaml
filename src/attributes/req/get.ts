import { htamlGet } from "../../core/req"
import { HTAMLElement } from "../../htaml/interface"

export default function reqGet(htamlElement: any, attribute: any): HTAMLElement {
    htamlElement.response = htamlGet(attribute.value, false, htamlElement.request.config)
    return htamlElement

}
