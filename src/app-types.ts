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
    language: number,
    language_title?: string,
    type: string,
    created_at?: Date,
    last_used?: Date,
    translations?: Array<Translation>,
    definitions?: Array<Definition>

}
export interface Definition {
  definition_id?: number,
  for_word_id: number,
  definition: string,
  created_at?: Date,
  language: number,
}
export interface Translation {
  translation_id?: number,
  for_word_id: number,
  to_word_id: number,
  created_at?: Date,
}
export interface DBEventOptionsItem  {
  detail: {
    "resolve": (value: any | PromiseLike<any>) => void,
    "reject": (reason?: any) => void,
    "item": Word | Language
  },
  bubbles?: boolean,
  composed?: boolean 
}

export interface DrawerItem extends Element{
  closeAction():Promise<void>;
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