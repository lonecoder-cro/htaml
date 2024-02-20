import { parseDomElements } from "./htaml/parser"
import { stepThroughHTAMLElements } from "./htaml/stepper"
import { createEvent, logger } from "./core/utils"
import Stylesheet from "./htaml/stylesheet"

(function () {
  window.addEventListener("DOMContentLoaded", async (args) => {
    const style: HTMLStyleElement = document.createElement("style")
    Stylesheet.forEach((_: any) => (style.textContent = style.textContent += _()))
    document.head.insertAdjacentElement("beforeend", style)

    createEvent(document, "htaml_init", args)

    const elementsObject: any = await parseDomElements([document.body] as any)

    document.body.classList.remove("htaml-hide")

    logger("dom parsed")
    createEvent(document, "htaml_parsed", elementsObject)

    stepThroughHTAMLElements(elementsObject)

    logger("all htaml elements processed")
    createEvent(document, "htaml_processed", elementsObject)
  })
})()
