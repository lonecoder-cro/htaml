export interface HTAMLElementAttributes {
  id: string
  action: string
  value: string
}

export interface HTAMLElementResponse {
  body: string
  content: string
  status: number
}

export interface HTAMLElementRequests {
  config: any | {}
  data: any | {}
}

export interface HTAMLElement {
  id: number
  root: HTMLElement
  parent: HTAMLElement
  request: HTAMLElementRequests
  response: HTAMLElementResponse
  variables: any | {}
  childrens: Array<HTAMLElement>
  attributes: Array<HTAMLElementAttributes>
}
