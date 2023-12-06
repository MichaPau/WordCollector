import { ReactiveController, ReactiveControllerHost } from "lit";
import { MainApp } from "../main";
import { Language, Word } from "../app-types";
import { QueryResult } from "tauri-plugin-sql-api";
import { DeferredEvent } from "../events/app-events";

export const testEvent = "TEST_EVENT";

export const SELECT_ALL = "SELECT_ALL";

export const ADD_LANGUAGE = "ADD_LANGUAGE";
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";
export const DELETE_LANGUAGE = "DELETE_LANGUAGE ";

export const ADD_WORD = "ADD_WORD";
export const UPDATE_WORD = "UPDATE_WORD";
export const DELETE_WORD = "DELETE_WORD";

export const ADD_DEFINITION = "ADD_DEFINITION";
export const DELETE_DEFINITION = "DELETE_DEFINITION";

export const CANCEL_UPDATE = "CANCEL_UPDATE";
export const CLOSE_WORD_DIALOG = "CLOSE_WORD_DIALOG";

export const SEARCH_WORDS = "SEARCH_WORDS";
export const RESET_SEARCH_WORDS = "RESET_SEARCH_WORDS";

export class AppEventController implements ReactiveController {
    private host: MainApp;
   


    constructor(host: ReactiveControllerHost & MainApp) {
        this.host = host;
        host.addController(this);
    }

  
    hostConnected(): void {
        this.host.addEventListener(testEvent, this.onTestEvent);
        
        this.host.addEventListener(SELECT_ALL, this.onSelectAll);

        this.host.addEventListener(SEARCH_WORDS, this.onSearchWords);
        this.host.addEventListener(RESET_SEARCH_WORDS, this.onResetSearchWords);

        this.host.addEventListener(ADD_LANGUAGE, this.onAddLanguage);
        this.host.addEventListener(UPDATE_LANGUAGE, this.onUpdateLanguage);
        this.host.addEventListener(DELETE_LANGUAGE, this.onDeleteLanguage);

        this.host.addEventListener(ADD_DEFINITION, this.onAddDefinition);
        this.host.addEventListener(DELETE_DEFINITION, this.onDeleteDefinition);

        this.host.addEventListener(ADD_WORD, this.onAddWord);
        this.host.addEventListener(UPDATE_WORD, this.onUpdateWord);
        this.host.addEventListener(DELETE_WORD, this.onDeleteWord);
    }
    hostDisconnected(): void {
        this.host.removeEventListener(testEvent, this.onTestEvent);
        
        this.host.removeEventListener(SELECT_ALL, this.onSelectAll);

        this.host.removeEventListener(SEARCH_WORDS, this.onSearchWords);
        this.host.removeEventListener(RESET_SEARCH_WORDS, this.onResetSearchWords);

        this.host.removeEventListener(ADD_WORD, this.onAddWord);
        this.host.removeEventListener(UPDATE_WORD, this.onUpdateWord);
        this.host.removeEventListener(DELETE_WORD, this.onDeleteWord);

        this.host.removeEventListener(ADD_DEFINITION, this.onAddDefinition);
        this.host.removeEventListener(DELETE_DEFINITION, this.onDeleteDefinition);

        this.host.removeEventListener(ADD_LANGUAGE, this.onAddLanguage);
        this.host.removeEventListener(UPDATE_LANGUAGE, this.onUpdateLanguage);
        this.host.removeEventListener(DELETE_LANGUAGE, this.onDeleteLanguage);
    }

    onTestEvent = (e:Event) => {
        console.log("from eventController:",this);
        const ev:DeferredEvent<number> = e as DeferredEvent<number>;
        this.host.testState++;
        if(ev.detail < 0.5)
            ev.resolve(this.host.testState);
        else
            ev.reject("no");
    }

    onSearchWords = async (ev:Event) => {
        let value = (ev as CustomEvent).detail;
        var list = await this.host.dbCtr.searchForWords(value);
        this.host.word_list = list;
    }
    onResetSearchWords = async() => {
        this.host.word_list = await this.host.dbCtr.selectAllWords();
    }

