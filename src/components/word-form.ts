import { LitElement, html, css, nothing, PropertyValueMap } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import compStyles from '../styles/default-component.styles.js';
import { Language, Type, Word } from '../app-types.js';

@customElement('word-form')
export class WordForm extends LitElement {

    static styles = [
      compStyles,  
      css`
         #word-form {
            display: flex;
            flex-direction: column;
            gap: var(--main-padding);
        }
        .horizontal {
            list-style: none;
            display: flex;
            flex-direction: row;
            gap: var(--main-padding);
        }

        .horizontal > * {
            flex: 1 1 50%;
        }
        .invisible {
            display: none;
        }

        .disabled {
            pointer-events: none;
            opacity: 0.614;
        }
        sl-button {
            margin-top: 1rem;
            margin-bottom: 1em;
        }
      `
    ];
    
    @property({type: Array})
    lang_list: Array<Language> = [];

    @property({type: Array})
    type_list: Array<Type> = [];

    @property({type: Object})
    word:Word = {
        word_id: 0,
        word: "",
        language: 0,
        type: ""
    };

    @property()
    submitLabel!:string;

    @property({type: Boolean})
    loadingState:boolean = false;

    @property({type: Boolean})
    cancellable: boolean = false;

    @query("#word-form")
    wordForm!:HTMLFormElement;

    reset() {
        this.wordForm.reset();
    }
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        
        this.wordForm.addEventListener("submit", this.onSubmit);
    }

    private onSubmit = (ev:Event) => {
        ev.preventDefault();
        if(!this.loadingState) {
            const formData = new FormData(this.wordForm);
            const formObj = Object.fromEntries(formData.entries());
            var word:Word = {
                "word_id": parseInt(formObj.id as string), 
                "word": formObj["word-input"] as string, 
                "language": parseInt(formObj["word-lang"] as string),
                "type": formObj["word-type"] as string
            };

            this.loadingState = true;
            this.dispatchEvent(new CustomEvent('on-word-submit', {bubbles: true, composed: true, detail: word}));
        }   
    }

    private onCancel = () => {
        this.wordForm.reset();
        this.dispatchEvent(new CustomEvent('on-word-cancel', {bubbles: true, composed: true}));
    }

    // protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    //     console.log(_changedProperties);
    // }
    render() {
        const classes = { disabled: this.loadingState};
        return html`
            <form id="word-form" class=${classMap(classes)}>
                <label class="invisible">Add a new word:</label>
                <sl-input id="word_id" name="id" label="ID:" class="hidden" value=${this.word.word_id!.toString()} readonly></sl-input>
                <sl-input name="word-input" label="Word:" required spellcheck="false" value=${this.word!.word}></sl-input>
                <div class="horizontal">
                    <sl-select name="word-lang" label="Language" value=${this.word!.language} required hoist>
                        ${this.lang_list.map((lang) => html`
                            <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                        `)}
                    </sl-select>
                    <sl-select name="word-type" label="Type" value=${this.word!.type} required hoist>
                        ${this.type_list.map((type) => html`
                            <sl-option value="${type.title!}">${type.title}</sl-option>
                        `)}
                    </sl-select>
                </div>
                <!-- <sl-button type="submit" variant="primary" class="submit-button">Add</sl-button> -->
                <div class="button-bar">
                    ${this.cancellable ? html`
                        <sl-button variant="default" @click=${this.onCancel}>Cancel</sl-button>
                    ` : nothing}
                    <sl-button type="submit" variant="primary" class="submit-button" ?loading=${this.loadingState}>${this.submitLabel}</sl-button>
                </div>
            </form>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "word-form": WordForm,
    }
  }