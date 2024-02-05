export declare class EventEmitter {
    listeners: any
    constructor()
    listenerCount(eventName: string, func: Function): number
    rawListener(eventName: string): Array<any>
    addListener(eventName: string, func: Function): EventEmitter
    removeListener(eventName: string, func: Function): EventEmitter
    emit(eventName: string, ...args: any): boolean
    once(eventName: string, func: Function | any): EventEmitter
    on(eventName: string, func: Function | any): EventEmitter
    off(eventName: string, func: Function | any): EventEmitter
}
export declare enum HTAML_STATE {
    H_CODE = "H-SCRIPT"
}
//# sourceMappingURL=core.d.ts.map
