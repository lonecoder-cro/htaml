import { HTAMLElementResponse } from "../htaml/interface"

export function htamlGet(url: string, async: boolean = false, config: any): HTAMLElementResponse {

  const xhr = new XMLHttpRequest()
  xhr.open("GET", url, async)

  if (config.hasOwnProperty("credentials")) xhr.withCredentials = config.credentials
  if (config.hasOwnProperty("timeout")) xhr.timeout = Number(config.timeout)
  if (config.hasOwnProperty("headers")) Object.entries(config.headers).forEach((_h: any) => xhr.setRequestHeader(_h[0], _h[1]))

  const response: HTAMLElementResponse = {
    content: '',
    body: '',
    status: 0,
  }

  xhr.onload = function (req: ProgressEvent) {
    response.content = this.response
    response.status = this.status

    if (this.status === 200) {
      try {
        response.body = JSON.parse(this.responseText)
      } catch (error) {
        //end user can use data:transform to furthure manuplicate body
        response.body = this.responseText
      }
    } else response.status = this.status

  }
  xhr.send()
  return response
}

export function htamlAGet(url: string, config: any): Promise<HTAMLElementResponse> {
  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)

    if (config.hasOwnProperty("credentials")) xhr.withCredentials = config.credentials
    if (config.hasOwnProperty("timeout")) xhr.timeout = Number(config.timeout)
    if (config.hasOwnProperty("headers")) Object.entries(config.headers).forEach((_h: any) => xhr.setRequestHeader(_h[0], _h[1]))

    xhr.onload = function (req: ProgressEvent) {
      const response: HTAMLElementResponse = {
        content: this.response,
        body: '',
        status: this.status,
      }

      if (this.status === 200) {
        try {
          response.body = JSON.parse(this.responseText)
        } catch (error) {
          //end user can use data:transform to furthure manuplicate body
          response.body = this.responseText
        }
      } else response.status = this.status
      return resolve(response)
    }
    xhr.send()
  })

}

export function htamlPost(url: string, data: any, async: boolean = false, config: any): HTAMLElementResponse {

  let useFormData = false
  const xhr = new XMLHttpRequest()
  xhr.open("POST", url, async)

  if (config.hasOwnProperty("credentials")) xhr.withCredentials = config.credentials
  if (config.hasOwnProperty("timeout")) xhr.timeout = Number(config.timeout)
  if (config.hasOwnProperty("headers")) {
    Object.entries(config.headers).forEach((_h: any) => {
      xhr.setRequestHeader(_h[0], _h[1])
      if (_h[1].toLowerCase() === "application/x-www-form-urlencoded") useFormData = true
    })
  }

  const response: HTAMLElementResponse = {
    content: '',
    body: '',
    status: 0,
  }

  xhr.onload = function (req: ProgressEvent) {
    const response: any = {
      content: this.response,
      body: "",
      status: this.status,
    }
    if (this.status === 200) {
      try {
        response.body = JSON.parse(this.responseText)
      } catch (error) {
        //end user can use data:transform to furthure manuplicate body
        response.body = this.responseText
      }
    } else response.status = this.status
  }

  //check if user wants a binary request
  if (useFormData) {
    const form = new FormData()
    Object.entries(data).forEach((entry: any) => {
      form.append(entry[0], entry[1])
    })
    data = form
  } else {
    const urlEncodeData: any = []
    Object.entries(data).forEach((_d: any) => {
      urlEncodeData.push(`${encodeURIComponent(_d[0])}=${encodeURIComponent(_d[1])}`)
    })
    data = urlEncodeData
  }
  xhr.send(data)
  return response
}
