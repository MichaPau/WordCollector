import { LitElement, html, css, nothing, PropertyValueMap } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import compStyles from '../styles/default-component.styles.js';
import { Language, Type, Word } from '../app-types.js';

//import {getTabbableElements} from '@shoelace-style/shoelace/dist/internal/tabbable.js';
import { getFormControls } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { getTabbableElements } from '../utils/tabbable.js';

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
            display: flex;
            flex-direction: row;
            gap: var(--main-padding);
        }

        .horizontal > * {
            flex: 1 1 50%;
        }

        .vertical {
            display: flex;
            flex-direction: column;
            gap: var(--main-padding);
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
        sl-details::part(content) {
            padding-top: 0;
        }
        sl-details::part(summary) {
            font-size: var(--sl-font-size-medium);
        }
        
        /* sl-details:focus-within::part(summary) {
            outline: solid 2px var(--sl-focus-ring-color);
            outline-offset: 2px;
        } */
      `
    ];
    
    wordformMap = new Map([
        ["noun", [
            {"gender": ""},
            {"alternative-forms": []},
        ]],
        ["adjective", [
            {"alternative-forms": []},
        ]],
        ["adverb", [
            {"alternative-forms": []},
        ]
    ]

    ]);
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

    @state()
    //wordForms?:Array<{[key:string]: any}>;
    wordForms?:Record<string, any>;

    @property({type: Boolean})
    cancellable: boolean = false;

    @query("#word-form")
    wordForm!:HTMLFormElement;

    reset() {
        this.wordForm.reset();
    }
    connectedCallback(): void {
        super.connectedCallback();

        
    }
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        
        this.wordForm.addEventListener("submit", this.onSubmit);

       
        // const formControls = getTabbableElements(this.shadowRoot!);
        // console.log(formControls);
        // formControls.map((node) => {
        //     node.addEventListener("focus", (e:Event) => console.log("focus on:",e.target));
        // });
       
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

            const gender = formObj["gender"] as string;
            const altForms = formObj["alt-forms"] as string;

            if(gender !=='' || altForms !== '') {
                word["forms"] = `{"gender": "${gender}", "alternative-forms": "${altForms}"}`
            } else {
                word["forms"] = undefined;
                
            }
            //console.log(word);
            this.loadingState = true;
            this.dispatchEvent(new CustomEvent('on-word-submit', {bubbles: true, composed: true, detail: word}));
        }   
    }

    private onCancel = () => {
        this.wordForm.reset();
        this.dispatchEvent(new CustomEvent('on-word-cancel', {bubbles: true, composed: true}));
    }

    onWordtypeChange() {

    }
    // protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    //     console.log(_changedProperties);
    // }
    render() {
        const classes = { disabled: this.loadingState};
        let forms, gender, altForms;
        if(this.word.forms) {
            try{
                forms = JSON.parse(this.word.forms);
                gender = forms["gender"];
                altForms = forms["alternative-forms"];
            } catch(e) {
                console.log(e);
                gender = "";
                altForms = "";
            }
            
        } else {
            gender = "";
            altForms = "";
        }
        return html`
            <form id="word-form" class=${classMap(classes)}>
            <input type="text"/>
                <label class="invisible">Add a new word:</label>
                <sl-input id="word_id" name="id" label="ID:" class="hidden" value=${this.word.word_id!.toString()} readonly></sl-input>
                <sl-input name="word-input" label="Word:" required spellcheck="false" value=${this.word!.word}></sl-input>
                <div class="horizontal">
                    <sl-select name="word-lang" label="Language" value=${this.word!.language} required hoist>
                        ${this.lang_list.map((lang) => html`
                            <sl-option value="${lang.lang_id!}">${lang.title}</sl-option>
                        `)}
                    </sl-select>
                    <sl-select name="word-type" label="Type" value=${this.word!.type} required hoist @sl-change=${this.onWordtypeChange}>
                        ${this.type_list.map((type) => html`
                            <sl-option value="${type.title!}">${type.title}</sl-option>
                        `)}
                    </sl-select>
                </div>
                
                <sl-details summary="Gender and alternative forms" tabindex="0">
                    <div >
                    <sl-select name="gender" label="Gender" hoist size="small" clearable value=${gender}>
                        <sl-option value="masculine">masculine</sl-option>
                        <sl-option value="feminine">feminine</sl-option>
                        <sl-option value="neuter">neuter</sl-option>
                        <sl-option value="animate">animate</sl-option>
                        <sl-option value="inanimate">inanimate</sl-option>
                    </sl-select>
                    <sl-input name="alt-forms" value=${altForms} label="Alternative forms" size="small" help-text="Seperate multiple words with semicolons."></sl-input>
                </div>
                </sl-details>
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