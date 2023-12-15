import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// import '@shoelace-style/shoelace/dist/components/details/details.js';
// import '@shoelace-style/shoelace/dist/components/input/input.js';

import { SlInput, SlMenu, SlMenuItem, SlDetails } from '@shoelace-style/shoelace';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { Language, Type, Word } from '../app-types.js';
import { DeferredEvent } from '../events/app-events.js';

import './word-panel.js';
import './word-form.js';
import { WordForm } from './word-form.js';



@customElement('translation-panel')
export class TranslationPanel extends LitElement {

    static styles = [
      compStyles,  
      css`
        #lookup-container {
            display: flex;
            justify-content: center;
            gap: var(--main-padding);
            width: 100%;
            border: 1px solid black;
        }

        #lookup-result-container {
            display: flex;
            flex-direction: column;
            gap: var(--main-padding);
            border: 1px solid black;
        }

        .search-input {
            flex: 1 1 70%;
        }
      `
    ];
    
    @query("#lookup-result-container")
    lookupResultContainer!:HTMLElement;

    @query("#search-input")
    searchInput!:SlInput;

    @query("#lookup-menu")
    lookupMenu!:SlMenu;

    @query("#trans-lang")
    transLang!:SlInput;

    @query("#word-form")
    wordForm!:WordForm;

    @query("#result-info")
    resultInfo!:HTMLElement;

    @property({type: Object})
    word?: Word;

    @property({type: Array})
    lang_list: Array<Language> = [];

    @property({type: Array})
    type_list: Array<Type> = [];

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
       
        const container = this.shadowRoot!.querySelector('#details-group-container')!;

        // Close all other details when one is shown
        container.addEventListener('sl-show', event => {
            if ((event.target as SlDetails)!.localName === 'sl-details') {
            [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
            }
        });

        // var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        // form.addEventListener("submit", this.addWord);
        //this.addEventListener(event_types.)
    }
    private addWord = (ev:Event) => {
        ev.preventDefault();
        
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        
        const formData = new FormData(form!);
        const formObj = Object.fromEntries(formData.entries());
        var word:Word = {
            "word": formObj["word-input"] as string, 
            "language": parseInt(formObj["word-lang"] as string),
            "type": formObj["word-type"] as string
        };

        const addEvent:DeferredEvent<string> = new DeferredEvent<string>(event_types.ADD_WORD_AND_TRANSLATION, 
            {
                for_word_id: this.word!.word_id,
                word: word
            }
        );

        const p = addEvent.promise;
        p.then(() => {
            this.dispatchEvent(new CustomEvent('app-request-word-data', {bubbles: true, composed: true}));
        }).catch((e) => {
            console.log("Promise rejected:", e);
            result.className = "error";
            result.innerHTML = "Error: "+e;
        });

        this.dispatchEvent(addEvent);


    }
    onSearchInput() {
        console.log("onSearchINput");
        let value = this.searchInput?.value;

        this.lookupMenu!.replaceChildren();

        if(value && value.length > 1) {

            let searchEv:DeferredEvent<Array<Word>> = new DeferredEvent(event_types.SEARCH_WORDS_FOR_TRANSLATION, {input: value, lang_id: this.transLang!.value});

            const resultP = searchEv.promise;

            resultP.then((result) => {
                result.map((word) => {
                    const elem:SlMenuItem = document.createElement('sl-menu-item');
                    elem.value = word.word_id!.toString();

                    //const elem:SlMenuItem = new SlMenuItem();
                    elem.innerText = word.word + " - " + word.type + " - " + word.language_title;
                    //console.log(this.lookupMenu);
                    //console.log(elem);
                    this.lookupMenu!.appendChild(elem);
                });
            }).catch((e) => console.log(e));

            this.dispatchEvent(searchEv);
            //this.dispatchEvent(new CustomEvent(event_types.SEARCH_WORDS, {bubbles: true, composed: true, detail: value}));
        }
    }
    onWordSubmit(_ev:Event) {
        const ev:CustomEvent = (_ev as CustomEvent);
        this.resultInfo.innerHTML = "";

        const addEvent:DeferredEvent<string> = new DeferredEvent<string>(event_types.ADD_WORD_AND_TRANSLATION, 
            {
                for_word_id: this.word!.word_id,
                word: ev.detail as Word
            }
        );

        const p = addEvent.promise;
        p.then(() => {
            this.dispatchEvent(new CustomEvent('app-request-word-data', {bubbles: true, composed: true}));
        }).catch((e) => {
            console.log("Promise rejected:", e);
            this.resultInfo.className = "error";
            this.resultInfo.innerHTML = "Error: "+e;
        });

        this.dispatchEvent(addEvent);
    }
    onWordCancel() {
        this.wordForm.reset();
    }
    render() {
        return html`
            <div id="details-group-container">
                <sl-details summary="Look up word." open>
                    <div id="lookup-container">
                        <sl-input id="search-input" class="search-input" label="Search word" clearable @sl-input=${this.onSearchInput}></sl-input>
                        <sl-select id="trans-lang" name="trans-lang" label="Language" required hoist @sl-change=${this.onSearchInput}>
                            ${this.lang_list.map((lang) => html`
                                <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                            `)}
                        </sl-select>
                    </div>
                <div id="lookup-result-container">
                        <sl-menu id="lookup-menu"></sl-menu>
                </div>
                </sl-details>
                <sl-details summary="Create new word.">
                    <!-- <form id="word-form" >
                        <sl-input name="word-input" label="Word:" required spellcheck="false"></sl-input>
                        <div class="horizontal">
                            <sl-select name="word-lang" label="Language"  required hoist>
                                ${this.lang_list.map((lang) => html`
                                    <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                                `)}
                            </sl-select>
                            <sl-select name="word-type" label="Type"  required hoist>
                                ${this.type_list.map((type) => html`
                                    <sl-option value="${type.title!}">${type.title}</sl-option>
                                `)}
                            </sl-select>
                        </div>
                        <div class="button-bar">
                            <sl-button type="submit" variant="primary" class="submit-button">Add Translation</sl-button>
                        </div>
                    </form> -->
                    <word-form id="word-form" .lang_list=${this.lang_list} .type_list=${this.type_list}
                        submitLabel="New Word" cancellable
                        @on-word-submit=${this.onWordSubmit} @on-word-cancel=${this.onWordCancel}
                    ></word-form>
                    <div id="result-info"></div>
                </sl-details>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "translation-panel": TranslationPanel,
    }
  }