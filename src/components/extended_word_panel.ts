import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { Definition, DrawerItem, Language, Translation, Word, deferred } from '../app-types.js';
// import  *  as appTypes from '../app-types.js';

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

        sl-tab-panel {
            padding: var(--main-padding);
            padding: 2em;
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

    @query("#definitions-form")
    definitionsForm!:HTMLFormElement;

    connectedCallback(): void {
        super.connectedCallback();
        
       this.getTables("translation");
       this.getTables("definition");
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.definitionsForm.addEventListener("submit", this.addDefinition);
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

    addDefinition(ev:Event) {
        ev.preventDefault();
        console.log("add definition");
    }
    cancelAddDefinition() {
        this.definitionsForm.reset();
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
                        <h3>Add a definition</h3>
                        <form id="definitions-form">
                            
                                <!-- <sl-input label="Definition:" required></sl-input> -->
                                <sl-textarea rows="3" resize="none"></sl-textarea>
                                <sl-select name="definition-lang" label="Language" required>
                                    ${this.lang_list.map((lang) => html`
                                        <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                                    `)}
                                </sl-select>
                            
                            <div class="button-bar">
                                <sl-button variant="default" @click=${this.cancelAddDefinition}>Cancel</sl-button>
                                <sl-button type="submit" variant="primary">Save</sl-button>
                            </div>
                        </form>
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