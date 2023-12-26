import { LitElement, html, css, PropertyValueMap, nothing } from 'lit';
import { customElement, property, state, query} from 'lit/decorators.js';
import { DBEventOptionsItem, DrawerItem, Language, deferred } from '../app-types';

import * as event_types from '../controllers/event_controller.js';
import { CLOSE_TIMEOUT_MS } from '../app-constants.js';

import compStyles from '../styles/default-component.styles.js';

import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.component.js';
import { SlTextarea } from '@shoelace-style/shoelace';

@customElement('lang-panel')
export class LanguagePanel extends LitElement implements DrawerItem{

    @property({type: Array})
    lang_list: Array<Language> = [];

    @state()
    mode: "Update" | "Add" = "Add";

    @state()
    deleteItem?:Language;

    @query("#lang_id")
    lang_id?:SlInput;

    @query("#lang_token")
    lang_token?:SlInput;

    @query("#lang_title")
    lang_title?:SlInput;

    @query("#lang_icon")
    lang_icon?:SlTextarea;

    @query("#lang_title_native")
    lang_title_native?:SlInput;

    @query('#delete-dialog')
    deleteDialog?:SlDialog;

    static styles = [
    
    compStyles,
    css`

    #lang-form {
        display: flex;
        flex-direction: column;
        gap: var(--main-padding);
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
        height: 2.5em;
        /* width: 5em; */
        align-items: center;
        gap: 0.25em;
        gap: var(--main-padding) / 2.0;
        /* padding: 0.25em; */

        &:hover {
            box-shadow: 0px 0px 2px 2px #b5abab;
        }
       
    }
    .token-style {
        width: 2em;
        text-align: center;
        cursor: default;
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
    /* sl-icon-button:hover {
        font-size: 1.2rem; 
    } */
    `];

