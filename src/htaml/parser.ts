import { HTAML_STATE } from "../config";
import { HTAMLElement } from "./interface";
import { removeHTAMLAttributeFromHTAMLElement} from "../core/utils";
export default class HTAMLParser {
  /*
    dom - use to manipulate the dom
    req - use to perform request accestions
    */

  logger: boolean = true;
  _elementId: number = -1;
  _element: any = {};
  _elements: any = [];
  attribute_regex: RegExp = /(h|ht|hta|htaml)-(\w*):(\w*)/;

  constructor() {}

  cloneHTAMLNode(htamlElement: HTAMLElement, options: any = { cloneAll: false, removeOriginal: true }): any {
    const clone = {
      id: htamlElement.id,
      root: htamlElement.root.cloneNode(options.cloneAll),
      parent: htamlElement.parent,
      request: htamlElement.request,
      response: htamlElement.response,
      variables: htamlElement.variables,
      childrens: htamlElement.childrens,
      attributes: htamlElement.attributes,
    };

    if (options.removeOriginal) htamlElement.root.remove();
    return clone;
  }

  removeChildNodesFromHTAMLElement(htamlElement: any) {
    htamlElement.childrens.map((htamlElement: any) => htamlElement.root.remove());
    return htamlElement;
  }

  createEventOnHTAMLElement(htamlElement: any, eventName: string) {
    htamlElement.root.dispatchEvent(new Event(eventName));
    return htamlElement;
  }

  async handleDomAttribute(element: any, attribute: any) {
    return new Promise(async (resolve, reject) => {
      const html = element.element as HTMLElement;
      if (attribute.action === "swap") {
        // replaces the given target with the element.response.body
        const _ms = attribute.value.split(" ");
        const _ = document.querySelector(_ms[0]) as HTMLElement;
        if (_) {
          let _tn = null;
          if (attribute.value.includes("transition")) {
            _tn = attribute.value.match(/transition:([\w-]*)/);
            if (_tn.length == 2) _.classList.remove(_tn[1]);
          }

          if ((attribute.value.includes("outerHTML") || attribute.value.includes("this")) && _.tagName !== "HTML") {
            _.outerHTML = element.response.content;
            await this.parseDomElements(document.body.children as HTMLCollection);
          } else if (attribute.value.includes("innerHTML")) {
            _.innerHTML = element.response.content;
            await this.parseDomElements(_.children);
          } else if (_.tagName !== "HTML") {
            _.outerHTML = element.response.content;
            await this.parseDomElements(document.body.children as HTMLCollection);
          } else _.innerHTML = element.response.content;
          await this.parseDomElements(_.children);

          if (_tn) _.classList.add(_tn[1]);
        }
      }
      resolve(element);
    });
  }

  async removeHTAMLAttributesFromHTAMLElement(htamlElement: any) {
    const root: HTMLElement = htamlElement.root;
    for (let a of root.getAttributeNames()) if (a.match(this.attribute_regex)) root.removeAttribute(a);
  }

  async extractHTAMLAttributesFromElement(element: HTMLElement): Promise<Array<any>> {
    const attributes: Array<any> = [];
    if (!element.getAttributeNames().toString().match(this.attribute_regex)) return attributes;
    for (let attribute of element.getAttributeNames()) {
      if ((attribute.startsWith("h-") || attribute.startsWith("ht-") || attribute.startsWith("hta-") || attribute.startsWith("htaml-")) && attribute.includes(":")) {
        const _: String[] = attribute.split(":");
        const id = _[0];
        const action = _[1];
        const value = element.getAttribute(attribute);

        if (value) {
          attributes.push({
            id: id,
            action: action,
            value: value,
          });
        }
      }
    }
    return attributes;
  }

  async _parseElementChildrens(childrens: HTMLCollection) {
    const _childrens: Array<any> = [];
    for (let _c of childrens) {
      _c = await this._parseElement(_c as HTMLElement);
      if (_c) _childrens.push(_c);
    }
    return _childrens;
  }

  async _parseHScriptElement(htamlElement: any) {
    /* Note: The results of a hscript will always be place on the parent tag    */
    let root: HTMLElement = htamlElement.root;
    root.classList.add("htaml-none");
    htamlElement.attributes.push({ id: "h-hscript", value: true });
    // root.remove()
    return htamlElement;
  }

  async _parseElement(element: HTMLElement) {
    if (element.tagName === "SCRIPT") return;

    ++this._elementId;
    const id = this._elementId;

    let htamlElement: any = {
      id: id,
      root: element,
      parent: null,
      request: { config: {} },
      response: { body: "", content: "", status: -1 },
      variables: {},
      childrens: [],
      attributes: await this.extractHTAMLAttributesFromElement(element),
    };

    htamlElement.root.setAttribute("h-dom:id", id as any);
    this._element[id] = htamlElement;

    if (this._element[id].root.parentElement) {
      const domId: any = this._element[id].root.parentElement.getAttribute("h-dom:id");
      if (domId) this._element[id].parent = this._element[Number(domId)];
    }
    //  this._element[id] = await this._stepThroughHTAMLElement(this._element[id])
    if (this._element[id].root.tagName === HTAML_STATE.H_CODE) {
      this._element[id] = await this._parseHScriptElement(this._element[id]);
    }
    if (this._element[id].root.children.length) this._element[id].childrens = await this._parseElementChildrens(this._element[id].root.children);

    await this.removeHTAMLAttributesFromHTAMLElement(this._element[id]);
    this._elements.push(this._element[id]);
    return this._element[id];
  }

  async parseDomElements(childrens: HTMLCollection): Promise<Array<any>> {
    const parsedElements: Array<any> = [];
    for (let children of childrens) {
      children = await this._parseElement(children as HTMLElement);
      if (children) parsedElements.push(children);
    }

    return [parsedElements, this._elements];
  }
}
