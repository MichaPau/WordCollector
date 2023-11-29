import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Language, Word, Type, deferred} from './../app-types.js';

import resetStyles from '../styles/default-component.styles.js';

import '../components/word-table.js';
import '../components/word-dlg.js';

@customElement('word-edit')
export class WordEdit extends LitElement {

  static styles = [
  
    resetStyles,
    css`

    sl-split-panel {
      /* height: 100%; */
      /* width: 100%; */
      height: 100%;
      --padding: 0;
      /* background-color: orange; */
    }
    #container {
      border: none;
      height: 100%;
      /* border: 1px solid black; */
      box-sizing: border-box;
      //overflow: hidden;
      /* overflow-y: scroll; */
      /* background-color: orange; */
    }
    #word-list {
      padding: var(--main-padding);
      overflow: hidden;
      /* overflow-y: scroll; */
    }
    #word-edit {
      /* padding: var(--main-padding);
      height: 100%;
      overflow: hidden; */
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
    <word-table .words=${this.word_list} class="word-table"></word-table>
        <!-- <sl-split-panel vertical position="90">
            <div id="word-list" slot="start">
              
            </div>
            <div id="word-edit" slot="end"></div>
        </sl-split-panel> -->
  </div>
    `;
  }
}