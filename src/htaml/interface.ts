export interface HTAMLElementAttributes {
    id: number,
    action: string,
    value:string
}

export interface HTAMLElementResponse {
    body: string,
    content: string,
    status: number
}

export interface HTAMLElementRequests {
    config: {}
}

export interface HTAMLElement {
    id: number,
    root: HTMLElement
    parent: HTAMLElement,
    request: HTAMLElementRequests,
    response: HTAMLElementResponse,
    variables: {},
    childrens: Array<HTAMLElement>,
    attributes: Array<HTAMLElementAttributes>
}