    onSelectAll = async (ev:Event) => {
        let table = (ev as CustomEvent).detail.table;
        let value = (ev as CustomEvent).detail.value;
        await this.host.dbCtr.selectAll(table, "for_word_id", value)
        .then((result) => {
            let resolve =  (ev as CustomEvent).detail.resolve;
            resolve(result);
        })
        .catch((e) => {
            let reject =  (ev as CustomEvent).detail.reject;
            reject(e);
        });
    }
    onAddWord = async (ev:Event) => {
        await this.wordActionWithPromise(this.host.dbCtr.addWord, ev)
            .then(() => { console.log("onAddWord finished")})
            .catch((e:unknown) => console.log("onAddWordError:",e));
    };
    onUpdateWord = async (ev:Event) => {
        await this.wordActionWithPromise(this.host.dbCtr.updateWord, ev)
            .then(() => { console.log("onUpdateWord finished")})
            .catch((e:unknown) => console.log("onUpdateWordError:",e));
    };
    onDeleteWord = async (ev:Event) => {
        await this.wordActionWithPromise(this.host.dbCtr.deleteWord, ev)
            .then(() => { console.log("onDeleteWord finished")})
            .catch((e:unknown) => console.log("onDeleteWordError:",e));
    };

    onAddDefinition = async (ev:Event) => {

    }

    onDeleteDefinition = async (ev:Event) => {
        
    }
    onAddLanguage = async(ev:Event) => {
        await this.languageActionWithPromise(this.host.dbCtr.addLanguage, ev)
            .then(() => { console.log("onAddLanguage finished")})
            .catch((e:unknown) => console.log("onAddLanguageError:",e));
    }
    onUpdateLanguage = async(ev:Event) => {
        await this.languageActionWithPromise(this.host.dbCtr.updateLanguage, ev)
            .then(() => { console.log("onUpdateLanguage finished")})
            .catch((e:unknown) => console.log("onUpdateLanguageError:",e));
    }
    onDeleteLanguage = async(ev:Event) => {
        await this.languageActionWithPromise(this.host.dbCtr.deleteLanguage, ev)
            .then(() => { console.log("onDeleteLanguage finished")})
            .catch((e:unknown) => console.log("onDeleteLanguageError:",e));
    }

    async languageActionWithPromise(f:Function, ev:Event) {
        
        var l:Language = (ev as CustomEvent).detail.item;
        await f.call(this.host.dbCtr, l).then((result:QueryResult) => {
            let resolve =  (ev as CustomEvent).detail.resolve;
            resolve(result);
            (async () => {
                this.host.lang_list = await this.host.dbCtr.selectAll('language');
            })();
        })
        .catch((e:unknown) => {
            let reject =  (ev as CustomEvent).detail.reject;
            reject(e);
        });
    }

    async wordActionWithPromise(f:Function, ev:Event) {
        
        var w:Word = (ev as CustomEvent).detail.item;
        await f.call(this.host.dbCtr, w).then((result:QueryResult) => {
            let resolve =  (ev as CustomEvent).detail.resolve;
            resolve(result);
            (async () => {
                this.host.word_list = await this.host.dbCtr.selectAllWords();
            })();
        })
        .catch((e:unknown) => {
            let reject =  (ev as CustomEvent).detail.reject;
            reject(e);
        });
    }
    // onAddLanguage = async (ev:Event) => {

    //     var l:Language = (ev as CustomEvent).detail.lang;
    //     await this.host.dbCtr.addLanguage(l).then((result) => {
    //         let resolve =  (ev as CustomEvent).detail.resolve;
    //         resolve("success");
    //         (async () => {
    //             this.host.lang_list = await this.host.dbCtr.selectAll('language');
    //         })();
    //     })
    //     .catch((e) => {
    //         let reject =  (ev as CustomEvent).detail.reject;
    //         reject(e);
    //     });
    // }
    // onUpdateLanguage = async (ev:Event) => {
    //     var l:Language = (ev as CustomEvent).detail.lang;
    //     await this.host.dbCtr.updateLanguage(l).then((result) => {
    //         let resolve =  (ev as CustomEvent).detail.resolve;
    //         resolve("success");
    //         (async () => {
    //             this.host.lang_list = await this.host.dbCtr.selectAll('language');
    //         })();
    //     })
    //     .catch((e) => {
    //         let reject =  (ev as CustomEvent).detail.reject;
    //         reject(e);
    //     });
    // }
    // onDeleteLanguage = async (ev:Event) => {
    //     var l:Language = (ev as CustomEvent).detail.lang;
    //     await this.host.dbCtr.deleteLanguage(l).then((result) => {
    //         let resolve =  (ev as CustomEvent).detail.resolve;
    //         resolve("success");
    //         (async () => {
    //             this.host.lang_list = await this.host.dbCtr.selectAll('language');
    //         })();
    //     })
    //     .catch((e) => {
    //         let reject =  (ev as CustomEvent).detail.reject;
    //         reject(e);
    //     });
    // }

}