import { htamlPost } from "../../core/req"
import { removeHTAMLAttributeFromHTAMLElement } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function reqAPost(htamlElement: any, attribute: any, stepThroughHTAMLElement: any): HTAMLElement | null {
    const data = htamlElement.request.data
    if (data) {
        new Promise((resolve, reject) => {
            htamlElement.response = htamlPost(attribute.value, data, true, htamlElement.request.config)
            htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)
            stepThroughHTAMLElement(htamlElement)
        }).then(() => { })
        return null
    }
    return htamlElement
}
