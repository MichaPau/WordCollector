import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, state, query} from 'lit/decorators.js';

import { Word } from '../app-types';

import resetStyles from '../styles/default-component.styles.js';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import { getBasePath, setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import { SlDialog } from '@shoelace-style/shoelace';

//setBasePath('/assets/icons');
setBasePath('./src');
console.log("path:", getBasePath());
@customElement('word-table')
export class WordTable extends LitElement {

    @query("#close-dialog")
    closeDialog!:SlDialog;

    @state()
    deleteWord?:Word;

    @property({type: Array})
    words:Array<Word> = [];

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
        console.log("exists2:", this.closeDialog);
        const deleteButton = this.closeDialog.querySelector('#delete-btn')!;
        deleteButton.addEventListener('click', () => console.log("delete-btn clicked"));

        const cancelButton = this.closeDialog.querySelector('#cancel-btn')!;
        cancelButton.addEventListener('click', () => console.log("cancel-btn clicked"));

        this.closeDialog.addEventListener('sl-request-close', event => {
            if (event.detail.source === 'overlay') {
              event.preventDefault();
            }
        });
    }
    connectedCallback(): void {
        super.connectedCallback();
        console.log("exists:", this.closeDialog);
        // const deleteButton = this.closeDialog.querySelector('#delete-btn[slot="footer"]')!;
        // deleteButton.addEventListener('click', () => console.log("delete-btn clicked"));

        // const cancelButton = this.closeDialog.querySelector('#cancel-btn[slot="footer"]')!;
        // cancelButton.addEventListener('click', () => console.log("cancel-btn clicked"));

        // this.closeDialog.addEventListener('sl-request-close', event => {
        //     if (event.detail.source === 'overlay') {
        //       event.preventDefault();
        //     }
        // });
    }
    confirmDeleteWord(ev:Event, _word: Word) {
        this.deleteWord = _word;
        this.closeDialog.show();

    }
    render() {
        return html`
        
        <div id="table-container">
        <!-- ${this.words.map((word:Word) => {
                return html`<div style="height: 3em;">${word.word}</div>`
            })
        } -->
            <sl-dialog label="Delete ${this.deleteWord?.word}" id="close-dialog">
                Are you sure to delete ${this.deleteWord?.word}
                <div class="dialog-buttons" slot="footer">
                    <sl-button variant="warning" id="delete-btn">Delete</sl-button>
                    <sl-button variant="primary" id="cancel-btn">Cancel</sl-button>
                </div>
            </sl-dialog> 
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
                            <td>${word.language}</td>
                            <td>${word.type}</td>
                            <td>
                                <div class="action-column">
                                    <sl-tooltip content="Delete ${word.word}">
                                        <sl-icon-button name="trash" label="Delete ${word.word}" @click=${ (ev:Event) => this.confirmDeleteWord(ev, word)}></sl-icon-button>
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