import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Language, } from './../app-types.js';

import '../components/lang-dlg.js';

@customElement('language-edit')
export class LanguageEdit extends LitElement {

  static styles = css`
  .horizontal {
    list-style: none;
    display: flex;
    flex-direction: row;
    gap: 1em;
  }`;

  @property({type: Array})
  lang_list:Array<Language> = [];

  render() {
    return html`
    
    <lang-dialog .lang_list=${this.lang_list}></lang-dialog>
   
    `;
  }
}