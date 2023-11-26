import {html, css, LitElement, PropertyValueMap} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { Language, Word, Type, deferred} from './../app-types.js';

import '../components/word-table.js';
import '../components/word-dlg.js';

@customElement('word-edit')
export class WordEdit extends LitElement {

  static styles = css`

  sl-split-panel {
    height: 100%;
    width: 100%;
  }
  #container {
    border: none;
    height: 100%;
  }
  #word-list {
    padding: var(--main-padding);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }
  #word-edit {
    padding: var(--main-padding);
  }

  
  .word-table {
    width: 100%;
  }

  `;
  

  @property({type: Array})
  word_list:Array<Word> = [];

  @property({type: Array})
  lang_list:Array<Language> = [];

  @property({type: Array})
  type_list:Array<Type> = [];

  // private addWord = (ev:Event) => {
  //   ev.preventDefault();
  //   console.log("onAddWord:", this);
    
  //   var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
  //   var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
  //   result.innerHTML = "";
    
  //   const formData = new FormData(form!);
  //   const formObj = Object.fromEntries(formData.entries());
  //   var word:Word = {
  //       "word": formObj["word-input"] as string, 
  //       "language": formObj["word-lang"] as string,
  //       "type": formObj["word-type"] as string
  //   };

  //   const {promise, resolve, reject} = deferred<string>();
  //   promise
  //   .then((value) => {
  //       console.log("Promise resolved:",value);
  //       form.reset();
  //       result.className = "success";
  //       result.innerHTML = word.word + " added.";
  //   })
  //   .catch((e) => { 
  //       console.log("Promise rejected:", e);
  //       result.className = "error";
  //       result.innerHTML = "Error: "+e;
  //   });

  //   const options = {
  //       detail: {"resolve": resolve, "reject": reject, "word": word},
  //       bubbles: true,
  //       composed: true
  //   };

  //   this.dispatchEvent(new CustomEvent("on_add_word", options));
  //   console.log("The word is:",word);
  // }

  // protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
  //   var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
  //   form.addEventListener("submit", this.addWord);
  // }
  render() {
    return html`
    <div id="container">
        <sl-split-panel vertical  style="height: 100%">
            <!-- <div id="word-list" slot="start">
                ${this.word_list.map((word) => html`<div class="word-item">${word.word} - ${word.language} - ${word.type}</div>`)}
            </div> -->
            <div id="word-list" slot="start">
              <word-table .words=${this.word_list} class="word-table"></word-table>
            </div>
            <div id="word-edit" slot="end">
              <word-dialog .lang_list=${this.lang_list} .type_list=${this.type_list}></word-dialog>
                
            </div>
        </sl-split-panel>
  </div>
    `;
  }
}