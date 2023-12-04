import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { Definition, DrawerItem, Translation, Word, deferred } from '../app-types.js';
// import  *  as appTypes from '../app-types.js';

@customElement('extend-word-dialog')
export class ExtendWordDialog extends LitElement implements DrawerItem {

    static styles = [
      compStyles,  
      css`
        #container {
            display: grid;
        }
      `
    ];

    @property({type: Object})
    word: Word = {
        word_id: 0,
        word: "",
        language: 0,
        type: ""
    };

    @state()
    translations:Array<Translation> = [];

    @state()
    definitions:Array<Definition> = [];

    connectedCallback(): void {
        super.connectedCallback();
        
       this.getTables("translation");
       this.getTables("definition");
    }

    getTables(table:string) {
        const {promise, resolve, reject} = deferred<Array<unknown>>();
        var options = {
            detail: { "resolve": resolve, "reject": reject, "table": table, "value":this.word.word_id!.toString()},
            composed: true,
            bubbles: true
        }

        promise
        .then((value) => { 
            switch(table) {
                case "translation":
                    this.translations = value as Array<Translation>;
                    break;
                case "definition":
                    this.definitions = value as Array<Definition>;
            }
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
           
        });
        

        this.dispatchEvent(new CustomEvent(event_types.SELECT_ALL, options));
    }
    async closeAction():Promise<void> {
        return undefined;
    }
    render() {
        return html`
            <div id="container">
                
                <sl-tab-group>
                    <sl-tab slot="nav" panel="show_details">Details</sl-tab>
                    <sl-tab slot="nav" panel="add_translation">Add Translation</sl-tab>
                    <sl-tab slot="nav" panel="add_definition">Add Definition</sl-tab>
                    <sl-tab-panel name="show_details">
                        <div id="details-group">
                            <sl-details summary="Translations">
                                <ul>
                                ${this.translations.map((item:Translation) => html`
                                    <li> ${item.for_word_id} - ${item.to_word_id} </li>
                                `)}
                                </ul>
                            </sl-details>
                            <sl-details summary="Definitions">
                                <ul>
                                ${this.definitions.map((item:Definition) => html`
                                    <li> ${item.definition}</li>
                                `)}
                                </ul>
                            </sl-details>
                        </div>
                    </sl-tab-panel>
                    <sl-tab-panel name="add_translation">
                        <p>Add a translation</p>
                    </sl-tab-panel>
                    <sl-tab-panel name="add_definition">
                        <p>Add a definition</p>
                    </sl-tab-panel>
                </sl-tab-group>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "extend-word-dialog": ExtendWordDialog,
    }
  }