import { htamlGet, htamlPost } from "../../core/req"
import { HTAMLElement } from "../../htaml/interface"

export default function reqPost(htamlElement: any, attribute: any): HTAMLElement {
    const data = htamlElement.request.data
    if (data) htamlElement.response = htamlPost(attribute.value, data, false, htamlElement.request.config)

    return htamlElement

}
