// import { invoke } from "@tauri-apps/api/tauri";

import {html, css, LitElement} from 'lit';

import {customElement, property, state} from 'lit/decorators.js';

import {AppController} from './controllers/mainController.js'

import { Language, Table, Word, Type } from './app-types.js';

//import '@shoelace-style/shoelace/dist/themes/light.css';

import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';


import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';

import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'

import resetStyles from './styles/default-component.styles.js';

import './pages/language-edit.js';
import './pages/words.js';

import './components/action-bar.js';
//import { QueryResult } from 'tauri-plugin-sql-api';

@customElement('main-app')
export class MainApp extends LitElement {

  static styles = [
    resetStyles,
    css`
    #app-container {
      height: 100%;
      width: 100%;
      /* display: flex; */
      overflow: hidden;
      border: 2px solid black;
      padding: var(--main-padding);
      /* overflow-y: scroll; */
      
    }
    #split-panel {
      /* height: 100%; */
      width: 100%;
    }
   
    #left-pane {
      padding: var(--main-padding);
    
    }

    #right-pane {
      /*grid-column: col-start 3 / span 5;
      grid-row: 1;*/
      padding: var(--main-padding);
      height: 100%;
      /* box-sizing: border-box; */
      //overflow: scroll;
    }

    #word-panel {
      /* display: flex;
      flex-direction: column; */
      overflow: hidden;
      height: 100%;
      //background-color: orange;
    }
    .border-check {
      border: 2px solid black;
    }
    sl-tab-group,
    sl-tab-panel,
    sl-split-panel,
    sl-tab-panel::part(base),
    sl-tab-group::part(base),
    sl-tab-group::part(body) {
      height: 100%;
      --padding: 0;
    }

    .panel-container {
      display: flex;
      flex-direction: column;
      gap: var(--main-padding);
      padding-top: var(--main-padding);
      height: 100%;
      align-content: stretch;
    }
    .full-height {
      height: 100%;
    }
    /* sl-tab-panel, sl-tab-group, sl-split-panel {
     
      height: 100%;
    }
    
    sl-tab-group::part(base),
    sl-tab-group::part(body),
    sl-tab-panel::part(base),
    sl-tab-panel::part(body),
    sl-tab-panel {
      height: 100%;
    } */

    word-edit {
      display: block;
      height: 100%;
      overflow-y: auto;
    }
  `];

    

  private dbCtr = new AppController(this);

  @property()
  info = 'nothing here';

  @state()
  table_list:Array<Table> = [];

  @state()
  lang_list:Array<Language> = [];

  @state()
  word_list:Array<Word> = [];

  @state()
  type_list:Array<Type> = [];

  


  constructor() {
    super();
    console.log("constructor");
    

  }
  async connectedCallback(): Promise<void> {

    super.connectedCallback();
    
    await this.dbCtr.connectDB();
    //this.word_list = await this.dbCtr.getWords();
    //this.lang_list = await this.dbCtr.getLanguages();
    //this.type_list = await this.dbCtr.getTypes();

    this.word_list = await this.dbCtr.selectAll("word");
    this.lang_list = await this.dbCtr.selectAll("language");
    this.type_list = await this.dbCtr.selectAll("word_type");

    this.addEventListener("on_add_language", this.addLanguageHandler);
    this.addEventListener("on_add_word", this.addWordHandler);
    this.addEventListener("openAddWordDlg", (ev:Event) => {
      const drawer:SlDrawer = this.shadowRoot!.querySelector<SlDrawer>('#word-drawer')!;
      drawer.show();
    });
    this.addEventListener("openAddLangDlg", (ev:Event) => {
      const drawer:SlDrawer = this.shadowRoot!.querySelector<SlDrawer>('#lang-drawer')!;
      drawer.show();
    });
    //this.addEventListener("on_test_promise", this.testPromiseHandler);

    //console.log(this.appCtr.getDBStatus());
  }

  async addLanguageHandler(ev:Event) {
  
    var l:Language = (ev as CustomEvent).detail.lang;
    await this.dbCtr.addLanguage(l).then((result) => {
      let resolve =  (ev as CustomEvent).detail.resolve;
      resolve("success");
      (async () => {
        this.lang_list = await this.dbCtr.selectAll('language');
      })();
      
    })
    .catch((e) => {
      let reject =  (ev as CustomEvent).detail.reject;
      reject(e);
    });
  }
  async addWordHandler(ev:Event) {
  
    var w:Word = (ev as CustomEvent).detail.word;
    await this.dbCtr.addWord(w).then((result) => {
      let resolve =  (ev as CustomEvent).detail.resolve;
      resolve("success");
      (async () => {
        //this.word_list = await this.dbCtr.getWords();
        this.word_list = await this.dbCtr.selectAll("word");
      })();
      
    })
    .catch((e) => {
      let reject =  (ev as CustomEvent).detail.reject;
      reject(e);
    });

    
    
    
  }

  render() {
    return html`
    
      <div id="app-container">
      <sl-drawer label="Word" placement="start" class="drawer-placement-bottom" id="word-drawer">
        <word-dialog .lang_list=${this.lang_list} .type_list=${this.type_list}></word-dialog>
      </sl-drawer>
      <sl-drawer label="Language" placement="start" class="drawer-placement-bottom" id="lang-drawer">
        <language-edit .lang_list=${this.lang_list}></language-edit>
      </sl-drawer>
        <sl-split-panel id="split-panel" position="20">
          <div id="left-pane" slot="start"></div>
          <div id="right-pane" slot="end">
            <div class="panel-container">
                <action-bar></action-bar>
                <word-edit .lang_list=${this.lang_list} .word_list=${this.word_list} .type_list=${this.type_list}></word-edit>
            </div>
            <!-- <sl-tab-group class="full-height">
              <sl-tab slot="nav" panel="words">Words</sl-tab>
              <sl-tab slot="nav" panel="languages">Languages</sl-tab>
      
              <sl-tab-panel name="words" id="word-panel">
                
                
              </sl-tab-panel>
              <sl-tab-panel name="languages">
                <language-edit .lang_list=${this.lang_list}></language-edit>
              </sl-tab-panel>
            </sl-tab-group> -->
          </div>
        </sl-split-panel>
        
      </div>
    `;
  }

}

// window.addEventListener("DOMContentLoaded", () => {
//   greetInputEl = document.querySelector("#greet-input");
//   greetMsgEl = document.querySelector("#greet-msg");
//   document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
//     e.preventDefault();
//     greet();
//   });
// });
