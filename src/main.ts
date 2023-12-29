// import { invoke } from "@tauri-apps/api/tauri";

import { html, css, LitElement, PropertyValueMap } from 'lit';

import { customElement, property, state } from 'lit/decorators.js';

import { DBSQLiteController } from './controllers/db_sqlite_controller.js';
import { AppEventController } from './controllers/event_controller.js';
import { AppSettingsController } from './controllers/app_settings_controller.js';

import { flags } from './components/flags/flag-library.js';

import { Language, Table, Word, Type, DrawerItem } from './app-types.js';

import compStyles from './styles/default-component.styles.js';
import { OPEN_WORD_DRAWER, OPEN_LANGUAGE_DRAWER } from './controllers/event_controller.js';

import { SlAlert, SlDrawer } from '@shoelace-style/shoelace';


import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import './components/lang-panel.js';
import './components/testDialog.js';
import './pages/words.js';
import './components/action-bar.js';



@customElement('main-app')
export class MainApp extends LitElement {

  static styles = [
    compStyles,
    css`
    #app-container {
      height: 100%;
      width: 100%;
      border: 2px solid black;
      padding: var(--main-padding);
    }

    #split-panel {
      height: 100%;
      max-height: 100%;
      width: 100%;
    }
   
    #left-pane {
      padding: var(--main-padding);
    }

    #right-pane {
      padding: var(--main-padding);
      height: 100%;
      max-height: 100%;
      overflow: hidden;
    }

    #word-panel {
      overflow: hidden;
      height: 100%;
    }
    .border-check {
      border: 2px solid black;
    }
    
    .panel-container {
      display: grid;
      grid-template-rows: 3em 1fr;
      gap: var(--main-padding);
      padding-top: var(--main-padding);
      height: 100%;
      max-height: 100%;
      overflow: hidden;
    }

    .full-height {
      height: 100%;
    }

    action-bar {
      flex: 0 0 3em;
    }

    word-edit {
      display: block;
      min-height: 0;
    }

    sl-drawer {
      --size: 50%;
    }
  `];

  public dbCtr = new DBSQLiteController(this);
  private eventCtr = new AppEventController(this);
  public settingsCtr = new AppSettingsController(this);

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

  @state()
  testState = 0;

  constructor() {
    super();
  }

  async connectedCallback(): Promise<void> {

    super.connectedCallback();
    
    await this.dbCtr.connectDB();

    //this.word_list = await this.dbCtr.selectAll("word");
    this.word_list = await this.dbCtr.selectAllWords();
    this.lang_list = await this.dbCtr.selectAll("language");
    this.type_list = await this.dbCtr.selectAll("word_type");
    
    this.addEventListener(OPEN_WORD_DRAWER, () => {
      const drawer:SlDrawer = this.shadowRoot!.querySelector<SlDrawer>('#word-drawer')!;
      drawer.show();
    });
    this.addEventListener(OPEN_LANGUAGE_DRAWER, () => {
      const drawer:SlDrawer = this.shadowRoot!.querySelector<SlDrawer>('#lang-drawer')!;
      drawer.show();
    });

  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if(_changedProperties.has('lang_list') && this.lang_list.length > 0) {
      
      this.lang_list.map((langItem) => {
        if(langItem.icon === "" || langItem.icon === null || langItem.icon === undefined) {
          //langItem.icon = flags.defaultEncoded;
          //langItem.icon = encodeURIComponent(flags.defaultTrimmed);
          langItem.icon = flags.defaultTrimmed;
        } else {
          //langItem.icon = encodeURIComponent(langItem.icon);
        }
      });

      //console.log("lang_list:", this.lang_list);
    }
  }
  

  onDrawerClose(ev:Event) {
    console.log("onDrawerClose");
    const dialog:DrawerItem = (ev.currentTarget as SlDrawer).firstElementChild! as DrawerItem;
    dialog.closeAction();
  }

  notify(message:string, variant = 'primary', icon = 'info-circle', duration = 2500) {
    const alert:SlAlert = Object.assign(document.createElement('sl-alert'), {
      variant,
      closable: true,
      duration: duration,
      innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${message}
      `
    });

    document.body.append(alert);
    alert.toast();
  }

  render() {
    return html`
    
      <div id="app-container">
      <sl-drawer label="Add a new word:" placement="start" class="drawer-placement-bottom" id="word-drawer" @sl-request-close=${this.onDrawerClose}>
        <word-panel .lang_list=${this.lang_list} .type_list=${this.type_list} mode="Add"></word-panel>
      </sl-drawer>
      <sl-drawer label="Language settings:" placement="start" style="--size: 61.4%;" class="drawer-placement-bottom" id="lang-drawer" @sl-request-close=${this.onDrawerClose}>
        <lang-panel .lang_list=${this.lang_list}></lang-panel>
      </sl-drawer>
        <sl-split-panel id="split-panel" position="25">
          <div id="left-pane" slot="start">${this.testState}</div>
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
