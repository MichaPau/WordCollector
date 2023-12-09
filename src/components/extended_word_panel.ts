import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';

import { SlTabGroup } from '@shoelace-style/shoelace';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { Definition, DrawerItem, Language, Translation, Word, deferred } from '../app-types.js';
// import  *  as appTypes from '../app-types.js';

import './def-panel.js';
//import { AppRequestWordDataEvent } from '../events/app-request-word-data.js';
import { DeferredEvent } from '../events/app-events.js';

@customElement('extend-word-panel')
export class ExtendWordPanel extends LitElement implements DrawerItem {

    static styles = [
      compStyles,  
      css`
        #container {
            display: grid;
        }
        .horizontal {
            list-style: none;
            display: flex;
            flex-direction: row;
            gap: var(--main-padding);
        }

        .horizontal > * {
            flex: 1 1 50%;
        }
        .definition-item {
            display:flex;
            align-items: center;
            justify-content: space-between;
            /* border: 1px solid black;
        } */

        .def-text {
            flex: 1 1 80%;
        }
        sl-tab-panel {
            padding-left: var(--main-padding);
            padding-right: var(--main-padding);
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

    @property({type: Array})
    lang_list: Array<Language> = [];

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
            detail: { "resolve": resolve, "reject": reject, "table": table, "column": "for_word_id", "value":this.word.word_id!.toString()},
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

    reloadData(table:string) {
        console.log("reloading data for: ", table);
        this.getTables(table);
        const panelGroup:SlTabGroup =  this.shadowRoot!.querySelector("#panel-group") as SlTabGroup;
        panelGroup.show("show_details");
    }

    deleteDefinition(item:Definition) {
        var deleteDefEvent = new DeferredEvent<string>(event_types.DELETE_DEFINITION, item);
        const p:Promise<string> = deleteDefEvent.promise;
        p.then(() => {
            this.getTables('definition');
        }).catch((e) => {
            console.log(e);
            
        });

        this.dispatchEvent(deleteDefEvent);
    }
    async closeAction():Promise<void> {
        return undefined;
    }
    render() {
        return html`
            <div id="container">
                
                <sl-tab-group id="panel-group">
                    <sl-tab id="detail-tab" slot="nav" panel="show_details">Details</sl-tab>
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
                                    <li class="definition-item">
                                        <sl-textarea class="def-text" rows="3" resize="none" readonly value=${item.definition}></sl-textarea>
                                        <sl-tooltip content="Delete">
                                            <sl-icon-button name="trash" label="Delete" @click=${ () => this.deleteDefinition(item)}></sl-icon-button>
                                        </sl-tooltip>
                                    </li>
                                `)}
                                </ul>
                            </sl-details>
                        </div>
                    </sl-tab-panel>
                    <sl-tab-panel name="add_translation">
                        <p>Add a translation</p>
                    </sl-tab-panel>
                    <sl-tab-panel name="add_definition">
                        <def-panel title="Add a definition" .lang_list=${this.lang_list} .word=${this.word} @app-request-word-data=${ () => this.reloadData('definition')}></def-panel>
                    </sl-tab-panel>
                </sl-tab-group>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "extend-word-dialog": ExtendWordPanel,
    }
  }