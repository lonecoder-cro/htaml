import { HTAMLElement } from "../../htaml/interface"

export default function domCloak(htamlElement: HTAMLElement, attribute: any) {
  const element = <HTMLElement>htamlElement.root
  if (attribute.value === "cloak") element.classList.add("htaml-cloak")
  else if (attribute.value === "hide") element.classList.add("htaml-hide")
}
