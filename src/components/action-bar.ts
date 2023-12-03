import { LitElement, html, css } from 'lit';
import { customElement} from 'lit/decorators.js';

import resetStyles from '../styles/default-component.styles.js';

import * as event_types from '../controllers/event_controller.js';

@customElement('action-bar')
export class ActionBar extends LitElement {

    static styles = [
        resetStyles,
        css`
            #container {
                display: flex;
                gap: var(--main-padding);
            }
        `
    ];
    
    addWord() {
        this.dispatchEvent(new Event("openAddWordDlg", {bubbles: true, composed: true}));
    }

    addLanguage() {
        this.dispatchEvent(new Event("openAddLangDlg", {bubbles: true, composed: true}));
    }

    test() {
        console.log("test");
        this.dispatchEvent(new Event(event_types.testEvent, {bubbles: true, composed: true}));
    }
    render() {
        return html`
            <div id="#container">
                <sl-button variant="primary" @click=${this.addWord} size="small">New word</sl-button>
                <sl-button variant="primary" @click=${this.addLanguage} size="small">Language settings</sl-button>
                <sl-button variant="primary" @click=${this.test} size="small">Test</sl-button>

            </div>
        `;
    }
}