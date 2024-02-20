import { getHTAMLElementByDomId } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function domBindTo(htamlElement: HTAMLElement, attribute: any) {
  //binds to a input element
  // first argument can be a dom:id or => input[name="anyname"]
  // using dom:id is faster

  let value = attribute.value
  const element = <HTMLElement | any>htamlElement.root

  let target: HTAMLElement | HTMLElement | null | any = getHTAMLElementByDomId(value)
  if (!target) {
    target = <HTMLElement>document.querySelector(`input[name="${value}"]`)
    if (!target) return null
  }
  else target = target.root

  target.addEventListener('htaml_change', (e: any) => {
    {
      const htmlElement = e.target as HTMLInputElement
      const htamlElement = e.detail as HTAMLElement

      switch (htmlElement.tagName) {
        case "select":
        case "textarea":
        case "input":
          element.value = htmlElement.value
          break
        default:
          element.textContent = htmlElement.value
          break
      }
    }
  })
}
