import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import compStyles from '../styles/default-component.styles.js';
import { Definition, Language, Word } from '../app-types.js';
import { DeferredEvent} from '../events/app-events.js';

import * as event_types from '../controllers/event_controller.js';


@customElement('def-panel')
export class DefinitionPanel extends LitElement {

    static styles = [
      compStyles,  
      css`
        #definitions-form {
            display: flex;
            flex-direction: column;
            gap: var(--main-padding);
        }
      `
    ];
    
    @query("#definitions-form")
    definitionsForm!:HTMLFormElement;

    @property()
    title = "";

    @property({type: Object})
    word: Word = {
        word_id: 0,
        word: "",
        language: 0,
        type: ""
    };

    @property({type: Array})
    lang_list: Array<Language> = [];

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        this.definitionsForm.addEventListener("submit", this.addDefinition);
    }

    addDefinition = (ev:Event) => {
        ev.preventDefault();
        //onsole.log("add definition:", this);
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        //var dataEv:AppRequestWordDataEvent = new CustomEvent<{table: "str", 5}>('app-request-word-data', {bubbles: true, composed: true, detail: {"table": "definition", "word_id": this.word.word_id!}});
        // var dataEv:AppRequestWordDataEvent = new CustomEvent('app-request-word-data', {bubbles: true, composed: true, detail: {table: "", word_id: 5}});
        // this.dispatchEvent(dataEv);
        const formData = new FormData(this.definitionsForm);
        const formObj = Object.fromEntries(formData.entries());

        let definition:Definition = {
            "for_word_id": this.word.word_id!,
            "definition": formObj["definition-text"] as string,
            "language": parseInt(formObj["definition-lang"] as string),
        }

        var addEvent = new DeferredEvent<string>(event_types.ADD_DEFINITION, definition);
        const p:Promise<string> = addEvent.promise;
        p.then(() => {
            this.dispatchEvent(new CustomEvent('app-request-word-data', {bubbles: true, composed: true}));
        }).catch((e) => {
            console.log(e);
            result.className = "error";
            result.innerHTML = "Error: "+e;
        }).finally(() => this.definitionsForm.reset());

        this.dispatchEvent(addEvent);

    }
    cancelAddDefinition() {
        this.definitionsForm.reset();
    }

    render() {
        return html`
            <h3>${this.title}</h3>
            <form id="definitions-form">
                
                    <!-- <sl-input label="Definition:" required></sl-input> -->
                    <sl-textarea name="definition-text" rows="3" resize="none" autocorrect="on" required></sl-textarea>
                    <sl-select name="definition-lang" label="Language" value=${this.word.language} required>
                        ${this.lang_list.map((lang) => html`
                            <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                        `)}
                    </sl-select>
                
                <div class="button-bar">
                    <sl-button variant="default" @click=${this.cancelAddDefinition}>Cancel</sl-button>
                    <sl-button type="submit" variant="primary">Save</sl-button>
                    <div id="result-info"></div>
                </div>
            </form>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "def-panel": DefinitionPanel,
    }
  }