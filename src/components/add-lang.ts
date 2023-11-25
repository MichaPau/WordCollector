import { html, css, LitElement } from 'lit';

import { customElement} from 'lit/decorators.js';

import { Language, deferred } from '../app-types';

@customElement('add-lang-dialog')
export class AddLangDialog extends LitElement {
    static styles = css`
        form {
            margin: 0 auto;
            width: 450px;
            /* Form outline */
            padding: 1em;
            border: 1px solid #ccc;
            border-radius: 1em;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
          
        form li + li {
            margin-top: 1em;
        }
        
        li {
            display: flex;
            flex-direction: row;
        }
        label {
        /* Uniform size & alignment */
            flex: 1 1 40%;
            text-align: right;
        }
        
        input,
        textarea {
        /* To make sure that all text fields have the same font settings
        By default, textareas have a monospace font */
            font: 1em sans-serif;

            /* Uniform text field size */
            flex: 1 1 60%;
            box-sizing: border-box;

            /* Match form field borders */
            border: 1px solid #999;
        }
        .button {
            /* Align buttons with the text fields */
            padding-left: 90px; /* same size as the label elements */
        }
          
        button {
        /* This extra margin represent roughly the same space as the space
            between the labels and their text fields */
            margin-left: 0.5em;
        }

        .success {
            color: var(--success-color);
        }
        .error {
            color: var(--error-color);
        }

    `;
    
    onAddLanguage(event:Event) {
        event.preventDefault();
        console.log("onAddLanguage:");
        
        var form:HTMLFormElement = this.shadowRoot!.querySelector("#form_id")!;
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
            result.innerHTML = lang.title + " added to languages";
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

        this.dispatchEvent(new CustomEvent("on_add_language", options));

        //this.dispatchEvent(new CustomEvent("on_test_promise", options));
       
    }

    onSendTest(event:Event) {
        
        event.preventDefault();
        console.log("onSendTest");
        var input:HTMLInputElement = this.shadowRoot!.querySelector("#test_value")!;
        

       

        const {promise, resolve, reject} = deferred<string>();
        promise.then((value) => console.log("Promise resolved:",value)).catch(() => console.log("Promise rejected")); // nothing
       
        const options = {
            detail: {"resolve": resolve, "reject": reject, "value": input.value},
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent("on_test_promise", options));
    }
    render() {
        return html`
          <div id="dialog-container">
           <form id="form_id" @submit=${this.onAddLanguage}>
           <ul>
                <li>
                    <label for="token">Token (en/fr/it etc.):</label>
                    <input type="text" id="token" name="token" required/>
                </li>
                <li>
                    <label for="title">Language title:</label>
                    <input type="text" id="title" name="title" required/>
                </li>
                <li>
                    <label for="title_native">Title native:</label>
                    <input type="text" id="title_native" name="title_native"/>
                </li>
                <li class="button">
                    <button type="submit">Add</button>
                </li>
                <li>
                    <div id="result-info"></div>
                </li>
            </ul>
           </form>
           
           <!-- <form id="test_form" @submit=${this.onSendTest}>
                <ul>
                    <li>
                        <label>Test value</label>
                        <input type="text" name="test_value" id="test_value"/>
                    </li>
                    <li class="button">
                        <button type="submit">Send</button>
                    </li>
                </ul>
           </form> -->
          </div>
        `;
    }

}