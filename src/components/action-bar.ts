import { LitElement, html, css } from 'lit';
import { customElement, query} from 'lit/decorators.js';

import { SlButton, SlInput } from '@shoelace-style/shoelace';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { DeferredEvent } from '../events/app-events.js';

@customElement('action-bar')
export class ActionBar extends LitElement {

    static styles = [
        compStyles,
        css`
            #container {
                display: flex;
                gap: var(--main-padding);
                align-items: center;
            }

            .search-input {
                flex: 0 1 7em;
            }
        `
    ];
    
    @query("#search-input")
    searchInput?: SlInput;

    @query("#test-button")
    testButton?:SlButton;

    addWord() {
        this.dispatchEvent(new Event(event_types.OPEN_WORD_DRAWER, {bubbles: true, composed: true}));
    }

    addLanguage() {
        this.dispatchEvent(new Event(event_types.OPEN_LANGUAGE_DRAWER, {bubbles: true, composed: true}));
    }

    onSearchInput() {
        let value = this.searchInput?.value;
        if(value && value.length > 0)
            this.dispatchEvent(new CustomEvent(event_types.SEARCH_WORDS, {bubbles: true, composed: true, detail: value}));
        else
            this.dispatchEvent(new Event(event_types.RESET_SEARCH_WORDS, {bubbles: true, composed: true}));
    }
    test() {
        console.log("test");
        //this.dispatchEvent(new Event(event_types.testEvent, {bubbles: true, composed: true}));
        let testEvent = new DeferredEvent<number>(event_types.testEvent, Math.random());
        let p:Promise<number> = testEvent.promise;
        p.then((value:number) => this.testButton!.innerHTML = "Test:"+value).catch((e) => {
            console.log(e);
            this.testButton!.innerHTML = e
        });
        this.dispatchEvent(testEvent);
    }
    render() {
        return html`
            <div id="container">
                <sl-button variant="primary" @click=${this.addWord} size="small">New word</sl-button>
                <sl-button variant="primary" @click=${this.addLanguage} size="small">Language settings</sl-button>
                <sl-button id="test-button" variant="primary" @click=${this.test} size="small">Test</sl-button>
                <span>Search:</span>
                <sl-input id="search-input" class="search-input" size="small" clearable @sl-input=${this.onSearchInput}></sl-input>
            </div>
        `;
    }
}