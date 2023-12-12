import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// import '@shoelace-style/shoelace/dist/components/details/details.js';
// import '@shoelace-style/shoelace/dist/components/input/input.js';

import { SlInput, SlMenu, SlMenuItem } from '@shoelace-style/shoelace';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { Language, Word } from '../app-types.js';

import './word-panel.js';
import { DeferredEvent } from '../events/app-events.js';


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
    lookupResultContainer?:HTMLElement;

    @query("#search-input")
    searchInput?:SlInput;

    @query("#lookup-menu")
    lookupMenu?:SlMenu;

    @query("#trans-lang")
    transLang?:SlInput;

    @property({type: Array})
    lang_list: Array<Language> = [];

    onSearchInput() {
        console.log("onSearchINput");
        let value = this.searchInput?.value;

        this.lookupMenu!.replaceChildren();

        if(value && value.length > 1) {

            let searchEv:DeferredEvent<Array<Word>> = new DeferredEvent(event_types.SEARCH_WORDS_DEFERRED, {input: value, lang_id: this.transLang!.value});

            const resultP = searchEv.promise;

            resultP.then((result) => {
                result.map((word) => {
                    const elem:SlMenuItem = document.createElement('sl-menu-item');

                    //const elem:SlMenuItem = new SlMenuItem();
                    elem.innerText = word.word + " - " + word.type;
                    console.log(this.lookupMenu);
                    console.log(elem);
                    this.lookupMenu!.appendChild(elem);
                });
            }).catch((e) => console.log(e));

            this.dispatchEvent(searchEv);
            //this.dispatchEvent(new CustomEvent(event_types.SEARCH_WORDS, {bubbles: true, composed: true, detail: value}));
        }
    }
    render() {
        return html`
            <p>Translation Panel placeholder</p>
            <sl-details summary="Look up word." open>
                <div id="lookup-container">
                    <sl-input id="search-input" class="search-input" label="Search word" clearable @sl-input=${this.onSearchInput}></sl-input>
                    <sl-select id="trans-lang" name="trans-lang" label="Language" required hoist>
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
                <word-panel></word-panel>
            </sl-details>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "translation-panel": TranslationPanel,
    }
  }