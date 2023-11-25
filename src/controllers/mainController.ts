import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

import Database from "tauri-plugin-sql-api";


import { Table, Word, Language, Type } from "../app-types";



export class AppController implements ReactiveController{
    
    private host: ReactiveControllerHost;
    private db!:Database;

    constructor(host: ReactiveControllerHost & LitElement) {
        this.host = host;
        
        host.addController(this);
        
    }

  
    hostConnected(): void {
        console.log("AppController connected");
        //this.connectDB();
        
    }
    hostDisconnected(): void {
        this.db.close();
    }

    async connectDB() {
        console.log("connectDB");
        //C:\Data\projects\web\Tauri\Tauri-Lit-Test\src-tauri\data\words.db
        //this.db = await Database.load("sqlite:words.db");
        this.db = await Database.load("sqlite:C:\\Data\\projects\\web\\Tauri\\Tauri-Lit-Test\\src-tauri\\data\\words.db");
    }

    async selectAll<T>(table:string): Promise<Array<T>> {
        const q = "SELECT * FROM " + table;
        let result = await this.db.select<Array<T>>(q);
        return result;
    }
    // async getTables(): Promise<Array<Table>> {
        
    //     const q1 = "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'";
    //     let result = await this.db.select<Array<Table>>(q1);
       
    //     return result;     
    // }

    // async getTypes(): Promise<Array<Type>> {
    //     const q = "select * FROM word_type";
    //     let result = await this.db.select<Array<Type>>(q);
       
    //     return result;
    // }
    // async getWords(): Promise<Array<Word>> {
    //     const q = "select * FROM word";
    //     let result = await this.db.select<Array<Word>>(q);
       
    //     return result;
    // }
    // async getLanguages(): Promise<Array<Language>> {
    //     const q = "select * FROM language";
    //     let result = await this.db.select<Array<Language>>(q);
       
    //     return result;
    // }
    async addWord(word:Word) {
        const q = "INSERT INTO word (word, language, type) VALUES ($1, $2, $3)";
        try {
            let result = await this.db.execute(q, [word.word, word.language, word.type]);
            return result;
        } catch(e) {
            throw(e);
        }
    }
    

    
    async addLanguage(item:Language) {
        const q = "INSERT INTO language (token, title, title_native) VALUES ($1, $2, $3)";
        try {
            let result = await this.db.execute(q, [item.token, item.title, item.title_native]);
            return result;
        } catch(e) {
            throw(e);
        }
    }
}