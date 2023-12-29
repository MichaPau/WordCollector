import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';

import { SlTabGroup, SlTextarea, SlDetails } from '@shoelace-style/shoelace';

import compStyles from '../styles/default-component.styles.js';
import * as event_types from '../controllers/event_controller.js';
import { flags } from './flags/flag-library.js';
import { Definition, DrawerItem, Language, Translation, Type, Word} from '../app-types.js';
// import  *  as appTypes from '../app-types.js';

import './trans-panel.js';
import './def-panel.js';
import './def-area.js';
import './word-forms-helper.js';
import './mini-alert-confirm.js';
//import { AppRequestWordDataEvent } from '../events/app-request-word-data.js';
import { DeferredEvent } from '../events/app-events.js';
import { MiniAlertConfirm } from './mini-alert-confirm.js';

@customElement('extend-word-panel')
export class ExtendWordPanel extends LitElement implements DrawerItem {

    static styles = [
      compStyles,  
      css`
        #container {
            display: grid;
        }
        /* .horizontal {
            list-style: none;
            display: flex;
            flex-direction: row;
            gap: var(--main-padding);
        }

        .horizontal > * {
            flex: 1 1 50%;
        } */

        .detail-list {
            display: flex;
            flex-direction: column;
            gap: var(--main-padding);
            width: var(--not-full-width);
        }
        @media (max-width: 900px) {
            .detail-list {
                width: 100%;
            }
        }
        .detail-item {
            display:flex;
            align-items: center;
            gap: var(--main-padding);
            justify-content: space-between;
            /* border: 1px solid black;*/
        }

        .translation-text {
            width: 100%;
        }
        .alert-confirm-style {
            transform: translate(-25%, 0);
        }
        .border {
            border: 1px solid black;
        }
        sl-details::part(content) {
            display: flex;
            justify-content: center;
        }
        .center-content::part(base) {
            display: flex;
            justify-content: center;
        }
        

        .def-text {
            flex: 1 1 80%;
        }
        
        sl-tab-panel {
            padding-left: var(--main-padding);
            padding-right: var(--main-padding);
        }

        
        translation-panel::part(content-container) {
            width: var(--not-full-width);
        }
        definition-panel::part(content-container) {
            width: var(--not-full-width);
        }

        @media (max-width: 900px) {
            translation-panel::part(content-container) {
                width: 100%;
            }
            definition-panel::part(content-container) {
                width: 100%;
            }
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

    @property({type: Array})
    type_list: Array<Type> = [];

    @state()
    translations:Array<Translation> = [];

    @state()
    definitions:Array<Definition> = [];

    

    connectedCallback(): void {
        super.connectedCallback();
    
        this.getWordDetails();

        
    //    this.getTables("translation");
    //    this.getTables("definition");
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        // const detail = this.shadowRoot!.querySelector("#definition")!.shadowRoot!.firstChild;
        
        // console.log("Extended_panel::detail",detail);
    }

    getWordDetails() {
        
        const getDataEvent:DeferredEvent<Word> = new DeferredEvent(event_types.GET_WORD_DETAILS, this.word.word_id);
        const p:Promise<Word> = getDataEvent.promise;

        p.then((result) => {
            
            this.definitions = result.definitions!;
            this.translations = result.translations!;

        }).catch((e) => {
            console.log(e);
        });

        this.dispatchEvent(getDataEvent);

    }

    reloadData(table:string) {
        //console.log("reloading data for: ", table);
        //this.getTables(table);
        this.getWordDetails();
        const panelGroup:SlTabGroup =  this.shadowRoot!.querySelector("#panel-group") as SlTabGroup;
        const detailID = "#" + table;
        const detail:SlDetails =  this.shadowRoot!.querySelector(detailID) as SlDetails;
        panelGroup.show("show_details");
        detail.show();
    }

    deleteDefinition(item:Definition) {
        var deleteDefEvent = new DeferredEvent<string>(event_types.DELETE_DEFINITION, item);
        const p:Promise<string> = deleteDefEvent.promise;
        p.then(() => {
            //this.getTables('definition');
            this.getWordDetails();
        }).catch((e) => {
            console.log(e);
            
        });

        this.dispatchEvent(deleteDefEvent);
    }

    deleteTranslation(item:Translation) {
        //console.log("Delete translation:"+JSON.stringify(item,  null, 2));
        var deleteTransEvent = new DeferredEvent<string>(event_types.DELETE_TRANSLATION, item);
        const p:Promise<string> = deleteTransEvent.promise;
        p.then(() => {
            this.getWordDetails();
        }).catch((e) => {
            console.log(e);
            
        });

        this.dispatchEvent(deleteTransEvent);
    }
    editDefinition(ev:Event) {
        const item:SlTextarea = (ev.currentTarget as SlTextarea);
        item.toggleAttribute("readonly");
    }
    
    async closeAction():Promise<void> {
        return undefined;
    }
    render() {
        const langItem = this.lang_list.find(lang => lang.lang_id === this.word.language);
        let iconEncoded;
        if(langItem)
            iconEncoded = encodeURIComponent(langItem.icon!);
        else
            iconEncoded = encodeURIComponent(flags.defaultTrimmed);
        return html`
            <div id="container">
                
                <sl-tab-group id="panel-group">
                    <sl-tab id="detail-tab" slot="nav" panel="show_details">Details</sl-tab>
                    <sl-tab slot="nav" panel="add_translation">Add Translation</sl-tab>
                    <sl-tab slot="nav" panel="add_definition">Add Definition</sl-tab>
                    <sl-tab-panel name="show_details">
                        <div id="details-group">
                            <word-form-helper forms-string=${this.word.forms!} .word=${this.word}>
                                <img slot="icon" class="lang-icon" src='data:image/svg+xml;charset=UTF-8,${iconEncoded!}'>
                            </word-form-helper>
                            <sl-details id="translation" summary="Translations (${this.translations.length})">
                                <ul class="detail-list">
                                ${this.translations.map((item:Translation) => {
                                    const langItem = this.lang_list.find(lang => lang.lang_id === item.to_Word!.language);
                                    let iconEncoded;
                                    if(langItem)
                                        iconEncoded = encodeURIComponent(langItem.icon!);
                                    else
                                        iconEncoded = encodeURIComponent(flags.defaultTrimmed);
                                    
                                    const confirmID = "confirm-alert-trans-" + item.translation_id;
                                    return html`
                                    <li class="detail-item">
                                        <sl-input class="translation-text" value="${item.to_word_id} - ${item.to_Word?.word} - ${item.to_Word?.language_title}" readonly>
                                            <img slot="prefix" class="lang-icon" src='data:image/svg+xml;charset=UTF-8,${iconEncoded!}'>
                                        </sl-input>
                                        <!-- <div>${item.to_word_id} - ${item.to_Word?.word} - ${item.to_Word?.language_title}</div> -->
                                        <sl-tooltip content="Delete" hoist>
                                            <sl-icon-button name="trash" label="Delete" 
                                            @click=${() => {
                                                (this.shadowRoot!.querySelector("#"+confirmID) as MiniAlertConfirm).show();
                                            }}></sl-icon-button>
                                        </sl-tooltip>
                                        
                                        <mini-alert-confirm class="alert-confirm-style" id=${confirmID} 
                                            @on-confirm-cancel=${() => console.log("confirm-canel:", item)} 
                                            @on-confirm-ok=${()=> this.deleteTranslation(item)}>
                                        </mini-alert-confirm>
                                    </li>
                                `})}
                                </ul>
                            </sl-details>
                            <sl-details id="definition" summary="Definitions (${this.definitions.length})">
                                <ul class="detail-list">
                                ${this.definitions.map((item:Definition, index:number) => html`
                                    <li class="detail-item">
                                        <definition-area tabindex=${index} .definition=${item} @app-request-word-data=${ () => this.reloadData('definition')}></definition-area>
                                        <!-- <sl-textarea class="def-text" resize="auto" rows="1" readonly value=${item.definition} @click=${this.editDefinition}></sl-textarea>
                                        <sl-tooltip content="Delete">
                                            <sl-icon-button name="trash" label="Delete" @click=${ () => this.deleteDefinition(item)}></sl-icon-button>
                                        </sl-tooltip> -->
                                    </li>
                                `)}
                                </ul>
                            </sl-details>
                        </div>
                    </sl-tab-panel>
                    <sl-tab-panel name="add_translation">
                        <translation-panel .word=${this.word} .lang_list=${this.lang_list} .type_list=${this.type_list} @app-request-word-data=${ () => this.reloadData('translation')}></translation-panel>
                    </sl-tab-panel>
                    <sl-tab-panel class="center-content" name="add_definition">
                        <definition-panel title="Add a definition" .lang_list=${this.lang_list} .word=${this.word} @app-request-word-data=${ () => this.reloadData('definition')}></definition-panel>
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