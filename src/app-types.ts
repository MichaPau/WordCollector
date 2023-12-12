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
export interface WordIndexable extends Word, IIndexable {}

export interface Word {
    word_id?:number,
    
    word:string,
    language: number,
    type: string,
    
    language_title?: string,
    created_at?: Date,
    last_used?: Date,
    created_timestamp?: number,
    translations?: Array<Translation>,
    definitions?: Array<Definition>

}

export type SortableColumn = keyof Word;

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
  for_word?:Word,
  to_Word?:Word,
  created_at?: Date,
}

export interface IIndexable<T = any> {
  [key: string]: T;
}

export interface SorterItem {
  column: string,
  reversed: boolean,
  type: "number" | "string" | "date"
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