import { createEvent, getHTAMLElementByDomId, removeHTAMLAttributeFromHTAMLElement } from "../../core/utils"
import { HTAMLElement } from "../../htaml/interface"

export default function onTrigger(htamlElement: any, attribute: any, stepThroughHTAMLElement: any): HTAMLElement | null {
    const element = htamlElement.root as HTMLElement
    const _a = attribute.value.split(" ")
    htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute)

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
                stepThroughHTAMLElement(htamlElement)
            }, timeout)
        } else stepThroughHTAMLElement(htamlElement)
    }

    if (attribute.value == "submit") {
        //used to submit forms
        element.addEventListener('click', async () => {
            let htamlElement = getHTAMLElementByDomId('form') as HTAMLElement
            if (!htamlElement) return null

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
            htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, { action: 'ignore' }as any)
            await stepThroughHTAMLElement(htamlElement)
        })
    } else element.addEventListener(_a[0], _lis)

    return htamlElement
}
