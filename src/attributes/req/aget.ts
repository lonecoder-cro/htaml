import { htamlAGet, htamlGet } from "../../core/req"
import { removeHTAMLAttributeFromHTAMLElement } from "../../core/utils"
import { HTAMLElementResponse } from "../../htaml/interface"

export default function reqAGet(htamlElement: any, attribute: any, stepThroughHTAMLElement: any): null {
    htamlAGet(attribute.value, htamlElement.request.config)
        .then((res: HTAMLElementResponse) => {
            htamlElement.response = res
            htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)
            stepThroughHTAMLElement(htamlElement)
        })
    return null
}
