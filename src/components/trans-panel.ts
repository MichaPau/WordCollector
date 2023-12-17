import { LitElement, html, css, PropertyValueMap, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

import { SlInput, SlMenu, SlMenuItem, SlDetails } from '@shoelace-style/shoelace';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { Language, Type, Word } from '../app-types.js';
import { DeferredEvent } from '../events/app-events.js';

import './word-panel.js';
import './word-form.js';
import { WordForm } from './word-form.js';
import { CLOSE_TIMEOUT_MS } from '../app-constants.js';



@customElement('translation-panel')
export class TranslationPanel extends LitElement {

    static styles = [
      compStyles,  
      css`
        #lookup-container {
            display: flex;
            justify-content: left;
            gap: var(--main-padding);
           
            //width: 100%;
            //border: 1px solid black;
        }

         
        sl-details::part(content) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /* width: 61.4%; */
            //gap: var(--main-padding);

            
        }
        .details-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            /* width: 61.4%; */
            gap: var(--main-padding);
            width: 61.4%;
            //border: 1px solid black;
        }
        @media (max-width: 900px) {
            .details-container {
                width: 100%;
            }
        }
        #lookup-result-container {
            display: flex;
            flex-direction: column;
            gap: var(--main-padding);
           
            //border: 1px solid black;
        }

        #lookup-selected {
            display: flex;
            align-items: center;
            //width: 61.4%;
            //justify-content: space-between;
            gap: var(--main-padding);

            & .word-info {
                flex: 0 0 61.4%;
                font-weight: var(--sl-font-weight-bold);
            }
            & .spacer {
                flex-grow: 1;
            }
            & sl-button {
                flex: 0 0 auto;
            }
        }
        .search-input {
            flex: 1 0 61.4%;
        }

        .hide-menu-border {
            border: none;
        }
        .show-menu-border {
            border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
        }
      `
    ];
    
    @query("#lookup-result-container")
    lookupResultContainer!:HTMLElement;

    // @query("#lookup-selected")
    // lookupSelected!:HTMLElement;

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

    @state()
    selectedWord?:Word;

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
       
        const container = this.shadowRoot!.querySelector('#details-group-container')!;

        // Close all other details when one is shown
        container.addEventListener('sl-show', event => {
            if ((event.target as SlDetails)!.localName === 'sl-details') {
            [...container.querySelectorAll('sl-details')].map(details => (details.open = event.target === details));
            }
        });
    }
    
    onSearchInput() {
        console.log("onSearchINput");
        let value = this.searchInput?.value;

        this.selectedWord = undefined;
        this.lookupMenu!.replaceChildren();

        if(value && value.length > 1) {

            let searchEv:DeferredEvent<Array<Word>> = new DeferredEvent(event_types.SEARCH_WORDS_FOR_TRANSLATION, {input: value, lang_id: this.transLang!.value});

            const resultP = searchEv.promise;

            resultP.then((result) => {
                this.lookupMenu.classList.replace('hide-menu-border', 'show-menu-border');
                result.map((word) => {
                    //console.log(word);
                    const elem:SlMenuItem = document.createElement('sl-menu-item');
                    //elem.value = word.word_id!.toString();
                    elem.value = JSON.stringify(word);

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
    onSearchSelect(ev:CustomEvent) {
        const item = ev.detail.item;
        //console.log("Selected:", item.value);
        this.lookupMenu!.replaceChildren();
        this.lookupMenu.classList.replace('show-menu-border', 'hide-menu-border');
        this.selectedWord = JSON.parse(item.value);
    }
    onWordSubmit(_ev:Event) {
        const ev:CustomEvent = (_ev as CustomEvent);
        this.resultInfo.innerHTML = "";

        this.submitTranslation(ev.detail as Word, event_types.ADD_WORD_AND_TRANSLATION);
        
    }

    submitTranslation(word:Word, type:string) {

        const addEvent:DeferredEvent<string> = new DeferredEvent<string>(type, 
            {
                for_word_id: this.word!.word_id,
                word: word
            }
        );

        const p = addEvent.promise;
        p.then((result) => {
            console.log(result);
            this.resultInfo.className = "success";
            this.resultInfo.innerHTML = result;
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('app-request-word-data', {bubbles: true, composed: true}));
             }, CLOSE_TIMEOUT_MS);
            
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
    onAddSelectedTranslation() {
        if(this.selectedWord) {
            this.submitTranslation(this.selectedWord, event_types.ADD_TRANSLATION);
        }
    }

    render() {
        return html`
            <div id="details-group-container">
                <sl-details id="lookup-pane" summary="Look up word." open>
                    <div class="details-container">
                    <div id="lookup-container">
                        <sl-input id="search-input" class="search-input" label="Search word" clearable @sl-input=${this.onSearchInput}></sl-input>
                        
                        <sl-select id="trans-lang" name="trans-lang" label="Language" required hoist @sl-change=${this.onSearchInput}>
                            ${this.lang_list.map((lang) => html`
                                <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                            `)}
                        </sl-select>
                    </div>
                
                    ${this.selectedWord ? 
                        html `
                            <div id="lookup-selected">
                                <div class="word-info">${this.selectedWord.word} - ${this.selectedWord.language_title} - ${this.selectedWord.type}</div>
                                <div class="spacer"></div>
                                <sl-button @click=${() => {
                                    this.selectedWord = undefined;
                                    this.lookupMenu!.replaceChildren();
                                }}>Cancel</sl-button>
                                <sl-button variant="primary" @click=${this.onAddSelectedTranslation}>Add</sl-button>
                            </div>
                        ` : nothing}
                
                    <div id="lookup-result-container">
                        <sl-menu class="hide-menu-border" id="lookup-menu" @sl-select=${this.onSearchSelect}></sl-menu>
                    </div>
                </div>
                </sl-details>
                <sl-details summary="Create new word.">
                    <div class="details-container">
                    <word-form id="word-form" .lang_list=${this.lang_list} .type_list=${this.type_list}
                        submitLabel="New Word" cancellable
                        @on-word-submit=${this.onWordSubmit} @on-word-cancel=${this.onWordCancel}
                    ></word-form>
                    </div>
                </sl-details>
                <div id="result-info"></div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "translation-panel": TranslationPanel,
    }
  }