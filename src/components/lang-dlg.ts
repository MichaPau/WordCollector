import { LitElement, html, css, PropertyValueMap, nothing } from 'lit';
import { customElement, property, state, query} from 'lit/decorators.js';
import { Language, deferred } from '../app-types';

import * as event_types from '../controllers/event_controller.js';
import resetStyles from '../styles/default-component.styles.js';

import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';

@customElement('lang-dialog')
export class LanguageDialog extends LitElement {

    @property({type: Array})
    lang_list: Array<Language> = [];

    @state()
    mode: "Update" | "Add" = "Add";

    @query("#lang_token")
    lang_token?:SlInput;

    @query("#lang_title")
    lang_title?:SlInput;

    @query("#lang_title_native")
    lang_title_native?:SlInput;

    static styles = [
    
    resetStyles,
    css`

    #lang-form {
        display: flex;
        flex-direction: column;
        gap: var(--main-padding);
    }
    .error {
        color: var(--error-color);
    }

    .success {
        color: var(--success-color);
    }
    .short {
        width: clamp(3em, 40%, 10em);
    }
    .token-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--main-padding);
        margin-bottom: 2em;
    }
    .token-list > * {
        flex: 0 0 3em;
        border: 1px solid grey;
    }

    .token-container {
        display: flex;
        align-items: center;
        gap: 0.25em;
        padding: 0.25em;
    }
    .token-style {
        width: 2em;
        text-align: center;
    }
    .submit-button {
            margin-top: 1rem;
            margin-bottom: 1em;
    }
    .invisible {
            display: none;
    }

    sl-icon-button[part="base"] {
        padding: 0;
    }
    `];

    private addLanguage = (ev:Event) => {
        ev.preventDefault();
        //console.log("onAddWord:", this);
        
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#lang-form")!;
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        
        const formData = new FormData(form!);
        const formObj = Object.fromEntries(formData.entries());
        var lang:Language = {
            "token": formObj.token as string, 
            "title": formObj.title as string, 
            "title_native": formObj.title_native as string
        };
    
        const {promise, resolve, reject} = deferred<string>();
        promise
        .then((value) => {
            console.log("Promise resolved:",value);
            form.reset();
            result.className = "success";
            result.innerHTML = lang.title + " added.";
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            result.className = "error";
            result.innerHTML = "Error: "+e;
        });
    
        const options = {
            detail: {"resolve": resolve, "reject": reject, "lang": lang},
            bubbles: true,
            composed: true
        };
    
        if(this.mode === "Add")
            this.dispatchEvent(new CustomEvent(event_types.ADD_LANGUAGE, options));
        else if(this.mode === "Update")
            this.dispatchEvent(new CustomEvent(event_types.UPDATE_LANGUAGE, options));
        else {
            result.className = "error";
            result.innerHTML = "Something went wrong - cannot fix..";
        }
        //console.log("The word is:",word);
    }
    
    checkToken(ev:Event) {
        const elem:HTMLInputElement = (ev.currentTarget  as HTMLInputElement);
        let i = elem.value;
        //const inputShadow:HTMLInputElement = (ev.currentTarget as HTMLInputElement).shadowRoot?.querySelector("#input") as HTMLInputElement;
        if(this.lang_list.find(l => l.token === i) != undefined) {
            console.log("found token");
            
           elem.setCustomValidity("Chose an unique token");
           elem.setAttribute("isvalid", "false");
           
        } else {
            elem.setCustomValidity("");
            elem.setAttribute("isvalid", "true");
        }
       
    }
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#lang-form")!;
        form.addEventListener("submit", this.addLanguage);
    }

    confirmDeleteLang(ev:Event, lang: Language) {

    }

    resetForm () {
        this.mode = "Add";
        this.lang_token!.value = "";
        this.lang_title!.value = "";
        this.lang_title_native!.value = "";
    }
    selectUpdateLang(ev:Event, lang: Language) {
        this.mode = "Update";
        this.lang_token!.value = lang.token;
        this.lang_title!.value = lang.title;
        if(lang.title_native)
            this.lang_title_native!.value = lang.title_native;
        else
            this.lang_title_native!.value = "";
    }
    render() {
        return html`
            <ul class="token-list">
                ${this.lang_list.map((lang) => html`
                    <li>
                        <div class="token-container">
                            <div class="token-style">${lang.token}</div>
                            <sl-tooltip content="Delete ${lang.title}">
                                <sl-icon-button name="trash" label="Delete ${lang.title}" @click=${ (ev:Event) => this.confirmDeleteLang(ev, lang)}></sl-icon-button>
                            </sl-tooltip>
                            <sl-tooltip content="Update ${lang.title}">
                                <sl-icon-button name="vector-pen" label="Update ${lang.title}" @click=${ (ev:Event) => this.selectUpdateLang(ev, lang)}></sl-icon-button>
                            </sl-tooltip>
                        </div>
                    </li>
                `)}
            </ul>
            <form id="lang-form" >
                <label class="invisible">Add a new language</label>
                <label for="lang_token">
                    Token (en/fr/it etc.): *
                    <sl-input id="lang_token" name="token" class="short" required @input=${this.checkToken}></sl-input>
                </label>
                
                <sl-input id="lang_title" name="title" label="Language title:" required></sl-input>
                <sl-input id="lang_title_native" name="title_native" label="Title native"></sl-input>
                
                <div class="button-bar">
                    ${this.mode === "Update" ? html`<sl-button @click="${this.resetForm}" variant="warning">Cancel</sl-button>` : nothing}
                    <sl-button type="submit" variant="primary" class="submit-button">${this.mode}</sl-button>
                </div>
                
                <div id="result-info"></div>
            </form>
        `;
    }
}