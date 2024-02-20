import { createEvent, htamlEval } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"
import HTAMLJParser from "../../htaml_jparser"

export default function reqData(htamlElement: any, attribute: any): HTAMLElement | null {
    let json: any = new HTAMLJParser(attribute.value)
    htamlElement.request.data = htamlEval(json)
    return htamlElement
}
