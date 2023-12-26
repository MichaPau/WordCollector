

//export type {AppRequestWordDataEvent} from './app-request-word-data.js';

declare global {
    interface GlobalEventHandlersEventMap {
      'app-request-word-data': CustomEvent;
      'on-word-submit': CustomEvent,
      'on-word-cancel': CustomEvent,
      'on-confirm-ok': Event,
      'on-confirm-cancel': Event,
    }
  }
  
export class DeferredEvent<T> extends Event {

    private readonly _promise: Promise<T>
    private _resolve!: (value: T | PromiseLike<T>) => void
    private _reject!: (reason?: any) => void
    
    readonly detail:any;

    constructor (type:string, _detail?:any) {
        super(type, {bubbles: true, composed: true});
        this.detail = _detail;
        
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }
    

    get promise (): Promise<T> {
        return this._promise
    }
  
    resolve = (value: T | PromiseLike<T>): void => {
        this._resolve(value)
    }
  
    reject = (reason?: any): void => {
        this._reject(reason)
    }
  }