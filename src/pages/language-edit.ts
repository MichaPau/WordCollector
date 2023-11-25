import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Language, } from './../app-types.js';

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
    <ul class="horizontal">
        ${this.lang_list.map((lang) => html`<li>${lang.token}</li>`)}
    </ul>
    <add-lang-dialog></add-lang-dialog>
   
    `;
  }
}