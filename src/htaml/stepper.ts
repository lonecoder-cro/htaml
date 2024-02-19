import { cloneHTAMLNode, removeHTAMLAttributeFromHTAMLElement, htamlEvalHScript, htamlEval, removeClassesFromHTAMLElement, replaceVariable, removeChildNodesFromHTAMLElement, addHTAMLElementToDomIds, getHTAMLElementByDomId, createEvent } from "../core/utils"
import { htamlGet, htamlPost } from "../core/req"
import { HTAMLElement } from "./interface"
import HTAMLJParser from "../htaml_jparser"
import { parseElementChildrens } from "./parser"
import CONFIG from "../config"

async function handleOnAttribute(htamlElement: any, attribute: any) {
  return new Promise(async (resolve, reject) => {
    const element = htamlElement.root as HTMLElement
    const _a = attribute.value.split(" ")
    htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)

    if (attribute.action === "trigger") {
      const _lis = async (_p: PointerEvent) => {
        createEvent(element, "htaml_change", htamlElement)
        const _e = _p.target as HTMLElement
        if (attribute.value.includes("once")) _e.removeEventListener(_a[0], _lis)
        if (attribute.value.includes("delay")) {
          let timeout = 0
          const _ = attribute.value.match(/delay:(\d*)(\w)/)
          if (_.length == 3) {
            // [juunk,timeout,timemodifiey]
            if (_[2] === "s") timeout = Number(_[1] * 1000)
            else if (_[2] === "ms") timeout = Number(_[1] * 1000000)
          }

          if (timeout > 0x7fffffff || timeout < 1) timeout = 1

          setTimeout(async () => {
            await stepThroughHTAMLElement(htamlElement)
          }, timeout)
        } else await stepThroughHTAMLElement(htamlElement)
      }

      if (attribute.value == "submit") {
        //used to submit forms
        element.addEventListener('click', async () => {
          let htamlElement = getHTAMLElementByDomId('form') as HTAMLElement
          if (!htamlElement) return resolve(null)

          const htmlElement = htamlElement.root as HTMLFormElement
          const data: any = {}

          const inputs = htmlElement.querySelectorAll("input")
          for (const input of inputs) {
            data[input.name] = input.value
          }

          const textAreas = htmlElement.querySelectorAll("textarea")
          for (const textArea of textAreas) {
            data[textArea.name] = textArea.value
          }

          htamlElement.request.data = data
          htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, { action: 'ignore' })
          await stepThroughHTAMLElement(htamlElement)
        })
      } else element.addEventListener(_a[0], _lis)
    }
    return resolve(htamlElement)
  })
}

async function handleReqAttribute(htamlElement: HTAMLElement, attribute: any) {
  //perform http request and return responses
  return new Promise(async (resolve, reject) => {
    const config = htamlElement.request.config
    if (attribute.action === "data") {
      let json: any = new HTAMLJParser(attribute.value)
      htamlElement.request.data = await htamlEval(json)
    } else if (attribute.action === "config") {
      attribute.value = attribute.value.replace(/\s/g, "")
      attribute.value = attribute.value.replace(/\'/g, '"')
      htamlElement.request.config = JSON.parse(attribute.value)
    } else if (attribute.action === "get") {
      if (!config.hasOwnProperty("pooling")) {
        if (attribute.id === "h-req") {
          htamlElement.response = await htamlGet(attribute.value, false, config)
        } else if (attribute.id === "h-areq") {
          htamlGet(attribute.value, true, config).then((res: any) => {
            htamlElement.response = res
            htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)
            stepThroughHTAMLElement(htamlElement).catch(() => { })
          })
          return resolve(null)
        }
      }
    } else if (attribute.action === "post") {
      const data = htamlElement.request.data
      if (data) {
        if (attribute.id === "h-req") {
          htamlElement.response = await htamlPost(attribute.value, data, false, config)
        } else if (attribute.id === "h-areq") {
          htamlPost(attribute.value, data, true, config).then((res: any) => {
            htamlElement.response = res
            htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)
            stepThroughHTAMLElement(htamlElement).catch(() => { })
          })
          return resolve(null)
        }
      }
    } else if (attribute.action === "out") {
      const variable = attribute.value
      htamlElement.variables[variable] = htamlElement.response.body
    }
    return resolve(htamlElement)
  })
}

