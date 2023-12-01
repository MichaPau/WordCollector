import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Language, Type, Word, deferred } from '../app-types';

import resetStyles from '../styles/default-component.styles.js';

@customElement('word-dialog')
export class WordDialog extends LitElement {

    @property({type: Array})
    lang_list: Array<Language> = [];

    @property({type: Array})
    type_list: Array<Type> = [];

    @property({type: Object})
    word?: Word;

    static styles = [
    
        resetStyles,
        css`

        #word-form {
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

        .horizontal {
            list-style: none;
            display: flex;
            flex-direction: row;
            gap: var(--main-padding);
        }

        .horizontal > * {
            flex: 1 1 50%;
        }

        .submit-button {
            margin-top: 1rem;
            margin-bottom: 1em;
        }
        .invisible {
            display: none;
        }
        `
    ];

    private addWord = (ev:Event) => {
        ev.preventDefault();
        //console.log("onAddWord:", this);
        
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        var result:HTMLElement = this.shadowRoot!.querySelector("#result-info")!;
        result.innerHTML = "";
        
        const formData = new FormData(form!);
        const formObj = Object.fromEntries(formData.entries());
        var word:Word = {
            "word": formObj["word-input"] as string, 
            "language": formObj["word-lang"] as string,
            "type": formObj["word-type"] as string
        };
    
        const {promise, resolve, reject} = deferred<string>();
        promise
        .then((value) => {
            console.log("Promise resolved:",value);
            form.reset();
            result.className = "success";
            result.innerHTML = word.word + " added.";
        })
        .catch((e) => { 
            console.log("Promise rejected:", e);
            result.className = "error";
            result.innerHTML = "Error: "+e;
        });
    
        const options = {
            detail: {"resolve": resolve, "reject": reject, "word": word},
            bubbles: true,
            composed: true
        };
    
        this.dispatchEvent(new CustomEvent("on_add_word", options));
        //console.log("The word is:",word);
    }
    
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#word-form")!;
        form.addEventListener("submit", this.addWord);
    }

    render() {
        return html`
            <form id="word-form" >
                <label class="invisible">Add a new word:</label>
                <sl-input name="word-input" label="Word:" required spellcheck="false"></sl-input>
                <div class="horizontal">
                    <sl-select name="word-lang" label="Language" required>
                        ${this.lang_list.map((lang) => html`
                            <sl-option value="${lang.title!}">${lang.title}</sl-option>
                        `)}
                    </sl-select>
                    <sl-select name="word-type" label="Type" required>
                        ${this.type_list.map((type) => html`
                            <sl-option value="${type.title!}">${type.title}</sl-option>
                        `)}
                    </sl-select>
                </div>
                <sl-button type="submit" variant="primary" class="submit-button">Add</sl-button>
                <div id="result-info"></div>
            </form>
        `;
    }
}