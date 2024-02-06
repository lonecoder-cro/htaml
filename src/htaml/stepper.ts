import { cloneHTAMLNode, removeHTAMLAttributeFromHTAMLElement, getVariable, htamlEvalHScript, htamlEval, removeClassesFromHTAMLElement, replaceVariable } from "../core/utils";
import { htamlGet, htamlPost } from "../core/req";
import HTAMLParser from "./parser";
import { HTAMLElement } from "./interface";
import HTAMLJParser from "../htaml_jparser";

export default class HTAMLElmStepper {
  /*
    dom - use to manipulate the dom
    req - use to perform request accestions
    */

  htamlParser: HTAMLParser = new HTAMLParser();
  parsedHTAMLElements: Array<HTAMLElement>;
  htamlElements: Array<HTAMLElement>;

  constructor(htamlElements: any) {
    this.parsedHTAMLElements = htamlElements.parsed;
    this.htamlElements = htamlElements.elements;
    this.__stepThroughHTAMLElements(this.parsedHTAMLElements).catch((error) => console.error(error));
  }

  private async __handleOnAttribute(htamlElement: any, attribute: any) {
    return new Promise(async (resolve, reject) => {
      const element = htamlElement.root as HTMLElement;
      const _a = attribute.value.split(" ");
      htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute);

      if (attribute.action === "trigger") {
        const _lis = async (_p: PointerEvent) => {
          const _e = _p.target as HTMLElement;
          if (attribute.value.includes("once")) _e.removeEventListener(_a[0], _lis);
          if (attribute.value.includes("delay")) {
            let timeout = 0;
            const _ = attribute.value.match(/delay:(\d*)(\w)/);
            if (_.length == 3) {
              // [juunk,timeout,timemodifiey]
              if (_[2] === "s") timeout = Number(_[1] * 1000);
              else if (_[2] === "ms") timeout = Number(_[1] * 1000000);
            }

            if (timeout > 0x7fffffff || timeout < 1) timeout = 1;

            setTimeout(async () => {
              await this.__stepThroughHTAMLElement(htamlElement);
            }, timeout);
          } else await this.__stepThroughHTAMLElement(htamlElement);
        };

        if (element.tagName === "FORM") {
          element.addEventListener(attribute.value, async (_p: PointerEvent) => {
            _p.preventDefault();
            const _e = _p.target as HTMLFormElement;
            const data: any = {};

            const inputs = _e.querySelectorAll("input");
            for (const input of inputs) {
              data[input.name] = input.value;
            }

            const textAreas = _e.querySelectorAll("textarea");
            for (const textArea of textAreas) {
              data[textArea.name] = textArea.value;
            }

            htamlElement.variables["__form__data"] = data;
            await this.__stepThroughHTAMLElement(htamlElement);
          });
        } else element.addEventListener(_a[0], _lis);
      }
      return resolve(htamlElement);
    });
  }

  private async __handleReqAttribute(htamlElement: any, attribute: any) {
    //perform http request and return responses
    return new Promise(async (resolve, reject) => {
      const html = htamlElement.element as HTMLElement;
      const config = htamlElement.request.config;
      if (attribute.action === "config") {
        attribute.value = attribute.value.replace(/\s/g, "");
        attribute.value = attribute.value.replace(/\'/g, '"');
        htamlElement.request.config = JSON.parse(attribute.value);
      } else if (attribute.action === "get") {
        if (!config.hasOwnProperty("pooling")) {
          if (attribute.id === "h-req") {
            htamlElement.response = await htamlGet(attribute.value, false, config);
          } else if (attribute.id === "h-areq") {
            htamlGet(attribute.value, true, config).then((res: any) => {
              htamlElement.response = res;
              htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute);
              this.__stepThroughHTAMLElement(htamlElement).catch(() => {});
            });
            return resolve(null);
          }
        }
      } else if (attribute.action === "post") {
        const data = getVariable(htamlElement, "__form__data");
        if (data) {
          if (attribute.id === "h-req") {
            await htamlPost(attribute.value, data, false, config);
          } else if (attribute.id === "h-areq") {
            htamlPost(attribute.value, data, true, config).then((res: any) => {
              htamlElement.response = res;
              htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute);
              this.__stepThroughHTAMLElement(htamlElement).catch(() => {});
            });
            return resolve(null);
          }
        }
      } else if (attribute.action === "out") {
        const variable = attribute.value;
        htamlElement.variables[variable] = htamlElement.response.body;
        htamlElement.response.body = "";
      }
      return resolve(htamlElement);
    });
  }

  private async __handleRunAttribute(htamlElement: any, attribute: any) {
    //perform http request and return responses
    return await new Promise(async (resolve, reject) => {
      const element: HTMLElement = htamlElement.root;

      let value = attribute.value;
      if (attribute.action === "hscript") {
        // runs javscript code
        value = replaceVariable(value, htamlElement) as any;
        if (value) {
          value = value.replace(/\s\s/g, "");
          htamlElement.variables["hscript"] = await htamlEvalHScript(value);
        }
      } else if (attribute.action === "for" && attribute.value.match(/(\sin\s)/)) {
        element.classList.add("htaml-cloak");

        value = value.split(" ");
        if (value.length == 3) {
          const varToReplace = value[0]; //only used for array and not objects
          let loopTarget = value[2]; //can be defind as user.addresses or users

          let data: any = replaceVariable(loopTarget, htamlElement);
          if (data) {
            this.htamlParser.removeChildNodesFromHTAMLElement(htamlElement);

            let last_clone: any = null;
            const __processNode = async (data: any, htamlElement: HTAMLElement): Promise<any> => {
              Object.assign(htamlElement.variables, data);

              htamlElement = (await this.__stepThroughHTAMLElement(htamlElement)) as HTAMLElement;
              if (htamlElement.childrens) {
                for (let child of htamlElement.childrens) {
                  child = await __processNode(data, cloneHTAMLNode(child));
                  if (child.root) htamlElement.root.appendChild(child.root);
                }
              }
              return htamlElement;
            };

            for (let _htamlElement of htamlElement.childrens) {
              let index: number = 0;
              for (let value of data) {
                //for each child step over each inner child and process elements
                let clone = cloneHTAMLNode(_htamlElement);

                // dom:text only understands key value pairs, so to solve this problem i
                // will put the array value in a object as follow -> eg: [varToReplace] = '0'
                // where varToReplace is equal to the fisrt word for in a for expression. eg: number in numbers -> ['number'] = '0'
                const dataObject: any = {};
                dataObject["i"] = index.toString();
                dataObject[varToReplace] = value;

                clone = await __processNode(dataObject, clone);
                if (clone) element.appendChild(clone.root);
                index++;
              }
            }
          }
          removeClassesFromHTAMLElement(htamlElement, ["htaml-cloak", "htaml-none", "htaml-hidden"]);
        }
      } else if (attribute.action === "if") {
        element.classList.add("htaml-none");
        value = replaceVariable(value, htamlElement, { isIf: true });
        const result = await htamlEval(value); //JSON.stringify(value)
        if (!result) {
          element.remove();
          return resolve(null);
        }

        removeClassesFromHTAMLElement(htamlElement, ["htaml-cloak", "htaml-none", "htaml-hidden"]);
      }
      return resolve(htamlElement);
    });
  }

  private async __handleHScript(htamlElement: any): Promise<HTAMLElement | null> {
    /*        Note: The results of a hscript will always be place on the parent tag    */

    let root: HTMLElement = htamlElement.root;
    let code: string = root.innerText;

    let variable: any = code.match(/return\s(\w+)/); //the name of the return variable
    if (variable.length < 2 || variable.length > 2) return null;
    variable = variable[1];

    code = replaceVariable(code, htamlElement) as any;
    if (code) {
      code = code.replace(/\s\s/g, "");
      await htamlEvalHScript(code);
    }

    const result = (await htamlEvalHScript(code)) as any;
    if (result) htamlElement.parent.variables[variable] = result;

    return htamlElement;
  }

  private async __handleDomAttribute(htamlElement: HTAMLElement, attribute: any): Promise<HTAMLElement | null> {
    return new Promise(async (resolve, reject) => {
      const element = htamlElement.root as HTMLElement | any;
      let target = null;
      let values: any = [];
      let value = attribute.value;
      let variables: Array<string> = [];

      switch (attribute.action) {
        case "flick":
          //similar to toggle but only allows ane element on at a time
          values = value.match(/[(#|\w+)|(\w+:\.|#|\w+)]+/gi);
          target = document.querySelector(values[0]) as HTMLElement;
          if (target) {
            values = values.slice(1);
            for (let modifier of values) {
              modifier = modifier.split(":");
              if (modifier[0] === "attr") {
                const attrs = document.querySelectorAll(`[${modifier[1]}]`).forEach((attr: any) => {
                  attr.classList.add("htaml-none");
                });
              } else if (modifier[0] === "active") {
                const attrs = document.querySelectorAll(`${modifier[1]}`).forEach((attr: any) => {
                  attr.classList.remove(modifier[1].substring(1));
                });
                element.classList.add(modifier[1].substring(1));
              }
            }

            target.classList.remove("htaml-cloak");
            target.classList.remove("htaml-none");
            target.classList.remove("htaml-hidden");
          }
          break;
        case "toggle":
          //toggle an element on and off
          values = value.match(/[(#|\w+)|(\w+:\.|#|\w+)]+/gi);
          target = document.querySelector(values[0]) as HTMLElement;
          if (target) {
            value = value[1].split(":");
            target.classList.remove("htaml-cloak");
            target.classList.remove("htaml-none");

            if (!target.classList.contains(`htaml-${value}`)) target.classList.add(`htaml-${value}`);
            else target.classList.remove(`htaml-${value}`);
          }
          break;
        case "bindto":
          //ignore
          break;
        case "bind":
          // use for one way data binding but can also used for two way data binding
          const targets: any = [];
          const find = (htamlElements: any): any => {
            for (const htamlElement of htamlElements) {
              for (const attribute of htamlElement.attributes) {
                if (attribute.action == "bindto") {
                  const _tmpValues = attribute.value.split(",");
                  for (const v of _tmpValues) {
                    if (v == value) targets.push(htamlElement);
                  }
                }
              }
              if (htamlElement.childrens) find(htamlElement.childrens);
            }
            return targets;
          };
          target = find(this.htamlElements);
          if (target)
            target.forEach((t: any) => {
              switch (t.root.tagName.toLowerCase()) {
                case "select":
                case "textarea":
                case "input":
                  t.root.value = element.value;
                  break;
                default:
                  t.root.textContent = element.value;
                  break;
              }
              t.root.textContent = element.value;
            });
          break;
        case "proc":
          // process a htaml dom element with htaml attributes
          let index = 0; // used to insert htanlement into allHTAMLElements list
          values = value.match(/[(#|\w+)|(\w+:\.|#|\w+)]+/gi);

          if (!values.length) break;
          if (values[0] === "nextSibling") {
            //grab next htaml element below current
            for (let i = 0; i < htamlElement.parent.childrens.length; i++) {
              if (htamlElement.parent.childrens[i].id == htamlElement.id) {
                target = htamlElement.parent.childrens[i + 1];
                break;
              }
            }
          } else {
            // mosliky a dom id
            if (values[0].charAt(0) == "#") values[0] = values[0].substring(1);

            for (const htamlElement of this.htamlElements) {
              if (htamlElement.root.id == values[0]) {
                target = htamlElement;
                break;
              }
              index++;
            }
          }

          if (target) {
            removeClassesFromHTAMLElement(target, ["htaml-cloak", "htaml-none", "htaml-hidden"]);
            target = removeHTAMLAttributeFromHTAMLElement(target, { action: "cloak" });
            target = removeHTAMLAttributeFromHTAMLElement(target, { action: "ignore" });

            let isModified = false;
            const modifiers = values.slice(1);
            if (modifiers.length) {
              for (let modifier of modifiers) {
                if (modifier.includes(":")) {
                  modifier = modifier.split(":");
                  switch (modifier[0]) {
                    case "onProcess":
                      if (modifier[1] === "remove_old") {
                        //removes old node and add new node
                        const clone = cloneHTAMLNode(target);
                        target.root.remove();
                        target = await this.__stepThroughHTAMLElement(clone);
                        element.nextSibling.remove();
                        element.insertAdjacentElement("afterend", target.root);
                        isModified = true;
                      }
                      break;
                  }
                }
              }
            }

            if (!isModified) this.__stepThroughHTAMLElements([target]);
          }
          break;
        case "ignore":
          // ignore any element with this attribute
          if (value !== "this") break;
          //   htamlElement = removeHTAMLAttributeFromHTAMLElement(htamlElement, attribute);
          return resolve(null);
        case "swap":
          // replaces the given target with the element.response.body
          const _ms = attribute.value.split(" ");
          const _ = document.querySelector(_ms[0]) as HTMLElement;
          if (_) {
            let _tn = null;
            if (value.includes("transition")) {
              _tn = value.match(/transition:([\w-]*)/);
              if (_tn.length == 2) _.classList.remove(_tn[1]);
            }

            if ((value.includes("outter") || value.includes("this")) && _.tagName !== "HTML") {
              _.outerHTML = htamlElement.response.content;
              await this.__stepThroughHTAMLElements(await this.htamlParser._parseElementChildrens(document.body.children as HTMLCollection));
            } else if (value.includes("inner")) {
              _.innerHTML = htamlElement.response.content;
              await this.__stepThroughHTAMLElements(await this.htamlParser._parseElementChildrens(_.children as HTMLCollection));
            } else if (_.tagName !== "HTML") {
              _.outerHTML = htamlElement.response.content;
              await this.__stepThroughHTAMLElements(await this.htamlParser._parseElementChildrens(document.body.children as HTMLCollection));
            } else _.innerHTML = htamlElement.response.content;
            await this.__stepThroughHTAMLElements(await this.htamlParser._parseElementChildrens(_.children as HTMLCollection));

            if (_tn) _.classList.add(_tn[1]);
          }
          break;
        case "cloak":
          //
          if (value === "cloak") element.classList.add("htaml-cloak");
          else if (value === "none") element.classList.add("htaml-none");
          else if (value === "hidden") element.classList.add("htaml-hidden");
          break;
        case "data":
          //we have data to store
          let json: any = new HTAMLJParser(attribute.value);
          const result = await htamlEval(json);
          Object.assign(htamlElement.variables, result);
          break;
        case "text":
          // set the inner text of a element
          element.removeAttribute(attribute.action);
          variables = value.split(",").reverse();
          for (const variable of variables) {
            value = replaceVariable(variable, htamlElement);
            if (value) {
              value = await htamlEval(value);
              if (value) element.insertAdjacentText("afterbegin", value);
            }
          }
          break;
        default:
          //  any default element attributes
          element.removeAttribute(attribute.action);
          variables = value.split(",").reverse();
          for (const variable of variables) {
            value = replaceVariable(variable, htamlElement);
            if (value) {
              value = await htamlEval(value);
              if (value) element[attribute.action] = value;
            }
          }
          break;
      }
      return resolve(htamlElement);
    });
  }

  private async __stepThroughHTAMLElement(htamlElement: any) {
    for (const _a of htamlElement.attributes) {
      switch (_a.id.split("-")[1]) {
        case "hscript":
          if (_a.value) await this.__handleHScript(htamlElement);
          return null;
        case "run":
          htamlElement = await this.__handleRunAttribute(htamlElement, _a);
          if (!htamlElement) return null;
          break;
        case "req":
        case "areq":
          htamlElement = await this.__handleReqAttribute(htamlElement, _a);
          if (!htamlElement) return null;
          break;
        case "on":
          htamlElement = await this.__handleOnAttribute(htamlElement, _a);
          //    if (!htamlElement) return null //stop processing on triggers
          return htamlElement;
        case "dom":
          htamlElement = await this.__handleDomAttribute(htamlElement, _a);
          if (!htamlElement) return null;
          break;
      }
    }
    return htamlElement;
  }

  private async __stepThroughHTAMLElements(htamlElements: any) {
    if (htamlElements) {
      for (let _a of htamlElements) {
        _a = await this.__stepThroughHTAMLElement(_a);
        if (_a) if (_a.childrens) _a = (await this.__stepThroughHTAMLElements(_a.childrens)) as any;
      }
    }
  }
}
