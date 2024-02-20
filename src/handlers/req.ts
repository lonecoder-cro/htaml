import { reqAGet, reqAPost, reqConfig, reqData, reqOut, reqPost } from "../attributes/req"
import reqGet from "../attributes/req/get"

export default function handleReqAttribute(htamlElement: any, attribute: any, stepThroughHTAMLElement: any) {
    switch (attribute.action) {
        case 'data':
            htamlElement = reqData(htamlElement, attribute)
            break
        case "config":
            htamlElement = reqConfig(htamlElement, attribute)
            break
        case 'out':
            htamlElement = reqOut(htamlElement, attribute)
            break
        case 'get':
            htamlElement = reqGet(htamlElement, attribute)
            break
        case 'aget':
            htamlElement = reqAGet(htamlElement, attribute, stepThroughHTAMLElement)
            break
        case "post":
            htamlElement = reqPost(htamlElement, attribute)
            break
        case "apost":
            htamlElement = reqAPost(htamlElement, attribute, stepThroughHTAMLElement)
            break
    }

    return htamlElement
}
