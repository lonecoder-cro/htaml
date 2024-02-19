import CONFIG from "../config"
import { createEvent, disableEvents, extractHTAMLAttributesFromElement, removeHTAMLAttributesFromHTAMLElement } from "../core/utils"
import { HTAMLElement } from "./interface"

let elementId: number = -1
let _element: any = {}
let elements: any = []

export function parseElementChildrens(childrens: HTMLCollection): Array<HTAMLElement> {
  const htamlChildrens: Array<HTAMLElement> = []
  for (const children of childrens) {
    const htamlElement: HTAMLElement | null = parseElement(children as HTMLElement)
    if (htamlElement) htamlChildrens.push(htamlElement)
  }
  return htamlChildrens
}

export function parseHScriptElement(htamlElement: any) {
  /* Note: The results of a hscript will always be place on the parent tag    */
  let root: HTMLElement = htamlElement.root
  root.classList.add("htaml-hide")
  htamlElement.attributes.push({ id: "h-hscript", value: true })
  return htamlElement
}

export function parseElement(element: HTMLElement): HTAMLElement | null {
  if (element.tagName === "SCRIPT") return null

  ++elementId
  const id = elementId

  let htamlElement: any = {
    id: id,
    root: element,
    parent: null,
    request: { config: {}, data: {} },
    response: { body: "", content: "", status: -1 },
    variables: {},
    childrens: [],
    attributes: extractHTAMLAttributesFromElement(element),
  }

  htamlElement.root.setAttribute("h-dom:id", id as any)
  _element[id] = htamlElement

  if (_element[id].root.parentElement) {
    const domId: any = _element[id].root.parentElement.getAttribute("h-dom:id")
    if (domId) _element[id].parent = _element[Number(domId)]
  }

  if (_element[id].root.tagName === CONFIG.H_SCRIPT) _element[id] = parseHScriptElement(_element[id])
  if (CONFIG.DISABLED_ELEMENTS.includes(_element[id].root.tagName)) _element[id] = disableEvents(_element[id])
  if (_element[id].root.children.length) _element[id].childrens = parseElementChildrens(_element[id].root.children)

  removeHTAMLAttributesFromHTAMLElement(_element[id])
  elements.push(_element[id])
  return _element[id]
}

export function parseDomElements(childrens: HTMLCollection): Array<HTAMLElement> {
  const parsedElements: Array<HTAMLElement> = []
  for (let children of childrens) {
    const htamlElement: HTAMLElement | null = parseElement(children as HTMLElement)
    if (htamlElement) parsedElements.push(htamlElement)
  }

  return parsedElements
}
