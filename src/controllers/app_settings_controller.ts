import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";
import { setDefaultAnimation } from "@shoelace-style/shoelace/dist/utilities/animation-registry.js";
import { SorterItem, Word } from "../app-types";
import { MainApp } from "../main";


export class AppSettingsController implements ReactiveController{
    
    private host: MainApp;

    private sort_tables:Array<string> = ["word_id", "word", "language", "type", "created_at"];
    private sorters:Array<SorterItem> = [{column: "word_id", reversed: false , type: "number"}];

    constructor(host: ReactiveControllerHost & MainApp) {
        this.host = host;
        this.host.addController(this);
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
    wordTableCompareFn = (a:Word, b: Word) => {
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
                    var exp:number = item.reversed ? b[item.column].getTime() - a[item.column].getTime() : a[item.column].getTime() - b[item.column].getTime();
                    result = result || exp;
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
       
    }
}