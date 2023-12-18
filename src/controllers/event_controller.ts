import { ReactiveController, ReactiveControllerHost } from "lit";
import { MainApp } from "../main";
import { Language, Word } from "../app-types";
import { QueryResult } from "tauri-plugin-sql-api";
import { DeferredEvent } from "../events/app-events";



// DB Events
export const SELECT_ALL = "SELECT_ALL";

export const ADD_LANGUAGE = "ADD_LANGUAGE";
export const UPDATE_LANGUAGE = "UPDATE_LANGUAGE";
export const DELETE_LANGUAGE = "DELETE_LANGUAGE ";

export const ADD_WORD = "ADD_WORD";
export const UPDATE_WORD = "UPDATE_WORD";
export const DELETE_WORD = "DELETE_WORD";
export const GET_WORD_DETAILS = "GET_WORD_DETAILS";

export const ADD_DEFINITION = "ADD_DEFINITION";
export const UPDATE_DEFINITION = "UPDATE_DEFINITION";
export const DELETE_DEFINITION = "DELETE_DEFINITION";

export const ADD_TRANSLATION = "ADD_TRANSLATION";
export const ADD_WORD_AND_TRANSLATION = "ADD_WORD_AND_TRANSLATION";
export const DELETE_TRANSLATION = "DELETE_TRANSLATION";

//APP flow events
export const testEvent = "TEST_EVENT";

export const OPEN_WORD_DRAWER = "OPEN_WORD_DRAWER";
export const OPEN_LANGUAGE_DRAWER = "OPEN_LANGUAGE_DRAWER";

export const CANCEL_UPDATE = "CANCEL_UPDATE";
export const CLOSE_WORD_DIALOG = "CLOSE_WORD_DIALOG";

export const SEARCH_WORDS = "SEARCH_WORDS";
export const SEARCH_WORDS_FOR_TRANSLATION = "SEARCH_WORDS_FOR_TRANSLATIONS";
export const RESET_SEARCH_WORDS = "RESET_SEARCH_WORDS";

export const SORT_TABLE= "SORT_TABLE";
export const SORT_ICON_ACTIVE = "SORT_ICON_ACTIVE";

// export const WORD_FORM_SUBMIT = "WORD_FORM_SUBMIT";
// export const WORD_FORM_CANCEL = "WORD_FORM_CANCEL";

export class AppEventController implements ReactiveController {
    private host: MainApp;
   

    constructor(host: ReactiveControllerHost & MainApp) {
        this.host = host;
        host.addController(this);
    }

  
    hostConnected(): void {
        this.host.addEventListener(testEvent, this.onTestEvent);

        this.host.addEventListener(SORT_TABLE, this.onSortTable);
        
        this.host.addEventListener(SELECT_ALL, this.onSelectAll);

        this.host.addEventListener(SEARCH_WORDS, this.onSearchWords);
        this.host.addEventListener(SEARCH_WORDS_FOR_TRANSLATION, this.onSearchWordsForTranslation);
        this.host.addEventListener(RESET_SEARCH_WORDS, this.onResetSearchWords);

        this.host.addEventListener(ADD_LANGUAGE, this.onAddLanguage);
        this.host.addEventListener(UPDATE_LANGUAGE, this.onUpdateLanguage);
        this.host.addEventListener(DELETE_LANGUAGE, this.onDeleteLanguage);
        this.host.addEventListener(GET_WORD_DETAILS, this.onGetWordDetails);

        this.host.addEventListener(ADD_DEFINITION, this.onAddDefinition);
        this.host.addEventListener(UPDATE_DEFINITION, this.onUpdateDefinition);
        this.host.addEventListener(DELETE_DEFINITION, this.onDeleteDefinition);

        this.host.addEventListener(ADD_TRANSLATION, this.onAddTranslation);
        this.host.addEventListener(ADD_WORD_AND_TRANSLATION, this.onAddWordAndTranslation);
        this.host.addEventListener(DELETE_TRANSLATION, this.onDeleteTranslation);

        this.host.addEventListener(ADD_WORD, this.onAddWord);
        this.host.addEventListener(UPDATE_WORD, this.onUpdateWord);
        this.host.addEventListener(DELETE_WORD, this.onDeleteWord);
    }
    hostDisconnected(): void {
        this.host.removeEventListener(testEvent, this.onTestEvent);
        
        this.host.removeEventListener(SORT_TABLE, this.onSortTable);

        this.host.removeEventListener(SELECT_ALL, this.onSelectAll);

        this.host.removeEventListener(SEARCH_WORDS, this.onSearchWords);
        this.host.removeEventListener(SEARCH_WORDS_FOR_TRANSLATION, this.onSearchWordsForTranslation);
        this.host.removeEventListener(RESET_SEARCH_WORDS, this.onResetSearchWords);

        this.host.removeEventListener(ADD_WORD, this.onAddWord);
        this.host.removeEventListener(UPDATE_WORD, this.onUpdateWord);
        this.host.removeEventListener(DELETE_WORD, this.onDeleteWord);
        this.host.removeEventListener(GET_WORD_DETAILS, this.onGetWordDetails);

        this.host.removeEventListener(ADD_DEFINITION, this.onAddDefinition);
        this.host.removeEventListener(UPDATE_DEFINITION, this.onUpdateDefinition);
        this.host.removeEventListener(DELETE_DEFINITION, this.onDeleteDefinition);

        this.host.removeEventListener(ADD_TRANSLATION, this.onAddTranslation);
        this.host.removeEventListener(ADD_WORD_AND_TRANSLATION, this.onAddWordAndTranslation);
        this.host.removeEventListener(DELETE_TRANSLATION, this.onDeleteTranslation);

        this.host.removeEventListener(ADD_LANGUAGE, this.onAddLanguage);
        this.host.removeEventListener(UPDATE_LANGUAGE, this.onUpdateLanguage);
        this.host.removeEventListener(DELETE_LANGUAGE, this.onDeleteLanguage);
    }

