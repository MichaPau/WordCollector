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
        #table-container {
            height: 100%;
            overflow-y: auto;
        }
        #word-table {
            width: 100%;
            border-collapse: collapse;
        }
        td, th {
            border: 1px solid #999;
            padding: 0.25rem;
            text-align: left;
        }

        tbody tr:nth-child(odd) {
            background: #eee;
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
        <sl-dialog label="Delete ${this.deleteWord?.word}" id="close-dialog">
            Are you sure to delete ${this.deleteWord?.word}
            <div class="dialog-buttons" slot="footer">
                <sl-button variant="warning" id="delete-btn">Delete</sl-button>
                <sl-button variant="primary" id="cancel-btn">Cancel</sl-button>
            </div>
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
                            <td>${word.language}</td>
                            <td>${word.type}</td>
                            <td class="action-column">
                                <sl-tooltip content="Delete ${word.word}">
                                    <sl-icon-button name="trash" label="DDelete ${word.word}" @click=${ (ev:Event) => this.confirmDeleteWord(ev, word)}></sl-icon-button>
                                </sl-tooltip>
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