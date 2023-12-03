import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Language, Word, Type} from './../app-types.js';

import resetStyles from '../styles/default-component.styles.js';

import '../components/word-table.js';
import '../components/word-dlg.js';

@customElement('word-edit')
export class WordEdit extends LitElement {

  static styles = [
  
    resetStyles,
    css`

    :host {
      height: 100%;
    }
    #container {
      border: none;
      /* border: 1px solid red; */
      height: 100%;
      /* border: 1px solid black; */
      box-sizing: border-box;
      
    }

    .word-table {
      width: 100%;
    }`
  ];
  

  @property({type: Array})
  word_list:Array<Word> = [];

  @property({type: Array})
  lang_list:Array<Language> = [];

  @property({type: Array})
  type_list:Array<Type> = [];

  
  render() {
    return html`
    <div id="container">
      <word-table .words=${this.word_list} .lang_list=${this.lang_list} .type_list=${this.type_list} class="word-table"></word-table>
        <!-- <sl-split-panel vertical position="90">
            <div id="word-list" slot="start">
              
            </div>
            <div id="word-edit" slot="end"></div>
        </sl-split-panel> -->
  </div>
    `;
  }
}