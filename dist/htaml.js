(()=>{"use strict";var __webpack_modules__={913:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default={DISABLED_ELEMENTS:["FORM","BUTTON","INPUT"],MODIFIERS_REGEX:/(?<=\s|^)([a-zA-Z_]+:\S+)(?=\s|$)/gi,HTAML_REGEX:/(h|ht|hta|htaml)-(\w*):(\w*)/,H_SCRIPT:"H-SCRIPT"}},285:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{l(r.next(e))}catch(e){i(e)}}function a(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}l((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.htamlPost=t.htamlGet=void 0,t.htamlGet=function(e,t=!1,r){return n(this,void 0,void 0,(function*(){return new Promise(((n,o)=>{const i=new XMLHttpRequest;i.open("GET",e,t),r.hasOwnProperty("credentials")&&(i.withCredentials=r.credentials),r.hasOwnProperty("timeout")&&(i.timeout=Number(r.timeout)),r.hasOwnProperty("headers")&&Object.entries(r.headers).forEach((e=>i.setRequestHeader(e[0],e[1]))),i.onload=function(e){const t={content:this.response,body:"",status:this.status};if(200===this.status)try{t.body=JSON.parse(this.responseText)}catch(e){t.body=this.responseText}else t.status=this.status;return n(t)},i.send()}))}))},t.htamlPost=function(e,t,r=!1,o){return n(this,void 0,void 0,(function*(){return new Promise(((n,i)=>{let s=!1;const a=new XMLHttpRequest;if(a.open("POST",e,r),o.hasOwnProperty("credentials")&&(a.withCredentials=o.credentials),o.hasOwnProperty("timeout")&&(a.timeout=Number(o.timeout)),o.hasOwnProperty("headers")&&Object.entries(o.headers).forEach((e=>{a.setRequestHeader(e[0],e[1]),"application/x-www-form-urlencoded"===e[1].toLowerCase()&&(s=!0)})),a.onload=function(e){const t={content:this.response,body:"",status:this.status};if(200===this.status)try{t.body=JSON.parse(this.responseText)}catch(e){t.body=this.responseText}else t.status=this.status;return n(t)},s){const e=new FormData;Object.entries(t).forEach((t=>{e.append(t[0],t[1])})),t=e}else{const e=[];Object.entries(t).forEach((t=>{e.push(`${encodeURIComponent(t[0])}=${encodeURIComponent(t[1])}`)})),t=e}a.send(t)}))}))}},488:function(__unused_webpack_module,exports,__webpack_require__){var __awaiter=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{l(r.next(e))}catch(e){i(e)}}function a(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}l((r=r.apply(e,t||[])).next())}))},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.htamlEval=exports.htamlEvalHScript=exports.EventEmitter=exports.createEvent=exports.isLetter=exports.isNumber=exports.getVariable=exports.removeClassesFromHTAMLElement=exports.replaceVariable=exports.removeHTAMLAttributeFromHTAMLElement=exports.cloneHTAMLNode=exports.reateEventOnHTAMLElement=exports.removeChildNodesFromHTAMLElement=exports.removeHTAMLAttributesFromHTAMLElement=exports.extractHTAMLAttributesFromElement=exports.addHTAMLElementToDomIds=exports.getHTAMLElementByDomId=exports.disableEvents=void 0;const config_1=__importDefault(__webpack_require__(913)),domIds={};function disableEvents(e){switch(e.root.tagName){case"INPUT":e.root.oninput=()=>{};break;case"BUTTON":e.root.onclick=e=>{e.preventDefault()};break;case"FORM":e.root.onsubmit=e=>{e.preventDefault(),alert("fopr")}}return e}function getHTAMLElementByDomId(e){return domIds.hasOwnProperty(e)?domIds[e]:null}function addHTAMLElementToDomIds(e,t){domIds[t]=e}function extractHTAMLAttributesFromElement(e){const t=[];if(!e.getAttributeNames().toString().match(config_1.default.HTAML_REGEX))return t;for(let n of e.getAttributeNames())if((n.startsWith("h-")||n.startsWith("ht-")||n.startsWith("hta-")||n.startsWith("htaml-"))&&n.includes(":")){const r=n.split(":"),o=r[0],i=r[1],s=e.getAttribute(n);s&&t.push({id:o,action:i,value:s})}return t}function removeHTAMLAttributesFromHTAMLElement(e){const t=e.root;for(let e of t.getAttributeNames())e.match(config_1.default.HTAML_REGEX)&&t.removeAttribute(e)}function removeChildNodesFromHTAMLElement(e){return e.childrens.map((e=>e.root.remove())),e}function reateEventOnHTAMLElement(e,t){return e.root.dispatchEvent(new Event(t)),e}function cloneHTAMLNode(e,t={cloneAll:!1,removeOriginal:!0}){const n={id:e.id,root:e.root.cloneNode(t.cloneAll),parent:e.parent,request:e.request,response:e.response,variables:e.variables,childrens:e.childrens,attributes:e.attributes};return t.removeOriginal&&e.root.remove(),n}function removeHTAMLAttributeFromHTAMLElement(e,t){return e.attributes=e.attributes.filter((e=>e.action!==t.action)),e.root.removeAttribute(`${t.id}:${t.action}`),e}function replaceVariable(e,t,n={stringify:!1,isIf:!1}){let r=e.match(/\$(\w+)/g);if(r&&r.length)for(const o of r){const r=getVariable(t,o.substring(1),n.stringify);r&&(e="string"==typeof r?e.replace(new RegExp(o,"g").source,`'${r}'`):e.replace(new RegExp(o,"g").source,r))}else if(t.root.tagName!==config_1.default.H_SCRIPT){const r=e.match(/[([a-zA-Z_)|(a-zA-Z_\.)]+/gi),o=(e,t)=>{if(e){let r=null;for(const o of e)if(r)r.hasOwnProperty(o)?r=r[o]:r+=`.${o}`;else{const e=getVariable(t,o,n.stringify);if(!e)return null;r=e}return r}};if(r)for(const i of r)if(i.includes(".")){let r=i.split(".");if("this"===r[0]){if(r=r.splice(1),!o(r,{variables:t}))break;e=e.replace(new RegExp(i,"g").source,o(r,{variables:t}))}else{const s=o(r,t);if(!s)break;e=n.isIf?e.replace(new RegExp(i,"g").source,s):s}}else{const r=getVariable(t,i,n.stringify);if(!r){if(n.isIf)return null;break}e=n.isIf?e.replace(new RegExp(i,"g").source,r):r}}return e}function removeClassesFromHTAMLElement(e,t){return t.forEach((t=>{e.root.classList.remove(t)})),null}function getVariable(e,t,n=!1){let r=null;return e?(r=e.variables.hasOwnProperty(t)?e.variables[t]:getVariable(e.parent,t),n&&(r=JSON.stringify(r)),r):r}function isNumber(e){return 1===e.length&&e.match(/[0-9]/i)}function isLetter(e){return 1===e.length&&e.match(/[a-zA-Z0-9]/i)}function createEvent(e,t,n=null){return CustomEvent,HTMLElement,e.dispatchEvent(new CustomEvent(t,{detail:n})),e}exports.disableEvents=disableEvents,exports.getHTAMLElementByDomId=getHTAMLElementByDomId,exports.addHTAMLElementToDomIds=addHTAMLElementToDomIds,exports.extractHTAMLAttributesFromElement=extractHTAMLAttributesFromElement,exports.removeHTAMLAttributesFromHTAMLElement=removeHTAMLAttributesFromHTAMLElement,exports.removeChildNodesFromHTAMLElement=removeChildNodesFromHTAMLElement,exports.reateEventOnHTAMLElement=reateEventOnHTAMLElement,exports.cloneHTAMLNode=cloneHTAMLNode,exports.removeHTAMLAttributeFromHTAMLElement=removeHTAMLAttributeFromHTAMLElement,exports.replaceVariable=replaceVariable,exports.removeClassesFromHTAMLElement=removeClassesFromHTAMLElement,exports.getVariable=getVariable,exports.isNumber=isNumber,exports.isLetter=isLetter,exports.createEvent=createEvent;class EventEmitter{constructor(){this.listeners={}}listenerCount(e,t){return(this.listeners[e]||[]).length}rawListener(e){return this.listeners[e]}addListener(e,t){return this.listeners[e]=this.listeners[e]||[],this.listeners[e].push(t),this}removeListener(e,t){return delete this.listeners[e],this}emit(e,...t){let n=this.listeners[e];return!!n&&(n.forEach((e=>{e(...t)})),!0)}once(e,t){return this.listeners[e]=this.listeners[e]||[],this.listeners[e].push((()=>{t(),this.off(e,t)})),this}on(e,t){return this.addListener(e,t)}off(e,t){return this.removeListener(e,t)}}function htamlEvalHScript(code){return __awaiter(this,void 0,void 0,(function*(){return new Promise(((resolve,reject)=>{function _(){return new Function(code)()}const result=eval("_()");return resolve(result||null)}))}))}function htamlEval(code,options={stringify:!1}){return __awaiter(this,void 0,void 0,(function*(){return new Promise(((resolve,reject)=>{function _(){try{return new Function(`return ${code}`)()}catch(e){return new Function(`return ${JSON.stringify(code)}`)()}}const result=eval("_()");return resolve(result||null)}))}))}exports.EventEmitter=EventEmitter,exports.htamlEvalHScript=htamlEvalHScript,exports.htamlEval=htamlEval},910:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.parseDomElements=t.parseElement=t.parseHScriptElement=t.parseElementChildrens=void 0;const o=r(n(913)),i=n(488);let s=-1,a={},l=[];function c(e){const t=[];for(const n of e){const e=d(n);e&&t.push(e)}return t}function u(e){return e.root.classList.add("htaml-hide"),e.attributes.push({id:"h-hscript",value:!0}),e}function d(e){if("SCRIPT"===e.tagName)return null;++s;const t=s;let n={id:t,root:e,parent:null,request:{config:{},data:{}},response:{body:"",content:"",status:-1},variables:{},childrens:[],attributes:(0,i.extractHTAMLAttributesFromElement)(e)};if(n.root.setAttribute("h-dom:id",t),a[t]=n,a[t].root.parentElement){const e=a[t].root.parentElement.getAttribute("h-dom:id");e&&(a[t].parent=a[Number(e)])}return a[t].root.tagName===o.default.H_SCRIPT&&(a[t]=u(a[t])),o.default.DISABLED_ELEMENTS.includes(a[t].root.tagName)&&(a[t]=(0,i.disableEvents)(a[t])),a[t].root.children.length&&(a[t].childrens=c(a[t].root.children)),(0,i.removeHTAMLAttributesFromHTAMLElement)(a[t]),l.push(a[t]),a[t]}t.parseElementChildrens=c,t.parseHScriptElement=u,t.parseElement=d,t.parseDomElements=function(e){const t=[];for(let n of e){const e=d(n);e&&t.push(e)}return t}},44:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{l(r.next(e))}catch(e){i(e)}}function a(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.stepThroughHTAMLElements=void 0;const i=n(488),s=n(285),a=o(n(68)),l=n(910),c=o(n(913));function u(e,t){return r(this,void 0,void 0,(function*(){return new Promise(((n,o)=>r(this,void 0,void 0,(function*(){const o=e.root,s=t.value.split(" ");if(e=(0,i.removeHTAMLAttributeFromHTAMLElement)(e,t),"trigger"===t.action){const a=n=>r(this,void 0,void 0,(function*(){(0,i.createEvent)(o,"htaml_change",e);const l=n.target;if(t.value.includes("once")&&l.removeEventListener(s[0],a),t.value.includes("delay")){let n=0;const o=t.value.match(/delay:(\d*)(\w)/);3==o.length&&("s"===o[2]?n=Number(1e3*o[1]):"ms"===o[2]&&(n=Number(1e6*o[1]))),(n>2147483647||n<1)&&(n=1),setTimeout((()=>r(this,void 0,void 0,(function*(){yield f(e)}))),n)}else yield f(e)}));"submit"==t.value?o.addEventListener("click",(()=>r(this,void 0,void 0,(function*(){let e=(0,i.getHTAMLElementByDomId)("form");if(!e)return n(null);const t=e.root,r={},o=t.querySelectorAll("input");for(const e of o)r[e.name]=e.value;const s=t.querySelectorAll("textarea");for(const e of s)r[e.name]=e.value;e.request.data=r,e=(0,i.removeHTAMLAttributeFromHTAMLElement)(e,{action:"ignore"}),yield f(e)})))):o.addEventListener(s[0],a)}return n(e)}))))}))}function d(e,t){return r(this,void 0,void 0,(function*(){return new Promise(((n,o)=>r(this,void 0,void 0,(function*(){const r=e.request.config;if("data"===t.action){let n=new a.default(t.value);e.request.data=yield(0,i.htamlEval)(n)}else if("config"===t.action)t.value=t.value.replace(/\s/g,""),t.value=t.value.replace(/\'/g,'"'),e.request.config=JSON.parse(t.value);else if("get"===t.action){if(!r.hasOwnProperty("pooling"))if("h-req"===t.id)e.response=yield(0,s.htamlGet)(t.value,!1,r);else if("h-areq"===t.id)return(0,s.htamlGet)(t.value,!0,r).then((n=>{e.response=n,f(e=(0,i.removeHTAMLAttributeFromHTAMLElement)(e,t)).catch((()=>{}))})),n(null)}else if("post"===t.action){const o=e.request.data;if(o)if("h-req"===t.id)e.response=yield(0,s.htamlPost)(t.value,o,!1,r);else if("h-areq"===t.id)return(0,s.htamlPost)(t.value,o,!0,r).then((n=>{e.response=n,f(e=(0,i.removeHTAMLAttributeFromHTAMLElement)(e,t)).catch((()=>{}))})),n(null)}else if("out"===t.action){const n=t.value;e.variables[n]=e.response.body}return n(e)}))))}))}function h(e,t){return r(this,void 0,void 0,(function*(){return yield new Promise(((n,o)=>r(this,void 0,void 0,(function*(){const o=e.root;let s=t.value;if("hscript"===t.action)s=(0,i.replaceVariable)(s,e),s&&(s=s.replace(/\s\s/g,""),e.variables.hscript=yield(0,i.htamlEvalHScript)(s));else if("for"===t.action&&t.value.match(/(\sin\s)/)){if(o.classList.add("htaml-cloak"),s=s.split(" "),3==s.length){const t=s[0];let n=s[2],a=(0,i.replaceVariable)(n,e);if(a){(0,i.removeChildNodesFromHTAMLElement)(e);const n=(e,t)=>r(this,void 0,void 0,(function*(){if(Object.assign(t.variables,e),(t=yield f(t)).childrens)for(let r of t.childrens)r=yield n(e,(0,i.cloneHTAMLNode)(r,{removeOriginalNode:!0})),r.root&&t.root.appendChild(r.root);return t}));for(let r of e.childrens){let e=0;for(let s of a){let a=(0,i.cloneHTAMLNode)(r,{removeOriginalNode:!0});const l={};l.i=e.toString(),l[t]=s,a=yield n(l,a),a&&o.appendChild(a.root),e++}}}(0,i.removeClassesFromHTAMLElement)(e,["htaml-cloak","htaml-hide","htaml-hidden"])}}else if("if"===t.action){if(o.classList.add("htaml-hide"),s=(0,i.replaceVariable)(s,e,{isIf:!0}),!(yield(0,i.htamlEval)(s)))return o.remove(),n(null);e=(0,i.removeHTAMLAttributeFromHTAMLElement)(e,{action:"cloak"}),(0,i.removeClassesFromHTAMLElement)(e,["htaml-cloak","htaml-hide"])}return n(e)}))))}))}function m(e){return r(this,void 0,void 0,(function*(){let t=e.root.innerText,n=t.match(/return\s(\w+)/);if(n&&n.length>2)return null;if(n&&2==n.length&&(n=n[1]),t=(0,i.replaceVariable)(t,e),t){t=t.replace(/\s\s/g,"");const r=yield(0,i.htamlEvalHScript)(t);r&&n&&(e.parent.variables[n]=r)}return null}))}function p(e,t){return r(this,void 0,void 0,(function*(){return new Promise(((n,o)=>r(this,void 0,void 0,(function*(){const r=e.root;let o=null,s="",u=t.value,d=[],h=null;switch(t.action){case"id":(0,i.addHTAMLElementToDomIds)(e,u);break;case"switch":if(s=u.split(" ")[0],o=(0,i.getHTAMLElementByDomId)(s),o&&(o=o.root,h=u.match(c.default.MODIFIERS_REGEX),h)){for(let e of h)e=e.split(":"),"attr"===e[0]?document.querySelectorAll(`[${e[1]}]`).forEach((e=>e.classList.add("htaml-hide"))):"active"===e[0]&&(document.querySelectorAll(`${e[1]}`).forEach((t=>t.classList.remove(e[1].substring(1)))),r.classList.add(e[1].substring(1)));o.classList.remove("htaml-cloak"),o.classList.remove("htaml-hide")}break;case"toggle":if(s=u.split(" ")[0],o=(0,i.getHTAMLElementByDomId)(s),o&&(h=u.match(c.default.MODIFIERS_REGEX),h))for(let e of h)e=e.split(":"),o.root.classList.remove("htaml-cloak"),o.root.classList.remove("htaml-hide"),o.root.classList.contains(`htaml-${e}`)?o.root.classList.remove(`htaml-${e}`):o.root.classList.add(`htaml-${e}`);break;case"bindto":if(o=(0,i.getHTAMLElementByDomId)(u),o)o=o.root;else if(o=document.querySelector(`input[name="${u}"]`),!o)return n(null);o.addEventListener("htaml_change",(e=>{{const t=e.target;switch(e.detail,t.tagName){case"select":case"textarea":case"input":r.value=t.value;break;default:r.textContent=t.value}}}));break;case"proc":if(s=u.split(" ")[0],o=(0,i.getHTAMLElementByDomId)(s),o){(0,i.removeClassesFromHTAMLElement)(o,["htaml-cloak","htaml-hide"]),[{action:"cloak"},{action:"ignore"}].forEach((e=>o=(0,i.removeHTAMLAttributeFromHTAMLElement)(o,e)));let e=!1;if(h=u.match(c.default.MODIFIERS_REGEX),h&&h.length)for(let t of h)if(t=t.split(":"),"on_process"===t[0])if("replace"===t[1]){const t=(0,i.cloneHTAMLNode)(o,{removeOriginal:!0});o=yield f(t),o&&(r.insertAdjacentElement("afterend",o.root),e=!0)}else"scroll"===t[1]&&(o=yield f(o),o&&(window.scrollTo({top:o.root.scrollHeight,behavior:"smooth"}),e=!0));e||v([o])}break;case"ignore":if("this"===u)return e=(0,i.removeHTAMLAttributeFromHTAMLElement)(e,t),yield v(e.childrens),n(null);if("all"===u)return n(null);break;case"swap":if(s=u.split(" ")[0],o=(0,i.getHTAMLElementByDomId)(s),o)o=o.root;else if(o=document.querySelector(s),!o)return n(null);let m=null;u.includes("transition")&&(m=u.match(/transition:([\w-]*)/),m&&2==m.length&&o.classList.remove(m[1]));const p=e.response.content.match(/<title>(\w*)<\/title>/i);p&&p.length>1&&(e.response.content=e.response.content.replace(new RegExp(p[0]),""),document.title=p[1]),(u.includes("outter")||u.includes("this"))&&"HTML"!==o.tagName?(o.outerHTML=e.response.content,yield v(yield(0,l.parseElementChildrens)(document.body.children))):u.includes("inner")?(o.innerHTML=e.response.content,yield v(yield(0,l.parseElementChildrens)(o.children))):"HTML"!==o.tagName?(o.outerHTML=e.response.content,yield v(yield(0,l.parseElementChildrens)(document.body.children))):o.innerHTML=e.response.content,yield v(yield(0,l.parseElementChildrens)(o.children)),m&&o.classList.add(m[1]);break;case"cloak":"cloak"===u?r.classList.add("htaml-cloak"):"hide"===u&&r.classList.add("htaml-hide");break;case"data":let _=new a.default(t.value);const b=yield(0,i.htamlEval)(_);Object.assign(e.variables,b);break;case"text":r.removeAttribute(t.action),d=u.split(",").reverse();for(const t of d)u=(0,i.replaceVariable)(t,e),u&&(u=yield(0,i.htamlEval)(u),u&&r.insertAdjacentText("afterbegin",u));break;default:r.removeAttribute(t.action),d=u.split(",").reverse();for(const n of d)u=(0,i.replaceVariable)(n,e),u&&(u=yield(0,i.htamlEval)(u),u&&(r[t.action]=u))}return n(e)}))))}))}function f(e){return r(this,void 0,void 0,(function*(){for(const t of e.attributes)switch(t.id.split("-")[1]){case"hscript":return t.value&&(yield m(e)),null;case"run":if(!(e=yield h(e,t)))return null;break;case"req":case"areq":if(!(e=yield d(e,t)))return null;break;case"on":return e=yield u(e,t);case"dom":if(!(e=yield p(e,t)))return null}return e}))}function v(e){return r(this,void 0,void 0,(function*(){if(e)for(let t of e)t=yield f(t),t&&t.childrens&&(t=yield v(t.childrens))}))}t.stepThroughHTAMLElements=v},962:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=[()=>"\n\n.htaml-cloak{\n    opacity:0 !important;\n    pointer-events:none;\n}\n\n.htaml-visible{\n    opacity:1 !important;\n    pointer-events:all;\n}\n\n.htaml-hide{\n    display:none !important;\n    pointer-events:none;\n}\n\n.htaml-show{\n    display:block !important;\n    pointer-events:all;\n}\n\n.htaml-fadein {\n    visibility: hidden !important;\n    opacity:0;\n}\n\n.htaml-fadein-active\n{\n    visibility: visible !important;\n\n    -webkit-animation: fadeInFromNone 0.5s ease-out;\n    -moz-animation: fadeInFromNone 0.5s ease-out;\n    -o-animation: fadeInFromNone 0.5s ease-out;\n    animation: fadeInFromNone 0.5s ease-out;\n}\n\n@-webkit-keyframes fadeInFromNone {\n    0% {\n        display: none !important;\n        opacity: 0;\n    }\n\n    1% {\n        display: block !important;\n        opacity: 0;\n    }\n\n    25% {\n        display: block !important;\n        opacity: 0.3;\n    }\n\n    55% {\n        display: block !important;\n        opacity: 0.4;\n    }\n\n    80% {\n        display: block !important;\n        opacity: 0.6;\n    }\n\n    100% {\n        display: block !important;\n        opacity: 1;\n    }\n}\n@-moz-keyframes fadeInFromNone {\n    0% {\n        display: none !important;\n        opacity: 0;\n    }\n\n    1% {\n        display: block !important;\n        opacity: 0;\n    }\n\n    25% {\n        display: block !important;\n        opacity: 0.3;\n    }\n\n    55% {\n        display: block !important;\n        opacity: 0.4;\n    }\n\n    80% {\n        display: block !important;\n        opacity: 0.6;\n    }\n\n    100% {\n        display: block !important;\n        opacity: 1;\n    }\n}\n\n@-o-keyframes fadeInFromNone {\n    0% {\n        display: none !important;\n        opacity: 0;\n    }\n\n    1% {\n        display: block !important;\n        opacity: 0;\n    }\n\n    25% {\n        display: block !important;\n        opacity: 0.3;\n    }\n\n    55% {\n        display: block !important;\n        opacity: 0.4;\n    }\n\n    80% {\n        display: block !important;\n        opacity: 0.6;\n    }\n\n    100% {\n        display: block !important;\n        opacity: 1;\n    }\n}\n\n@keyframes fadeInFromNone {\n    0% {\n        display: none !important;\n        opacity: 0;\n    }\n\n    1% {\n        display: block !important;\n        opacity: 0;\n    }\n\n    25% {\n        display: block !important;\n        opacity: 0.3;\n    }\n\n    55% {\n        display: block !important;\n        opacity: 0.4;\n    }\n\n    80% {\n        display: block !important;\n        opacity: 0.6;\n    }\n\n    100% {\n        display: block !important;\n        opacity: 1;\n    }\n}\n}\n    ".trim()]},68:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(386)),i=r(n(355));t.default=class{constructor(e){const t=(new o.default).toTokens(e);return new i.default(t).parse()}}},386:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(985)),i=r(n(4)),s=n(488);t.default=class{constructor(){this.index=0,this.tokens=[],this.jsonLikeObject="",this.current_character=null}advance(){this.index>=this.jsonLikeObject.length?this.current_character=null:this.current_character=this.jsonLikeObject[this.index++]}createId(){let e="";for(;":"!=this.current_character;)e+=this.current_character,this.advance();return e}createString(){const e=this.current_character;this.advance();let t="";for(;this.current_character!=e;)t+=this.current_character,this.advance();return t}createNumber(){let e="";for(;(0,s.isNumber)(this.current_character);)e+=this.current_character,this.advance();return Number(e)}toTokens(e){for(this.jsonLikeObject=e,this.advance();null!=this.current_character;){switch((0,s.isNumber)(this.current_character)&&this.tokens.push(new i.default("INT",o.default.INT,this.createNumber(),Number(this.index))),'"'!==this.current_character&&"'"!==this.current_character||this.tokens.push(new i.default("STR",o.default.STR,this.createString(),Number(this.index))),(0,s.isLetter)(this.current_character)&&this.tokens.push(new i.default("ID",o.default.ID,this.createId(),Number(this.index))),this.current_character){case"\n":continue;case":":this.tokens.push(new i.default("COLON",o.default.COLON,this.current_character,Number(this.index)));break;case"{":this.tokens.push(new i.default("LEFT_BRACE",o.default.LEFT_BRACE,this.current_character,Number(this.index)));break;case"}":this.tokens.push(new i.default("RIGHT_BRACE",o.default.RIGHT_BRACE,this.current_character,Number(this.index)));break;case"[":this.tokens.push(new i.default("LEFT_BRACK",o.default.LEFT_BRACK,this.current_character,Number(this.index)));break;case"]":this.tokens.push(new i.default("RIGHT_BRACK",o.default.RIGHT_BRACK,this.current_character,Number(this.index)));break;case"(":this.tokens.push(new i.default("LEFT_PAREN",o.default.LEFT_PAREN,this.current_character,Number(this.index)));break;case")":this.tokens.push(new i.default("RIGHT_PAREN",o.default.RIGHT_PAREN,this.current_character,Number(this.index)))}this.advance()}return this.tokens}}},355:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=r(n(985));t.default=class{constructor(e){this.index=0,this.current_token=null,this.json={},this.tokens=e,this.current_token=this.tokens[this.index]}advance(){this.index>=this.tokens.length?this.current_token=null:this.current_token=this.tokens[++this.index]}lookahead(e){return e>=this.tokens.length?null:this.tokens[this.index+e]}lookback(e){return e>=this.tokens.length?null:this.tokens[this.index-e]}parse(){var e,t;if(this.current_token.type==o.default.LEFT_BRACE){for(this.advance();null!=this.current_token;)this.current_token.type==o.default.ID&&(null===(e=this.lookahead(1))||void 0===e?void 0:e.type)==o.default.COLON&&(this.json[this.current_token.value]=null===(t=this.lookahead(2))||void 0===t?void 0:t.value),this.advance();return this.json}}}},4:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(e,t,n,r){this.__name=e,this.__type=t,this.__value=n,this.__index=r}get value(){return this.__value}get name(){return this.__name}get type(){return this.__type}get index(){return this.__index}}},985:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.ID=0]="ID",e[e.INT=1]="INT",e[e.STR=2]="STR",e[e.COLON=3]="COLON",e[e.NUMBER=4]="NUMBER",e[e.LEFT_BRACE=5]="LEFT_BRACE",e[e.RIGHT_BRACE=6]="RIGHT_BRACE",e[e.LEFT_BRACK=7]="LEFT_BRACK",e[e.RIGHT_BRACK=8]="RIGHT_BRACK",e[e.LEFT_PAREN=9]="LEFT_PAREN",e[e.RIGHT_PAREN=10]="RIGHT_PAREN"}(n||(n={})),t.default=n},607:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{l(r.next(e))}catch(e){i(e)}}function a(e){try{l(r.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}l((r=r.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(910),s=n(44),a=n(488),l=o(n(962));!function(){window.htaml=window.htaml||{};const e=new a.EventEmitter;function t(e,t="info"){switch(t){case"info":console.info(`[+] HTAML Logger:  ${e}`);break;case"warn":console.warn(`[+] HTAML Logger:  ${e}`);break;case"error":console.error(`[+] HTAML Logger:  ${e}`);break;default:console.log(`[+] HTAML Logger:  ${e}`)}}window.htaml.em=e,window.htaml.logger=t,window.addEventListener("DOMContentLoaded",(e=>r(this,void 0,void 0,(function*(){const n=document.createElement("style");l.default.forEach((e=>n.textContent=n.textContent+=e())),document.head.insertAdjacentElement("beforeend",n),(0,a.createEvent)(document,"htaml_init",e);const r=yield(0,i.parseDomElements)(document.body.children);document.body.classList.remove("htaml-hide"),t("dom parsed"),(0,a.createEvent)(document,"htaml_parsed",r),(0,s.stepThroughHTAMLElements)(r),t("all htaml elements processed"),(0,a.createEvent)(document,"htaml_processed",r)}))))}()}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e].call(n.exports,n,n.exports,__webpack_require__),n.exports}var __webpack_exports__=__webpack_require__(607)})();
//# sourceMappingURL=htaml.js.map