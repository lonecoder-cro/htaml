import { HTAMLElement } from "../../htaml/interface"
import CONFIG from "../../config"
import { cloneHTAMLNode, removeHTAMLAttributeFromHTAMLElement, removeClassesFromHTAMLElement, getHTAMLElementByDomId } from "../../core/utils"

export default function domProc(htamlElement: HTAMLElement, attribute: any, stepThroughHTAMLElement: any, stepThroughHTAMLElements: any) {
  let value = attribute.value
  const selector = value.split(' ')[0]
  const element = <HTMLElement | any>htamlElement.root

  let target: HTAMLElement | HTMLElement | null | any = getHTAMLElementByDomId(selector)
  if (target) {
    removeClassesFromHTAMLElement(target, ["htaml-cloak", "htaml-hide"])
    const _ = [{ action: "cloak" }, { action: "ignore" }].forEach((a: any) => target = removeHTAMLAttributeFromHTAMLElement(target, a))
    let isModified = false

    const modifiers = value.match(CONFIG.MODIFIERS_REGEX)
    if (modifiers && modifiers.length) {
      for (let modifier of modifiers) {
        modifier = <any>modifier.split(":")
        value = modifier[1]
        switch (modifier[0]) {
          case "on_process":
            if (value === 'replace') { //replaces the old node with new node
              const clone = cloneHTAMLNode(target as HTAMLElement, { removeOriginal: true })
              target = stepThroughHTAMLElement(clone)
              if (target) {
                element.insertAdjacentElement("afterend", target.root)
                isModified = true
              }
            }
            else if (value === 'scroll') { //scroll to the bottom of element
              target = stepThroughHTAMLElement(target)
              if (target) {
                window.scrollTo({ top: target.root.scrollHeight, behavior: 'smooth' })
                isModified = true
              }
            }
            break
        }
      }
    }

    if (!isModified)  //default behavior is append the result to the current element
      stepThroughHTAMLElements([target])
  }
}
