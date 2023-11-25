//import { QueryResult } from "tauri-plugin-sql-api";

export interface Table {
    name:string,
}

export interface Language {
    lang_id?: number,
    created_at?: Date,
    last_used?: Date,
    token: string,
    title: string,
    title_native?:string,

}

export interface Type {
  type_id?:number,
  title:string,
  token:string,
  last_used?: Date


}
export interface Word {
    word_id?:number,
    word:string,
    language: string,
    type: string,
    created_at?: Date,
    last_used?: Date,

}

export const deferred = <T>() => {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
  
    return {
      resolve,
      reject,
      promise,
    };
  };