async function handleRunAttribute(htamlElement: any, attribute: any) {
  //perform http request and return responses
  return await new Promise(async (resolve, reject) => {
    const element: HTMLElement = htamlElement.root

    let value = attribute.value
    if (attribute.action === "hscript") {
      // runs javscript code
      value = replaceVariable(value, htamlElement) as any
      if (value) {
        value = value.replace(/\s\s/g, "")
        htamlElement.variables["hscript"] = await htamlEvalHScript(value)
      }
    } else if (attribute.action === "for" && attribute.value.match(/(\sin\s)/)) {
      element.classList.add("htaml-cloak")

      value = value.split(" ")
      if (value.length == 3) {
        const varToReplace = value[0] //only used for array and not objects
        let loopTarget = value[2] //can be defind as user.addresses or users

        let data: any = replaceVariable(loopTarget, htamlElement)
        if (data) {
          removeChildNodesFromHTAMLElement(htamlElement)

          const __processNode = async (data: any, htamlElement: HTAMLElement): Promise<any> => {
            Object.assign(htamlElement.variables, data)

            htamlElement = await stepThroughHTAMLElement(htamlElement) as HTAMLElement
            if (htamlElement.childrens) {
              for (let child of htamlElement.childrens) {
                child = await __processNode(data, cloneHTAMLNode(child, { removeOriginalNode: true }))
                htamlElement.root.appendChild(child.root)
              }
            }
            return htamlElement
          }

          for (let _htamlElement of htamlElement.childrens) {
            let index: number = 0
            for (let value of data) {
              //for each child step over each inner child and process elements
              let clone = cloneHTAMLNode(_htamlElement, { removeOriginalNode: true })

              // dom:text only understands key value pairs, so to solve this problem i
              // will put the array value in a object as follow -> eg: [varToReplace] = '0'
              // where varToReplace is equal to the fisrt word for in a for expression. eg: number in numbers -> ['number'] = '0'
              const dataObject: any = {}
              dataObject["i"] = index.toString()
              dataObject[varToReplace] = value

              clone = await __processNode(dataObject, clone)
              if (clone) element.appendChild(clone.root)
              index++
            }
          }
        }
        removeClassesFromHTAMLElement(htamlElement, ["htaml-cloak", "htaml-hide", "htaml-hidden"])
      }
    } else if (attribute.action === "if") {
      element.classList.add("htaml-hide")
      value = replaceVariable(value, htamlElement, { isIf: true })
      const result = await htamlEval(value)
      if (!result) {
        element.remove()
        return resolve(null)
      }
      htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, { action: 'cloak' })
      removeClassesFromHTAMLElement(htamlElement, ["htaml-cloak", "htaml-hide"])
    }
    return resolve(htamlElement)
  })
}

async function handleHScript(htamlElement: any): Promise<HTAMLElement | null> {
  /*        Note: The results of a hscript will always be place on the parent tag    */
  let root: HTMLElement = htamlElement.root
  let code: string = root.innerText
  let variable: any = code.match(/return\s(\w+)/) //the name of the return variable

  if (variable && variable.length > 2) return null// only allow one return variable
  if (variable && variable.length == 2) variable = variable[1]

  code = replaceVariable(code, htamlElement) as any
  if (code) {
    code = code.replace(/\s\s/g, "")
    const result = await htamlEvalHScript(code)
    if (result && variable) htamlElement.parent.variables[variable] = result
  }
  return null
}

