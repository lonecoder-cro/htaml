import CONFIG from "../../config"
import { cloneHTAMLNode, removeChildNodesFromDOM, removeClassesFromHTAMLElement, replaceVariable } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function runFor(htamlElement: any, attribute: any, stepThroughHTAMLElement: any): HTAMLElement | null {
    const element = htamlElement.root as HTMLElement
    element.classList.add("htaml-cloak")

    let match = attribute.value.match(CONFIG.FOR_LOOP_REGEX)

    if (match && match.length) {
        let dataObject: any = {}
        let indexIdentifier: string = 'i'

        const forString = match[0].split('in')
        const replaceIdentifyer = forString[0].replace(/\s/g, '')
        const loopIdentifyer = forString[1].replace(/\s/g, '')

        if (match.length > 1) {
            match.slice(1).forEach((value: string) => {
                const values = value.split('=')
                if (values[1] === 'index') indexIdentifier = values[0]
                else {
                    const _v: string | null = replaceVariable(values[1], htamlElement)
                    if (_v) dataObject[values[0]] = eval(_v)
                    else dataObject[values[0]] = values[1]
                }
            })
        }

        let data: any = replaceVariable(loopIdentifyer, htamlElement)
        if (data) {
            removeChildNodesFromDOM(htamlElement)

            const processCloneNode = (htamlElement: HTAMLElement): HTAMLElement => {
                let clone: HTAMLElement | null = cloneHTAMLNode(htamlElement, { removeOriginalNode: true })
                clone = stepThroughHTAMLElement(clone) as HTAMLElement
                if (clone && clone.childrens) {
                    for (let child of clone.childrens) {
                        child = processCloneNode(child)
                        clone.root.appendChild(child.root)
                    }
                }
                return clone
            }

            for (let htamlChild of htamlElement.childrens) {
                let index: number = 0
                for (let value of data) {
                    /* dom:text only understands key value pairs, so to solve this problem i
                    will put the array value in a object as follow -> eg: [replaceIdentifyer] = '0'
                    where replaceIdentifyer is equal to the fisrt word for in a for expression. eg: number in numbers -> ['number'] = '0'
                    */
                    dataObject[indexIdentifier] = index
                    dataObject[replaceIdentifyer] = value
                    dataObject = JSON.parse(JSON.stringify(dataObject))
                    Object.assign(htamlChild.variables, dataObject)

                    htamlChild = processCloneNode(htamlChild)
                    element.appendChild(htamlChild.root)
                    index++
                }
            }
        }
        removeClassesFromHTAMLElement(htamlElement, ["htaml-cloak", "htaml-hide", "htaml-hidden"])
    }

    return htamlElement
}
