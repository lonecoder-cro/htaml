import CONFIG from "../../config"
import { getHTAMLElementByDomId } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"
import { parseElement } from "../../htaml/parser"

export default function domSwap(htamlElement: HTAMLElement, attribute: any, stepThroughHTAMLElements: any) {
  // replaces the given target with the element.response.body Takes a dom id r a html element

  let value = attribute.value
  const element = <HTMLElement>htamlElement.root
  let target: HTAMLElement | HTMLElement | null | any = null

  const selector = value.split(" ")[0]
  if (selector === 'this') target = element
  else {
    target = getHTAMLElementByDomId(selector)
    if (!target) {
      target = document.querySelector(selector) as HTMLElement
      if (!target) return null
    } else target = target.root as HTMLElement
  }

  //check for title tag and override current
  const hasTitle = htamlElement.response.content.match(/<title>(\w*)<\/title>/i)
  if (hasTitle && hasTitle.length > 1) {
    htamlElement.response.content = htamlElement.response.content.replace(new RegExp(hasTitle[0]), "")
    document.title = hasTitle[1]
  }

  const html = htamlElement.response.content

  const modifiers = value.match(CONFIG.MODIFIERS_REGEX)
  if (modifiers && modifiers.length) {
    for (let modifier of modifiers) {
      modifier = modifier.split(":") as any
      switch (modifier[0]) {
        case 'replace':
          value = modifier[1]
          if (value === 'outter' && target.tagName !== 'HTML')
            target.outerHTML = html
          else if (value === 'outter' && target.tagName === 'HTML')
            target.innerHTML = html
          else if (value === 'inner')
            target.innerHTML = html
          break
      }
    }
  } else target.innerHTML = html

  stepThroughHTAMLElements([parseElement(document.body)])
}
