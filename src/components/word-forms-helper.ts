import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import compStyles from '../styles/default-component.styles.js';
import { Word } from '../app-types.js';



@customElement('word-form-helper')
export class WordFormHelper extends LitElement {

    static styles = [
      compStyles,  
      css`
        :host {
            width: 100%;
        }

        h4 {
            margin: 0;
        }
        sl-card {
            width: 100%;
        }
        sl-card [slot=header] {
            display: flex;
            gap: var(--main-padding);
            justify-content: start;
            align-items: center;
        }
        .forms-container {
            display: flex;
            align-items: center;
            gap: var(--main-padding);
            /* border: 1px solid black; */

            & > span {
                border: 1px solid black;
            }
        }
      `
    ];
    
    @property({type: Object})
    word!:Word;

    @property({ attribute: 'forms-string' })
    formsString:string | undefined = "";

    @property()
    iconEncoded:string = "";

    @state()
    wordForms:{"gender": string,  "alternative-forms": Array<string>} = {"gender": "", "alternative-forms": []};

    connectedCallback(): void {
        super.connectedCallback();
        this.formsString = this.word.forms;

        console.log("WordFormsHelper:",this.formsString);
        if(this.formsString !== undefined && this.formsString !== '' && this.formsString !== null) {
            try {
                const temp = JSON.parse(this.formsString);
                console.log(temp.gender);
                console.log(typeof temp.gender);
                this.wordForms.gender = temp.gender; 
                this.wordForms['alternative-forms'] = temp["alternative-forms"].split(";"); 
                console.log(this.wordForms);
            } catch(e) {
                //this.wordForms = {"gender": "", "alternative-forms": []};
                console.log(e);
            }
        } else {
            this.wordForms = {"gender": "", "alternative-forms": []};
        }
    }
    render() {
        const genderNode = html`${
            this.wordForms.gender
            ? html`
                <div>Gender ${this.wordForms.gender}</div>
            `
            : nothing
        }`;
        const altNode = html`${
            this.wordForms['alternative-forms'].length > 0
            ? html`
                <div class="forms-container">
                    <h4>Alternative forms:</h4>
                    ${this.wordForms['alternative-forms'].map((item) => {
                        return html`<sl-tag variant="neutral">${item}</sl-tag>`
                    })}
                </div>
            `
            : nothing
        }`;
       
        return html`
        <sl-card>
            <div slot="header">
                <slot name="icon"></slot>
                <p>${this.word.type}</p>
            </div>
            <div>
                ${genderNode}
                ${altNode}
            </div>
        </sl-card>
            
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "work-form-helper": WordFormHelper,
    }
  }