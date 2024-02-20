import { addHTAMLElementToDomIds } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function domId(htamlElement: HTAMLElement, attribute: any) {
  addHTAMLElementToDomIds(htamlElement, attribute.value)
}
