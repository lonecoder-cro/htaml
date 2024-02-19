import CONFIG from "../config"
import { HTAMLElement, HTAMLElementAttributes } from "./../htaml/interface"

const domIds: any = {}

export function disableEvents(htamlElement: HTAMLElement): HTAMLElement {
  switch (htamlElement.root.tagName) {
    case 'INPUT':
      htamlElement.root.oninput = () => { }
      break
    case 'BUTTON':
      htamlElement.root.onclick = (e) => { e.preventDefault() }
      break
    case 'FORM':
      htamlElement.root.onsubmit = (e) => { e.preventDefault(); alert('fopr') }
      break
  }
  return htamlElement
}

export function getHTAMLElementByDomId(id: string): HTAMLElement {
  return domIds.hasOwnProperty(id) ? domIds[id] : null
}

export function addHTAMLElementToDomIds(htamlElement: HTAMLElement, id: string) {
  domIds[id] = htamlElement
}

export function extractHTAMLAttributesFromElement(htmlElement: HTMLElement): Array<HTAMLElementAttributes> {
  const attributes: Array<HTAMLElementAttributes> = []
  if (!htmlElement.getAttributeNames().toString().match(CONFIG.HTAML_REGEX)) return attributes
  for (let attribute of htmlElement.getAttributeNames()) {
    if ((attribute.startsWith("h-") || attribute.startsWith("ht-") || attribute.startsWith("hta-") || attribute.startsWith("htaml-")) && attribute.includes(":")) {
      const _: string[] = attribute.split(":")
      const id = _[0]
      const action = _[1]
      const value = htmlElement.getAttribute(attribute)

      if (value) {
        attributes.push({
          id: id,
          action: action,
          value: value,
        })
      }
    }
  }
  return attributes
}


export function removeHTAMLAttributesFromHTAMLElement(htamlElement: any) {
  const root: HTMLElement = htamlElement.root
  for (let a of root.getAttributeNames()) if (a.match(CONFIG.HTAML_REGEX)) root.removeAttribute(a)
}


export function removeChildNodesFromDOM(htamlElement: HTAMLElement) { htamlElement.childrens.forEach((htamlElement: any) => htamlElement.root.remove()) }

export function reateEventOnHTAMLElement(htamlElement: HTAMLElement, eventName: string) {
  htamlElement.root.dispatchEvent(new Event(eventName))
  return htamlElement
}

export function cloneHTAMLNode(htamlElement: HTAMLElement, options: any = { cloneAll: false, removeOriginal: true }): HTAMLElement {
  const clone: HTAMLElement = {
    id: htamlElement.id,
    root: htamlElement.root.cloneNode(options.cloneAll) as HTMLElement,
    parent: htamlElement.parent,
    request: htamlElement.request,
    response: htamlElement.response,
    variables: htamlElement.variables,
    childrens: htamlElement.childrens,
    attributes: htamlElement.attributes,
  }

  if (options.removeOriginal) htamlElement.root.remove()
  return clone
}

export function removeHTAMLAttributeFromHTAMLElement(htamlElement: any, attribute: any): HTAMLElement {
  htamlElement.attributes = htamlElement.attributes.filter((_a: any) => _a.action !== attribute.action)
  htamlElement.root.removeAttribute(`${attribute.id}:${attribute.action}`)
  return htamlElement
}

