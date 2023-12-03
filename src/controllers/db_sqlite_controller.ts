import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

import Database from "tauri-plugin-sql-api";


import { Word, Language } from "../app-types";



export class DBSQLiteController implements ReactiveController{
    
    private host: ReactiveControllerHost;
    private db!:Database;

    constructor(host: ReactiveControllerHost & LitElement) {
        this.host = host;
        this.host.addController(this);
    }

    hostConnected(): void {
        console.log("AppController connected");
        //this.connectDB();
        
    }
    hostDisconnected(): void {
        if(this.db)
            this.db.close();
    }

    async connectDB() {
        console.log("connectDB");
        //C:\Data\projects\web\Tauri\Tauri-Lit-Test\src-tauri\data\words.db
        //this.db = await Database.load("sqlite:words.db");
        this.db = await Database.load("sqlite:C:\\Data\\projects\\web\\Tauri\\WordCollector\\src-tauri\\data\\words.db");
    }

    async selectAll<T>(table:string): Promise<Array<T>> {
        const q = "SELECT * FROM " + table;
        let result = await this.db.select<Array<T>>(q);
        return result;
    }
    
    async selectAllWords<T>(): Promise<Array<T>> {
        const q = "SELECT w.*, l.title as language_title FROM word w INNER JOIN language l ON l.lang_id = w.language";
        let result = await this.db.select<Array<T>>(q);
        return result;
    }
    async checkQuery<T>(q:string, values:Array<string | number>):Promise<T> {
        let result = await this.db.select(q, values);
        return result as T;
    }

    async addWord(word:Word) {
        const checkQuery = "SELECT COUNT(*) as count FROM word WHERE word = $1 AND language = $2 AND type = $3";

        //let check:Array<unknown> = await this.checkDuplicate(checkQuery, [word.word, word.language, word.type]);
        let check:Array<{count: number}> = await this.checkQuery(checkQuery, [word.word, word.language, word.type]);
        console.log("Found: ", check[0].count);

        if(check[0].count > 0) {
            throw new Error("Exact duplicate is already in the database.");
        } else {
            const q = "INSERT INTO word (word, language, type) VALUES ($1, $2, $3)";
            try {
                let result = await this.db.execute(q, [word.word, word.language, word.type]);
                return result;
            } catch(e) {
                throw(e);
            }
        }
    }
    
    async updateWord(item:Word) {
        const q = "UPDATE word SET word = $1, language = $2, type = $3 WHERE word_id = $4";

        try {
            let result = await this.db.execute(q, [item.word, item.language, item.type, item.word_id]);
            console.log("Update word result:", result);
            return result;
        } catch (e) {
            throw(e);
        }
    }

    async deleteWord(item:Word) {
        //delete in translations, definitions, collections etc.
        const q = "DELETE FROM word WHERE word_id = $1";
        try {
            let result = await this.db.execute(q, [item.word_id]);
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

    async deleteLanguage(item:Language) {
        const checkQuery = "SELECT COUNT(*) as count FROM word WHERE language = $1";
        let check:Array<{count: number}> = await this.checkQuery(checkQuery, [item.lang_id!]);

        if(check[0].count > 0) {
            throw new Error(`Can't delete ${item.title} reason: used by words`);
        } else {
            const q = "DELETE FROM language WHERE lang_id = $1";
            try {
                let result = await this.db.execute(q, [item.lang_id]);
                return result;
            } catch(e) {
                throw(e);
            }
        }
    }

    async updateLanguage(item:Language) {
        const q = "UPDATE language SET token = $1,  title = $2, title_native = $3 WHERE lang_id = $4";

        try {
            let result = await this.db.execute(q, [item.token, item.title, item.title_native, item.lang_id]);
            console.log(result);
            return result;
        } catch (e) {
            throw(e);
        }
    }
}