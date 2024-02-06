import HTAMLParser from "./htaml/parser";
import HTAMLElmStepper from "./htaml/stepper";
import { EventEmitter, createEvent, removeClassesFromHTAMLElement } from "./core/utils";
import Stylesheet from "./htaml/stylesheet";

declare global {
  interface Window {
    htaml: { em: EventEmitter; logger: any };
  }
}

(function () {
  window.htaml = window.htaml || {};

  let __logger: boolean = true;
  const em = new EventEmitter();

  window.htaml.em = em;

  function logger(message: string, type: string = "info") {
    if (__logger) {
      switch (type) {
        case "info":
          console.info(`[+] HTAML Logger:  ${message}`);
          break;
        case "warn":
          console.warn(`[+] HTAML Logger:  ${message}`);
          break;
        case "error":
          console.error(`[+] HTAML Logger:  ${message}`);
          break;
        default:
          console.log(`[+] HTAML Logger:  ${message}`);
          break;
      }
    }
  }
  window.htaml.logger = logger;

  window.addEventListener("DOMContentLoaded", async (args) => {
    const style: HTMLStyleElement = document.createElement("style");
    Stylesheet.forEach((_: any) => (style.textContent = style.textContent += _()));
    document.head.insertAdjacentElement("beforeend", style);

    createEvent(document, "htaml:init", args);

    const hParser = new HTAMLParser();
    const elementsObject = await hParser.parseDomElements(document.body.children);

    document.body.classList.remove("htaml-none");

    logger("dom parsed");
    createEvent(document, "htaml:parsed", elementsObject);

    new HTAMLElmStepper(elementsObject);

    logger("all htaml elements processed");
    createEvent(document, "htaml:processed", elementsObject);
  });
})();
