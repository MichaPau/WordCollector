import { LitElement, html, css, PropertyValueMap, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { DrawerItem, Language, Type, Word, deferred, DBEventOptionsItem } from '../app-types';

import * as event_types from '../controllers/event_controller.js';

import { CLOSE_TIMEOUT_MS } from '../app-constants.js';
import compStyles from '../styles/default-component.styles.js';

import './word-form.js';
import { WordForm } from './word-form.js';
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

        /* .error {
            color: var(--error-color);
        }

        .success {
            color: var(--success-color);
        } */
       
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
    // private addWord = (ev:Event) => {
    //     ev.preventDefault();
        
    //     var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
    //     var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
    //     result.innerHTML = "";
        
    //     const formData = new FormData(form!);
    //     const formObj = Object.fromEntries(formData.entries());
    //     var word:Word = {
    //         "word": formObj["word-input"] as string, 
    //         "language": parseInt(formObj["word-lang"] as string),
    //         "type": formObj["word-type"] as string
    //     };
        
    //     let result_msg = "";
    //     if(this.mode === 'Add') {
    //         result_msg = " added.";
    //     } else {
    //         result_msg = " updated.";
    //         word.word_id = parseInt(formObj.id as string); 
    //     }

    //     this.word = word;
       
    //     const {promise, resolve, reject} = deferred<string>();
    //     promise
    //     .then((value) => {
    //         console.log("Promise resolved:",value);
            
    //         result.className = "success";
    //         result.innerHTML = word.word + result_msg;
    //         setTimeout(() => {
    //            this.closeAction();
    //            if(this.mode === "Update") {
    //                 this.dispatchEvent(new Event(event_types.CLOSE_WORD_DIALOG, {bubbles:true, composed: true}));
    //            } else {
    //                 form.reset();
    //            }
    //         }, CLOSE_TIMEOUT_MS);
    //     })
    //     .catch((e) => { 
    //         console.log("Promise rejected:", e);
    //         result.className = "error";
    //         result.innerHTML = "Error: "+e;
    //     });
    
    //     const options:DBEventOptionsItem = {
    //         detail: {"resolve": resolve, "reject": reject, "item": word},
    //         bubbles: true,
    //         composed: true
    //     };
    
    //     if(this.mode === "Add") 
    //         this.dispatchEvent(new CustomEvent(event_types.ADD_WORD, options));
    //     else
    //         this.dispatchEvent(new CustomEvent(event_types.UPDATE_WORD, options));
    // }
    
    cancelUpdate() {
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        form.reset();

        this.dispatchEvent(new Event(event_types.CANCEL_UPDATE, {bubbles:true, composed: true}));
    }

    onWordSubmit(_ev:Event) {
        console.log('onTestWordSubmit');
        const ev:CustomEvent = (_ev as CustomEvent);
        this.resultInfo.innerHTML = "";

        let result_msg = "";
        if(this.mode === 'Add') {
            result_msg = " added.";
        } else {
            result_msg = " updated.";
        }

        const {promise, resolve, reject} = deferred<string>();
        promise
        .then((value) => {
            console.log("Promise resolved:",value);
            
            this.resultInfo.className = "success";
            this.resultInfo.innerHTML = ev.detail.word + result_msg;
            setTimeout(() => {
               this.closeAction();
               if(this.mode === "Update") {
                    this.dispatchEvent(new Event(event_types.CLOSE_WORD_DIALOG, {bubbles:true, composed: true}));
               } else {
                    //form.reset();
               }
            }, CLOSE_TIMEOUT_MS);
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            this.resultInfo.className = "error";
            this.resultInfo.innerHTML = "Error: "+e;
        });

        const options:DBEventOptionsItem = {
            detail: {"resolve": resolve, "reject": reject, "item": ev.detail},
            bubbles: true,
            composed: true
        };
    
        if(this.mode === "Add") 
            this.dispatchEvent(new CustomEvent(event_types.ADD_WORD, options));
        else
            this.dispatchEvent(new CustomEvent(event_types.UPDATE_WORD, options));
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
            <!-- <form id="word-form" >
                <label class="invisible">Add a new word:</label>
                <sl-input id="word_id" name="id" label="ID:" class="short hidden" value=${this.word!.word_id!.toString()} readonly></sl-input>
                <sl-input name="word-input" label="Word:" required spellcheck="false" value=${this.word!.word}></sl-input>
                <div class="horizontal">
                    <sl-select name="word-lang" label="Language" value=${this.word!.language} required hoist>
                        ${this.lang_list.map((lang) => html`
                            <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                        `)}
                    </sl-select>
                    <sl-select name="word-type" label="Type" value=${this.word!.type} required hoist>
                        ${this.type_list.map((type) => html`
                            <sl-option value="${type.title!}">${type.title}</sl-option>
                        `)}
                    </sl-select>
                </div>
               
                <div class="button-bar">
                    ${this.mode === "Update" ? html`<sl-button @click="${this.cancelUpdate}" variant="default">Cancel</sl-button>` : nothing}
                    <sl-button type="submit" variant="primary" class="submit-button">${this.mode}</sl-button>
                </div>
                <div id="result-info"></div>
            </form> -->
        `;
    }
}