import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { DrawerItem, Language, Type, Word} from '../app-types';

import * as event_types from '../controllers/event_controller.js';

import { CLOSE_TIMEOUT_MS } from '../app-constants.js';
import compStyles from '../styles/default-component.styles.js';

import './word-form.js';
import { WordForm } from './word-form.js';
import { DeferredEvent } from '../events/app-events.js';
// import { DeferredEvent } from '../events/app-events.js';
// import { QueryResult } from 'tauri-plugin-sql-api';

@customElement('word-panel')
export class WordPanel extends LitElement implements DrawerItem {

    @property({type: Array})
    lang_list: Array<Language> = [];

    @property({type: Array})
    type_list: Array<Type> = [];

    @property({type: Object})
    word: Word = {
        word_id: 0,
        word: "",
        language: 0,
        type: ""
    };

    @property()
    mode: "Update" | "Add"  = "Add";

    @query("#word-form")
    wordForm!: WordForm;

    @query("#result-info")
    resultInfo!: HTMLElement;

    static styles = [
    
        compStyles,
        css`

        `
    ];

    async closeAction():Promise<void> {
        // var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        // form.reset();
        this.wordForm.reset();
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        return undefined;
    }
    
    cancelUpdate() {
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        form.reset();

        this.dispatchEvent(new Event(event_types.CANCEL_UPDATE, {bubbles:true, composed: true}));
    }

    onWordSubmit(_ev:Event) {
        const ev:CustomEvent = (_ev as CustomEvent);
       
        this.resultInfo.innerHTML = "";

        let type;
        let result_msg: String;
        if(this.mode === "Add") {
            type = event_types.ADD_WORD;
            result_msg = " added.";
        }
        else {
            type = event_types.UPDATE_WORD;
            result_msg = " updated.";
        }

        const addEvent:DeferredEvent<string> = new DeferredEvent<string>(type, { word: ev.detail});

        const p = addEvent.promise;
        p.then((value) => {
            console.log("Promise resolved:",value);
            
            this.resultInfo.className = "success";
            this.resultInfo.innerHTML = ev.detail.word + result_msg;
            //this.wordForm.loadingState = false;
            setTimeout(() => {
               this.closeAction();
               if(this.mode === "Update") {
                    this.wordForm.loadingState = false;
                    this.dispatchEvent(new Event(event_types.CLOSE_WORD_DIALOG, {bubbles:true, composed: true}));
               } else {
                    this.wordForm.loadingState = false;
               }
            }, CLOSE_TIMEOUT_MS);
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            this.wordForm.loadingState = false;
            this.resultInfo.className = "error";
            this.resultInfo.innerHTML = "Error: "+e;
        }).finally(() => {
            //this.wordForm.loadingState = false;
        });

        this.dispatchEvent(addEvent);
    }
    
    onWordCancel() {
        this.wordForm.reset();
        this.dispatchEvent(new Event(event_types.CANCEL_UPDATE, {bubbles:true, composed: true}));
    }
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    }

    render() {
        return html`
            <word-form id="word-form" .lang_list=${this.lang_list} .type_list=${this.type_list} submitlabel=${this.mode} 
                .cancellable=${this.mode === "Update" || false}
                @on-word-submit=${this.onWordSubmit} @on-word-cancel=${this.onWordCancel}
                .word=${this.word}
                >
            </word-form>
            <div id="result-info"></div>
            
        `;
    }
}