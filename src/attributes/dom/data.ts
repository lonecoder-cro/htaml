import { htamlEval } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function domData(htamlElement: HTAMLElement, attribute: any, HTAMLJParser:any) {
  //used to declare variables
  let json: any = new HTAMLJParser(attribute.value)
  const result = htamlEval(json)
  Object.assign(htamlElement.variables, result)
}
