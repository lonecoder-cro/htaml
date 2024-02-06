const cache: any = {}

export async function htamlGet(url: string, async: boolean = false, config: any) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, async)

        if (config.hasOwnProperty('credentials')) xhr.withCredentials = config.credentials
        if (config.hasOwnProperty('timeout')) xhr.timeout = Number(config.timeout)
        if (config.hasOwnProperty('headers')) Object.entries(config.headers).forEach((_h: any) => xhr.setRequestHeader(_h[0], _h[1]))

        xhr.onload = function (req: ProgressEvent) {
            const _r: any = {
                content: this.response,
                body: '',
                status: this.status
            }

            if (this.status === 200) {
                try {
                    _r.body = JSON.parse(this.responseText)
                } catch (error) {
                    //end user can use data:transform to furthure manuplicate body
                    _r.body = this.responseText
                }
            }
            else _r.body = this.status
            return resolve(_r)
        }
        xhr.send()
    })
}

export async function htamlPost(url: string, data: any, async: boolean = false, config: any) {
    return new Promise((resolve, reject) => {
        let useFormData = false
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url, async)

        if (config.hasOwnProperty('credentials')) xhr.withCredentials = config.credentials
        if (config.hasOwnProperty('timeout')) xhr.timeout = Number(config.timeout)
        if (config.hasOwnProperty('headers')) {
            Object.entries(config.headers).forEach((_h: any) => {
                xhr.setRequestHeader(_h[0], _h[1])
                if (_h[1].toLowerCase() === 'application/x-www-form-urlencoded') useFormData = true
            })

        }
        xhr.onload = function (req: ProgressEvent) {
            const _r: any = {
                content: this.response,
                body: '',
                status: this.status
            }
            if (this.status === 200) {
                try {
                    _r.body = JSON.parse(this.responseText)
                } catch (error) {
                    //end user can use data:transform to furthure manuplicate body
                    _r.body = this.responseText
                }

            }
            else _r.body = this.status
            return resolve(_r)
        }

        //check if user wants a binray request
        if (useFormData) {
            const form = new FormData()
            Object.entries(data).forEach((entry: any) => {
                form.append(entry[0], entry[1])
            })
            data = form
        }
        else {
            const urlEncodeData: any = []
            Object.entries(data).forEach((_d: any) => {
                urlEncodeData.push(`${encodeURIComponent(_d[0])}=${encodeURIComponent(_d[1])}`)
            })
            data = urlEncodeData
        }
        xhr.send(data)
    })
}