export function replaceVariable(value: string, htamlElement: HTAMLElement, options: any = { stringify: false, isIf: false }): string | null {
  /*
    Replace a variable with its actual value

    Vars can be defined as:
        user
        user.name
        user.address.length
    */
  let varsToReplace: any = value.match(/\$(\w+)/g) //replace any $word withs its original data

  if (varsToReplace && varsToReplace.length) {
    for (const variable of varsToReplace) {
      const data = getVariable(htamlElement, variable.substring(1), options.stringify)
      if (data) {
        if (typeof data === "string") value = value.replace(new RegExp(variable, "g").source, `'${data}'`)
        else value = value.replace(new RegExp(variable, "g").source, data)
      }
    }
  } else if (htamlElement.root.tagName !== CONFIG.HSCRIPT) {
    const variables: any | Array<string> = value.match(/[([a-zA-Z_)|(a-zA-Z_\.)]+/gi)

    const _ = (vars: any, variableData: any) => {
      if (vars) {
        let tmpData: any = null
        for (const variable of vars) {
          if (tmpData) {
            if (tmpData.hasOwnProperty(variable)) {
              tmpData = tmpData[variable]
            } else tmpData += `.${variable}`
          } else {
            const data = getVariable(variableData, variable, options.stringify)
            if (!data) return null // if first variable canno't be found, i assume its javascript so i return
            tmpData = data
          }
        }
        return tmpData
      }
    }

    if (variables) {
      for (const variable of variables) {
        if (variable.includes(".")) {
          let vars = variable.split(".")
          if (vars[0] === "this") {
            //this means targeting the htaml element itself for its keys
            vars = vars.splice(1)
            const result = _(vars, { variables: htamlElement })
            if (!result) break
            value = value.replace(new RegExp(variable, "g").source, _(vars, { variables: htamlElement }))
          } else {
            const result = _(vars, htamlElement)
            if (!result) break // return original value, can be javascript
            if (options.isIf) value = value.replace(new RegExp(variable, "g").source, result)
            else value = result
          }
        } else {
          //single variable, can also be javascript code
          const data = getVariable(htamlElement, variable, options.stringify)
          if (!data) {
            // if first variable canno't be found, i assume its javascript so i return other wise
            if (options.isIf) return null
            break
          }
          if (options.isIf) value = value.replace(new RegExp(variable, "g").source, data)
          else value = data
        }
      }
    }
  }
  return value
}

export function removeClassesFromHTAMLElement(htamlElement: any, classes: Array<string>): null {
  classes.forEach((x: string) => {
    htamlElement.root.classList.remove(x)
  })
  return null
}

export function getVariable(htamlElement: any, varName: string, stringify: boolean = false): string | null {
  let data = null
  if (!htamlElement) return data

  if (htamlElement.variables.hasOwnProperty(varName)) data = htamlElement.variables[varName]
  else data = getVariable(htamlElement.parent, varName)

  if (stringify) data = JSON.stringify(data)
  return data
}

export function isNumber(str: string) {
  return true ? str.length === 1 && str.match(/[0-9]/i) : false
}

export function isLetter(str: string) {
  return true ? str.length === 1 && str.match(/[a-zA-Z0-9]/i) : false
}

export function createEvent(element: HTMLElement | Document, eventName: string, args: any = null) {
  CustomEvent
  if (element instanceof HTMLElement) {
    element.dispatchEvent(new CustomEvent(eventName, { detail: args }))
    return element
  } else {
    element.dispatchEvent(new CustomEvent(eventName, { detail: args }))
    return element
  }
}

export class EventEmitter {
  listeners: any = {};

  constructor() { }

  listenerCount(eventName: string, func: Function): number {
    const funcs: Array<any> = this.listeners[eventName] || []
    return funcs.length
  }

  rawListener(eventName: string): Array<any> {
    return this.listeners[eventName]
  }

  addListener(eventName: string, func: Function): EventEmitter {
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(func)
    return this
  }

  removeListener(eventName: string, func: Function): EventEmitter {
    delete this.listeners[eventName]
    return this
  }

  emit(eventName: string, ...args: any): boolean {
    let funcs = this.listeners[eventName]
    if (!funcs) return false
    funcs.forEach((f: any) => {
      f(...args)
    })
    return true
  }

  once(eventName: string, func: Function | any): EventEmitter {
    this.listeners[eventName] = this.listeners[eventName] || []
    const onceWrapper = () => {
      func()
      this.off(eventName, func)
    }
    this.listeners[eventName].push(onceWrapper)
    return this
  }

  on(eventName: string, func: Function | any): EventEmitter {
    return this.addListener(eventName, func)
  }

  off(eventName: string, func: Function | any): EventEmitter {
    return this.removeListener(eventName, func)
  }
}

export async function htamlEvalHScript(code: string): Promise<string | null> {
  //eval hscript / javascript code
  return new Promise((resolve, reject) => {
    function _() {
      return new Function(code)()
    }
    const result = eval("_()")
    if (result) return resolve(result)
    return resolve(null)
  })
}

export async function htamlEval(code: string, options: any = { stringify: false }): Promise<string | null> {
  //eval regualr javascript code
  return new Promise((resolve, reject) => {
    function _() {
      try {
        return new Function(`return ${JSON.stringify(code)}`)()
      } catch (error) {
        return new Function(`return ${code}`)()
      }
    }
    const result = eval("_()")
    if (result) return resolve(result)
    return resolve(null)
  })
}
