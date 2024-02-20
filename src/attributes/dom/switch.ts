import { getHTAMLElementByDomId } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"
import CONFIG from "../../config"

export default function domSwitch(htamlElement: HTAMLElement, attribute: any) {
  let value = attribute.value
  const selector = value.split(' ')[0]
  const element = <HTMLElement | any>htamlElement.root

  let target: HTAMLElement | HTMLElement | null | any = getHTAMLElementByDomId(selector)
  if (target) {
    target = target.root as HTMLElement
    const modifiers: RegExpMatchArray | null = value.match(CONFIG.MODIFIERS_REGEX)
    if (modifiers) {
      for (let modifier of modifiers) {
        modifier = modifier.split(":") as any
        value = modifier[1]
        switch (modifier[0]) {
          case 'attr':
            document.querySelectorAll(`[${value}]`).forEach((element: Element) => element.classList.add("htaml-hide"))
            break
          case 'active':
            document.querySelectorAll(`.${value}`).forEach((element: Element) => element.classList.remove(value))
            element.classList.add(value)
            break
        }
      }
      target.classList.remove("htaml-hide")
    }
  }
}
