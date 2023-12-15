import { appWindow } from "@tauri-apps/api/window";
import { confirm } from '@tauri-apps/api/dialog';

import { ReactiveController, ReactiveControllerHost } from "lit";
import { setDefaultAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry.js";
import { SorterItem, WordIndexable } from "../app-types";
import { MainApp } from "../main";
import { UnlistenFn } from "@tauri-apps/api/event";



export class AppSettingsController implements ReactiveController{
    
    private host: MainApp;

    private appCloseRequest?:UnlistenFn;
    //private sort_tables:Array<string> = ["word_id", "word", "language", "type", "created_at"];

    private sorters:Array<SorterItem> = [{column: "word_id", reversed: false , type: "number"}];

    constructor(host: ReactiveControllerHost & MainApp) {
        this.host = host;
        this.host.addController(this);
        this.init()
       
    }

    async init() {
        this.appCloseRequest = await appWindow.onCloseRequested(async (ev) => {
            console.log("app close requested");
            // const confirmed = await confirm('Are you sure?');
            // if (!confirmed) {
            //     // user did not confirm closing the window; let's prevent it
            //     ev.preventDefault();
            // }
        });
    }
    updateSort(sortItem: SorterItem) {
        
        const i = this.sorters.findIndex(item => item.column === sortItem.column);
        if(i > -1) {
            this.sorters.splice(i, 1);
        }
        this.sorters.unshift(sortItem);
        this.sortWords();
        
        //this.host.requestUpdate();

    }

    sortWords() {
        this.host.word_list = [...this.host.word_list.sort(this.wordTableCompareFn)];
    }
    wordTableCompareFn = (a:WordIndexable, b: WordIndexable) => {
        let result = 0;
        this.sorters.map((item) => {
            switch (item.type) {
                case "number":
                    var exp:number = item.reversed ? b[item.column] - a[item.column] : a[item.column] - b[item.column];
                    result = result || exp;
                    break;
                case "string":
                    var exp:number = item.reversed ? b[item.column].localeCompare(a[item.column]) : a[item.column].localeCompare(b[item.column]);
                    result = result || exp;
                    break;
                case "date":
                    console.log(typeof a[item.column]);
                    //var exp:number = item.reversed ? (b[item.column] as Date).getTime() - (a[item.column] as Date).getTime() : (a[item.column] as Date).getTime() - (b[item.column] as Date).getTime();
                    //result = result || exp;
                    break;
            }
            
        })
        return result;
    }

    hostConnected(): void {
        setDefaultAnimation('details.show', {
            keyframes: [
                {height: 0},
                {height: 'auto'},
            ],
            options: {duration: 250, easing: 'ease'}
        });
        setDefaultAnimation('details.hide', {
            keyframes: [
                {height: 'auto'},
                {height: 0},
            ],
            options: {duration: 250, easing: 'ease'}
        });
    }
    hostDisconnected(): void {
        if(this.appCloseRequest)
            this.appCloseRequest();
    }
}