async function handleDomAttribute(htamlElement: HTAMLElement, attribute: any): Promise<HTAMLElement | null> {
  return new Promise(async (resolve, reject) => {
    const element = <HTMLElement | any>htamlElement.root
    let target: HTAMLElement | HTMLElement | null = null
    let selector: string = ''
    let values: any = []
    let value = attribute.value
    let variables: Array<string> = []
    let modifiers: RegExpMatchArray | null = null

    switch (attribute.action) {
      case "id":
        //unique identifier for a element
        //NOTE:can be overridden
        addHTAMLElementToDomIds(htamlElement, value)
        break
      case "switch":
        //similar to toggle but only allows ane element visible at a time on the dom
        selector = value.split(' ')[0]
        target = getHTAMLElementByDomId(selector)
        if (target) {
          target = target.root as HTMLElement
          modifiers = value.match(CONFIG.MODIFIERS_REGEX)
          if (modifiers) {
            for (let modifier of modifiers) {
              modifier = modifier.split(":") as any
              if (modifier[0] === "attr") document.querySelectorAll(`[${modifier[1]}]`).forEach((attr: any) => attr.classList.add("htaml-hide"))
              else if (modifier[0] === "active") {
                document.querySelectorAll(`${modifier[1]}`).forEach((attr: any) => attr.classList.remove(modifier[1].substring(1)))
                element.classList.add(modifier[1].substring(1))
              }
            }

            target.classList.remove("htaml-cloak")
            target.classList.remove("htaml-hide")
          }

        }
        break
      case "toggle":
        //toggle an element on and off
        selector = value.split(' ')[0]
        target = getHTAMLElementByDomId(selector)
        if (target) {
          modifiers = value.match(CONFIG.MODIFIERS_REGEX)
          if (modifiers) {
            for (let modifier of modifiers) {
              modifier = modifier.split(":") as any
              target.root.classList.remove("htaml-cloak")
              target.root.classList.remove("htaml-hide")

              if (!target.root.classList.contains(`htaml-${modifier}`)) target.root.classList.add(`htaml-${modifier}`)
              else target.root.classList.remove(`htaml-${modifier}`)
            }
          }
        }
        break
      case "bindto":
        //binds to a input element
        // first argument can be a dom:id or => input[name="anyname"]
        // using dom:id is faster
        target = getHTAMLElementByDomId(value)
        if (!target) {
          target = <HTMLElement>document.querySelector(`input[name="${value}"]`)
          if (!target) return resolve(null)
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
        break
      case "proc":
        // process a htaml dom element with htaml attributes
        // the frist argument must be a htaml-dom:id
        selector = value.split(' ')[0]
        target = getHTAMLElementByDomId(selector)
        if (target) {
          removeClassesFromHTAMLElement(target, ["htaml-cloak", "htaml-hide"])
          const _ = [{ action: "cloak" }, { action: "ignore" }].forEach((a: any) => target = removeHTAMLAttributeFromHTAMLElement(target, a))
          let isModified = false

          modifiers = value.match(CONFIG.MODIFIERS_REGEX)
          if (modifiers && modifiers.length) {
            for (let modifier of modifiers) {
              modifier = <any>modifier.split(":")
              switch (modifier[0]) {
                case "on_process":
                  if (modifier[1] === 'replace') {
                    //replaces the old node with new node
                    const clone = cloneHTAMLNode(target as HTAMLElement, { removeOriginal: true })
                    target = await stepThroughHTAMLElement(clone)
                    if (target) {
                      element.insertAdjacentElement("afterend", target.root)
                      isModified = true
                    }
                  }
                  else if (modifier[1] === 'scroll') {
                    //scroll to the bottom of element
                    target = await stepThroughHTAMLElement(target)
                    if (target) {
                      window.scrollTo({ top: target.root.scrollHeight, behavior: 'smooth' })
                      isModified = true
                    }
                  }
                  break
              }
            }
          }

          if (!isModified) stepThroughHTAMLElements([target])
        }
        break
      case "ignore":
        // ignore any element with this attribute
        if (value === "this") { //ignore the current element only, all child elements or processed
          htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)
          await stepThroughHTAMLElements(htamlElement.childrens)
          return resolve(null)
        } else if (value === "all") {
          //ignore all
          return resolve(null)
        }
        break
      case "swap":
        // replaces the given target with the element.response.body
        // takes a dom id r a html element
        selector = value.split(" ")[0]
        target = getHTAMLElementByDomId(selector)
        if (!target) {
          target = document.querySelector(selector) as HTMLElement
          if (!target) return resolve(null)
        } else target = target.root as HTMLElement

        let transitions: RegExpExecArray | null = null
        if (value.includes("transition")) {
          transitions = value.match(/transition:([\w-]*)/)
          if (transitions && transitions.length == 2) target.classList.remove(transitions[1])
        }

        //check for title tag and override current
        const hasTitle = htamlElement.response.content.match(/<title>(\w*)<\/title>/i)
        if (hasTitle && hasTitle.length > 1) {
          htamlElement.response.content = htamlElement.response.content.replace(new RegExp(hasTitle[0]), "")
          document.title = hasTitle[1]
        }

        if ((value.includes("outter") || value.includes("this")) && target.tagName !== "HTML") {
          target.outerHTML = htamlElement.response.content
          await stepThroughHTAMLElements(await parseElementChildrens(document.body.children as HTMLCollection))
        } else if (value.includes("inner")) {
          target.innerHTML = htamlElement.response.content
          await stepThroughHTAMLElements(await parseElementChildrens(target.children as HTMLCollection))
        } else if (target.tagName !== "HTML") {
          target.outerHTML = htamlElement.response.content
          await stepThroughHTAMLElements(await parseElementChildrens(document.body.children as HTMLCollection))
        } else target.innerHTML = htamlElement.response.content
        await stepThroughHTAMLElements(await parseElementChildrens(target.children as HTMLCollection))

        if (transitions) target.classList.add(transitions[1])

        break
      case "cloak":
        if (value === "cloak") element.classList.add("htaml-cloak")
        else if (value === "hide") element.classList.add("htaml-hide")
        break
      case "data":
        //we have data to store
        let json: any = new HTAMLJParser(attribute.value)
        const result = await htamlEval(json)
        Object.assign(htamlElement.variables, result)
        break
      case "text":
        // set the inner text of a element
        element.removeAttribute(attribute.action)
        variables = value.split(",").reverse()
        for (const variable of variables) {
          value = replaceVariable(variable, htamlElement)
          if (value) {
            value = await htamlEval(value)
            if (value) element.insertAdjacentText("afterbegin", value)
          }
        }
        break
      default:
        //  any default element attributes
        element.removeAttribute(attribute.action)
        variables = value.split(",").reverse()
        for (const variable of variables) {
          value = replaceVariable(variable, htamlElement)
          if (value) {
            value = await htamlEval(value)
            if (value) element[attribute.action] = value
          }
        }
        break
    }
    return resolve(htamlElement)
  })
}

async function stepThroughHTAMLElement(htamlElement: any): Promise<HTAMLElement | null> {
  for (const _a of htamlElement.attributes) {
    switch (_a.id.split("-")[1]) {
      case "hscript":
        if (_a.value) await handleHScript(htamlElement)
        return null
      case "run":
        htamlElement = await handleRunAttribute(htamlElement, _a)
        if (!htamlElement) return null
        break
      case "req":
      case "areq":
        htamlElement = await handleReqAttribute(htamlElement, _a)
        if (!htamlElement) return null
        break
      case "on":
        htamlElement = await handleOnAttribute(htamlElement, _a)
        //    if (!htamlElement) return null //stop processing on triggers
        return htamlElement
      case "dom":
        htamlElement = await handleDomAttribute(htamlElement, _a)
        if (!htamlElement) return null
        break
    }
  }
  return htamlElement
}

export async function stepThroughHTAMLElements(htamlElements: any) {
  htamlElements = htamlElements

  if (htamlElements) {
    for (let _a of htamlElements) {
      _a = await stepThroughHTAMLElement(_a)
      if (_a) if (_a.childrens) _a = (await stepThroughHTAMLElements(_a.childrens)) as any
    }
  }
}