    async closeAction():Promise<void> {
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#lang-form")!;
        form.reset();

        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";

        this.mode = "Add";
        
        return undefined;

    }
    private addLanguage = (ev:Event) => {
        ev.preventDefault();
        //console.log("onAddWord:", this);
        
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#lang-form")!;
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        
        const formData = new FormData(form!);
        const formObj = Object.fromEntries(formData.entries());
        console.log(formObj);
        var lang:Language = {
            "token": formObj.token as string, 
            "title": formObj.title as string, 
            "title_native": formObj.title_native as string
        };
    
        let result_msg = "";
        if(this.mode === 'Add') {
            result_msg = " added.";
        } else {
            result_msg = " updated.";
            lang.lang_id = parseInt(formObj.id as string); 
        }
        
        if(formObj.icon !== "") lang.icon = formObj.icon as string;
        // console.log("form_id:", formObj.id as string)
        // console.log("lang_id:", lang.lang_id);

        const {promise, resolve, reject} = deferred<string>();
        promise
        .then((value) => {
            console.log("Promise resolved:",value);
            form.reset();
            result.className = "success";
            result.innerHTML = lang.title + result_msg;
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            result.className = "error";
            result.innerHTML = "Error: "+e;
        });
    
        const options:DBEventOptionsItem = {
            detail: {"resolve": resolve, "reject": reject, "item": lang},
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

        this.deleteDialog?.addEventListener("sl-request-close", () => {
            const deleteResult = this.deleteDialog?.querySelector("#delete-result")!;
            deleteResult.innerHTML = "";
            console.log("Delete dialog request close");
            this.deleteItem = undefined;
            
        });
    }

    confirmDeleteLang(lang: Language) {
        const deleteResult = this.deleteDialog?.querySelector("#delete-result")!;
        deleteResult.innerHTML = "";
        this.deleteItem = lang;
        this.deleteDialog?.show();
    }
    cancelDelete() {
        this.deleteItem = undefined;
        this.deleteDialog?.hide();
    }
    async executeDelete() {
        const deleteResult = this.deleteDialog?.querySelector("#delete-result")!;
       //console.log(deleteResult);
        const {promise, resolve, reject} = deferred<string>();
        promise
        .then((value) => {
            console.log("Promise resolved:",value);
            deleteResult.className = "success";
            deleteResult.innerHTML = this.deleteItem?.title + " deleted.";

            setTimeout(() => {
                this.deleteItem = undefined;
                deleteResult.innerHTML = "";
                this.deleteDialog?.hide();
            }, CLOSE_TIMEOUT_MS);
            
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            deleteResult.className = "error";
            deleteResult.innerHTML = e;
        });
    
        const options:DBEventOptionsItem = {
            detail: {"resolve": resolve, "reject": reject, "item": this.deleteItem!},
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent(event_types.DELETE_LANGUAGE, options));
    }
    resetForm () {
        this.mode = "Add";
        this.lang_id!.value = "";
        this.lang_token!.value = "";
        this.lang_title!.value = "";
        this.lang_title_native!.value = "";
        this.lang_icon!.value = "";
    }
    selectUpdateLang(lang: Language) {
        this.mode = "Update";
        this.lang_id!.value = lang.lang_id!.toString();
        this.lang_token!.value = lang.token;
        this.lang_title!.value = lang.title;
        
        if(lang.title_native)
            this.lang_title_native!.value = lang.title_native;
        else
            this.lang_title_native!.value = "";

        if(lang.icon)
            this.lang_icon!.value = lang.icon;
        else
            this.lang_icon!.value = "";
    }
    render() {
        return html`
            <sl-dialog label="Delete ${this.deleteItem?.title}" id="delete-dialog">
                <div class="center-text">
                    Are you sure to delete <span class="bold-style">${this.deleteItem?.token} - ${this.deleteItem?.title}</span><br/>
                    (Can only be deleted when not associated with any word in the database).
                </div>
                <div class="dialog-buttons" slot="footer">
                    <sl-button variant="default" id="cancel-btn" @click=${this.cancelDelete}>Cancel</sl-button>
                    <sl-button variant="warning" id="delete-btn" @click=${this.executeDelete}>Delete</sl-button>
                </div>
                <div id="delete-result"></div>
            </sl-dialog> 
            <ul class="token-list">
                ${this.lang_list.map((lang) => {
                    const iconEncoded = encodeURIComponent(lang.icon!);
                    return html`
                    <li>
                        <div class="token-container">
                            <img class="lang-icon" src='data:image/svg+xml;charset=UTF-8,${iconEncoded!}'>
                            <sl-tooltip content="${lang.token} - ${lang.title}">
                                <div class="token-style">${lang.token}</div>
                            </sl-tooltip>
                            <sl-tooltip content="Update ${lang.title}">
                                <sl-icon-button name="vector-pen" label="Update ${lang.title}" @click=${ () => this.selectUpdateLang(lang)}></sl-icon-button>
                            </sl-tooltip>
                            <sl-tooltip content="Delete ${lang.title}">
                                <sl-icon-button name="trash" label="Delete ${lang.title}" @click=${ () => this.confirmDeleteLang(lang)}></sl-icon-button>
                            </sl-tooltip>
                        </div>
                    </li>
                `})}
            </ul>
            <form id="lang-form" >
                <label class="invisible">Add a new language</label>
                
                <sl-input id="lang_id" name="id" label="ID:" class="short hidden" readonly></sl-input>
                <label for="lang_token">
                    Token (en/fr/it etc.): *
                    <sl-input id="lang_token" name="token" class="short" required @input=${this.checkToken}></sl-input>
                </label>
                
                <sl-input id="lang_title" name="title" label="Language title:" required></sl-input>
                <sl-input id="lang_title_native" name="title_native" label="Title native"></sl-input>
                
                <sl-textarea rows="2" id="lang_icon" name="icon" label="Flag icon svg" help-text="e.g. https://github.com/HatScripts/circle-flags"></sl-textarea>
                
                <div class="button-bar">
                    ${this.mode === "Update" ? html`<sl-button @click="${this.resetForm}" variant="warning">Cancel</sl-button>` : nothing}
                    <sl-button type="submit" variant="primary" class="submit-button">${this.mode}</sl-button>
                </div>
                
                <div id="result-info"></div>
            </form>
        `;
    }
}