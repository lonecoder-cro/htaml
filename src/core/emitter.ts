export class EventEmitter {
  listeners: any = {};

  constructor() { }

  listenerCount(eventName: string, func: Function): number {
    const funcs: Array<any> = this.listeners[eventName] || []
    return funcs.length
  }

  rawListener(eventName: string): Array<any> {
    return this.listeners[eventName]
  }

  addListener(eventName: string, func: Function): EventEmitter {
    this.listeners[eventName] = this.listeners[eventName] || []
    this.listeners[eventName].push(func)
    return this
  }

  removeListener(eventName: string, func: Function): EventEmitter {
    delete this.listeners[eventName]
    return this
  }

  emit(eventName: string, ...args: any): boolean {
    let funcs = this.listeners[eventName]
    if (!funcs) return false
    funcs.forEach((f: any) => {
      f(...args)
    })
    return true
  }

  once(eventName: string, func: Function | any): EventEmitter {
    this.listeners[eventName] = this.listeners[eventName] || []
    const onceWrapper = () => {
      func()
      this.off(eventName, func)
    }
    this.listeners[eventName].push(onceWrapper)
    return this
  }

  on(eventName: string, func: Function | any): EventEmitter {
    return this.addListener(eventName, func)
  }

  off(eventName: string, func: Function | any): EventEmitter {
    return this.removeListener(eventName, func)
  }
}