    timeout(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    onTestEvent = async (e:Event) => {
        
        const _ev:DeferredEvent<number> = e as DeferredEvent<number>;

        const values = ["test15", "test1"];
        const r1 = this.host.dbCtr.testAllSetteled(values[0]);
        const r2 = this.host.dbCtr.testAllSetteled(values[1]);
        //.then((r) => console.log(r)).catch((e) => console.log(e))
        const dbPromises = [r1, r2];


        let retMessage = "";

        const results = await Promise.allSettled(dbPromises);
        results.forEach((result) => {
            if(result.status === "fulfilled") {
                retMessage += result.value.toString() +"\n";
            } else {
                retMessage += result.reason + "\n";
            }
        
        });

        if (results.some(item => item.status === "fulfilled")) {
            _ev.resolve(1);
        } else {
            _ev.reject(retMessage);
        }
       

        // //test begin - commit - rollback transactions
        // let result:boolean = await this.host.dbCtr.testTableQuery(values);
        // if(result) {
        //     _ev.resolve(1);
        // } else {
        //     _ev.reject("no");
        // }
    }

    onSortTable = (ev:Event) => {
       this.host.settingsCtr.updateSort((ev as CustomEvent).detail); 
    }
    onSearchWords = async (ev:Event) => {
        let value = (ev as CustomEvent).detail;
        var list = await this.host.dbCtr.searchForWords(value);
        this.host.word_list = list;
    }
    onSearchWordsForTranslation = async (ev:Event) => {
        console.log("search deferred");
        const _ev:DeferredEvent<Array<Word>> = ev as DeferredEvent<Array<Word>>;
        await this.host.dbCtr.searchForWords(_ev.detail.input, _ev.detail.lang_id)
        .then((result) => {
            _ev.resolve(result);
        })
        .catch((e) => {
            _ev.reject(e);
        });
    }
    onResetSearchWords = async() => {
        this.reloadWordList();
    }

    async reloadWordList() {
        this.host.word_list = await this.host.dbCtr.selectAllWords();
        this.host.settingsCtr.sortWords();
    }
    onSelectAll = async (ev:Event) => {
        let table = (ev as CustomEvent).detail.table;
        let column = (ev as CustomEvent).detail.column;
        let value = (ev as CustomEvent).detail.value;
        await this.host.dbCtr.selectAll(table, column, value)
        .then((result) => {
            let resolve =  (ev as CustomEvent).detail.resolve;
            resolve(result);
        })
        .catch((e) => {
            let reject =  (ev as CustomEvent).detail.reject;
            reject(e);
        });
    }
    onGetWordDetails = async (ev:Event) => {
        const e:DeferredEvent<Word> = ev as DeferredEvent<Word>;

        const word_id = e.detail as number;
        await this.host.dbCtr.getWordDetails(word_id).then((result) => {
            e.resolve(result);
        }).catch((e) => {
            e.reject(e);
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
        
        const e:DeferredEvent<string> = ev as DeferredEvent<string>;
        await this.host.dbCtr.addDefinition(e.detail).then(() => {
            e.resolve("definition added");
        })
        .catch((e) => e.reject(e));
    }

    onUpdateDefinition = async (ev:Event) => {
        console.log("onUpdateDefinition");
        const e:DeferredEvent<string> = ev as DeferredEvent<string>;
        await this.host.dbCtr.updateDefinition(e.detail).then(() => {
            e.resolve("definition updated");
        })
        .catch((e) => e.reject(e));
    }
    onDeleteDefinition = async (ev:Event) => {
        console.log("onDeleteDefinition");
        const e:DeferredEvent<string> = ev as DeferredEvent<string>;
        await this.host.dbCtr.deleteDefinition(e.detail).then(() => {
            e.resolve("definition removed");
        })
        .catch((e) => e.reject(e));
    }

    onAddWordAndTranslation = async (ev:Event) => {
        const _ev:DeferredEvent<string> = (ev as DeferredEvent<string>);
        await this.host.dbCtr.addWord(_ev.detail.word).then(async (result) => {

            if(result.lastInsertId !== 0) {
                
                let result1 = this.host.dbCtr.addTranslation(_ev.detail.for_word_id, result.lastInsertId);
                let result2 = this.host.dbCtr.addTranslation(result.lastInsertId, _ev.detail.for_word_id)
                
                const resultAll = await Promise.allSettled([result1, result2]);
                let retMessage = "";
                resultAll.forEach((result) => {
                    if(result.status === "fulfilled") {
                        retMessage += result.value.toString() +"\n";
                    } else {
                        retMessage += result.reason + "\n";
                    }
                
                });
        
                if (resultAll.some(item => item.status === "fulfilled")) {
                    _ev.resolve(retMessage);
                    this.reloadWordList();
                } else {
                    _ev.reject(retMessage);
                }
            }
        }).catch((e) => {
            _ev.reject(e);
        });
       

    }
    onAddTranslation = async (ev:Event) => {
        console.log("onAddTransaltion");
        const _ev:DeferredEvent<string> = (ev as DeferredEvent<string>);

        let result1 = this.host.dbCtr.addTranslation(_ev.detail.for_word_id, _ev.detail.word.word_id);
        let result2 = this.host.dbCtr.addTranslation(_ev.detail.word.word_id, _ev.detail.for_word_id)
        
        const resultAll = await Promise.allSettled([result1, result2]);
        let retMessage = "";
        resultAll.forEach((result) => {
            if(result.status === "fulfilled") {
                retMessage += "Translation added." +"\n";
            } else {
                retMessage += result.reason + "\n";
            }
        
        });

        if (resultAll.some(item => item.status === "fulfilled")) {
            _ev.resolve(retMessage);
            //this.reloadWordList();
        } else {
            _ev.reject(retMessage);
        }
    }

    onDeleteTranslation = async (ev:Event) => {
        const _ev:DeferredEvent<string> = (ev as DeferredEvent<string>);
        //get inverseTranslation
        const inverseTransResult = await this.host.dbCtr.getInverseTranslation(_ev.detail.to_word_id, _ev.detail.for_word_id);
        
        let deletePromises = [this.host.dbCtr.deleteTranslation(_ev.detail.translation_id)];

        if(inverseTransResult.length > 0) {
            deletePromises.push( this.host.dbCtr.deleteTranslation(inverseTransResult[0]));
        }
        
        await Promise.all(deletePromises).then((results) => {
            let message = "Translation ";
            if(results.length > 1) message += "and it's inverse deleted";
            else message += "deleted. No inverse translation found."
            _ev.resolve(message);
        }).catch((e) => _ev.reject(e));
        // console.log(_ev.detail.translation_id);
        // console.log(r1, r1[0]);

    }
    onAddLanguage = async(ev:Event) => {
        await this.languageActionWithPromise(this.host.dbCtr.addLanguage, ev)
            .then(() => { console.log("onAddLanguage finished")})
            .catch((e:unknown) => console.log("onAddLanguageError:",e));
    }
    onUpdateLanguage = async(ev:Event) => {
        await this.languageActionWithPromise(this.host.dbCtr.updateLanguage, ev)
            .then(async () => { 
                console.log("onUpdateLanguage finished");
                //this.host.word_list = await this.host.dbCtr.selectAllWords();
                this.reloadWordList();

            })
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
        await f.call(this.host.dbCtr, w).then(async (result:QueryResult) => {
            let resolve =  (ev as CustomEvent).detail.resolve;
            await this.timeout(2000);
            resolve(result);
            (async () => {
                //this.host.word_list = await this.host.dbCtr.selectAllWords();
                this.reloadWordList();
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