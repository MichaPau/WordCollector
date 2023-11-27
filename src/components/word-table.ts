import { LitElement, html, css } from 'lit';
import { customElement, property} from 'lit/decorators.js';

import { Word } from '../app-types';

import resetStyles from '../styles/default-component.styles.js';

@customElement('word-table')
export class WordTable extends LitElement {

    @property({type: Array})
    words:Array<Word> = [];

    static styles = [
        resetStyles,
        css`
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
        }`
    ];
    
    render() {
        return html`
            <table id="word-table">
                <thead>
                <tr>
                    <th>Id</th><th>Word</th><th>Language</th><th>Type</th>
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
                        </tr>
                    `
                })}
                </tbody>
            </table>
        `;
    }
}