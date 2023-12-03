import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state, query} from 'lit/decorators.js';

import { DBEventOptionsItem, DrawerItem, Language, Type, Word, deferred } from '../app-types';

import resetStyles from '../styles/default-component.styles.js';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import { getBasePath, setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { SlDialog, SlDrawer } from '@shoelace-style/shoelace';
import { WordDialog } from './word-dlg.js';

import * as event_types from '../controllers/event_controller.js';
import { CLOSE_TIMEOUT_MS } from '../app-constants.js';


//setBasePath('/assets/icons');
setBasePath('./src');
console.log("path:", getBasePath());
@customElement('word-table')
export class WordTable extends LitElement {


    @state()
    deleteWord?:Word;

    @property({type: Array})
    words:Array<Word> = [];

    @property({type: Array})
    lang_list:Array<Language> = [];

    @property({type: Array})
    type_list:Array<Type> = [];

    @query("#word-dlg")
    wordDlg?:WordDialog;

    @query("#word-drawer")
    wordDrawer?:SlDrawer;
    
    @query('#delete-dialog')
    deleteDialog?:SlDialog;

    static styles = [
        resetStyles,
        css`
        /* :host {
            height: 100%;
            overflow: hidden;
            
        } */
        #table-container {
            max-height: 100%;
            height: 100%;
           
            overflow-y: scroll;
        }
        #word-table {
            width: 100%;
            height: 100%;
            /* height:100%; */
            /* table-layout: fixed; */
            /* display: block; */
            border-collapse: separate;
           //border-collapse: separate;
            border-spacing: 0;
            overflow-y: scroll;
        }
        thead {
            position: sticky;
            inset-block-start: 0;
            background-color: var(--sl-color-sky-600);
            color: white;
            border: 1px solid white;
        }
        th {
            /* position: sticky;
            top: 0;
            background-color: var(--sl-color-sky-600);
            color: white;
            border: 1px solid white; */
            border-right: 1px solid white;
            /* border-bottom: 1px solid white; */
            padding: 0.25rem;
            text-align: left;
            
        }
        td {
            border-left: 1px solid var(--sl-color-orange-400);
            border-bottom: 1px solid var(--sl-color-orange-400);

            padding: 0.25rem;
            text-align: left;
        }

        td:last-of-type {
            border-right: 1px solid var(--sl-color-orange-400);
        }
        tbody tr:nth-child(odd) {
            background: #eee;
        }
        tbody {
            /* position: relative; */
            /* top: 1em;
            overflow: auto; */
            z-index: -1;
        }
        .action-column {
            display: flex;
            gap: var(--main-padding);
            align-items: center;
        }
        `
    ];
    
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        
        const deleteButton = this.deleteDialog!.querySelector('#delete-btn')!;
        deleteButton.addEventListener('click', () => this.executeDelete);

        const cancelButton = this.deleteDialog!.querySelector('#cancel-btn')!;
        cancelButton.addEventListener('click', () => this.cancelDelete);

        this.addEventListener(event_types.CANCEL_UPDATE, () => {
            this.wordDrawer?.hide();
        });
        this.addEventListener(event_types.CLOSE_WORD_DIALOG, () => {
            this.wordDrawer?.hide();
        });
        this.deleteDialog!.addEventListener('sl-request-close', event => {
            if (event.detail.source === 'overlay') {
              event.preventDefault();
            }
        });
    }
    connectedCallback(): void {
        super.connectedCallback();
        //console.log("exists:", this.closeDialog);
        
    }
    confirmDeleteWord(_word: Word) {
        this.deleteWord = _word;
        this.deleteDialog!.show();

    }
    updateWord(_word:Word) {
        this.wordDlg!.word = _word;
        this.wordDrawer?.show();


    }
    cancelDelete() {
        this.deleteWord = undefined;
        this.deleteDialog?.hide();
    }
    executeDelete() {
        const deleteResult = this.deleteDialog?.querySelector("#delete-result")!;
       //console.log(deleteResult);
        const {promise, resolve, reject} = deferred<string>();
        promise
        .then((value) => {
            console.log("Promise resolved:",value);
            deleteResult.className = "success";
            deleteResult.innerHTML = this.deleteWord?.word + " deleted.";

            setTimeout(() => {
                this.deleteWord = undefined;
                deleteResult.innerHTML = "";
                this.deleteDialog?.hide();
            }, CLOSE_TIMEOUT_MS);
            
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            deleteResult.className = "error";
            deleteResult.innerHTML = e;
        });
    
        const options:DBEventOptionsItem = {
            detail: {"resolve": resolve, "reject": reject, "item": this.deleteWord!},
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent(event_types.DELETE_WORD, options));
    }

    onDrawerClose(ev:Event) {
        
        const dialog:DrawerItem = (ev.currentTarget as SlDrawer).firstElementChild! as DrawerItem;
        dialog.closeAction();
    
      }

    render() {
        return html`
        
        <sl-drawer label="Update word:" placement="start" class="drawer-placement-bottom" id="word-drawer" @sl-request-close=${this.onDrawerClose}>
            <word-dialog id="word-dlg" .lang_list=${this.lang_list} .type_list=${this.type_list} mode="Update"></word-dialog>
        </sl-drawer>
        <sl-dialog label="Delete ${this.deleteWord?.word}" id="delete-dialog">
            <div class="center-text">Are you sure to delete ${this.deleteWord?.word}</div>
            <div class="dialog-buttons" slot="footer">
                <sl-button variant="default" id="cancel-btn" @click=${this.cancelDelete}>Cancel</sl-button>
                <sl-button variant="warning" id="delete-btn" @click=${this.executeDelete}>Delete</sl-button>
                
            </div>
            <div id="delete-result"></div>
        </sl-dialog> 
        <div id="table-container">
           
            <table id="word-table">
                <thead>
                <tr>
                    <th>Id</th><th>Word</th><th>Language</th><th>Type</th><th>Actions</th>
                </tr>
                </thead>
                <tbody>
                ${this.words.map((word:Word) => {
                    return html`
                        <tr>
                            <td>${word.word_id}</td>
                            <td>${word.word}</td>
                            <td>${word.language_title}</td>
                            <td>${word.type}</td>
                            <td>
                                <div class="action-column">
                                    <sl-tooltip content="Delete ${word.word}">
                                        <sl-icon-button name="trash" label="Delete ${word.word}" @click=${ () => this.confirmDeleteWord(word)}></sl-icon-button>
                                    </sl-tooltip>
                                    <sl-tooltip content="Update ${word.word}">
                                        <sl-icon-button name="vector-pen" label="Update ${word.word}" @click=${ () => this.updateWord(word)}></sl-icon-button>
                                    </sl-tooltip>
                                </div>
                            </td>
                                
                                
                            
                        </tr>
                    `
                })}
                </tbody>
            </table>
        </div>
        `;
    }
}