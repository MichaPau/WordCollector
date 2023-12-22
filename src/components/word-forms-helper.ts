import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import compStyles from '../styles/default-component.styles.js';

@customElement('word-form-helper')
export class WordFormHelper extends LitElement {

    static styles = [
      compStyles,  
      css`
        .forms-container {
            display: flex;
            gap: var(--main-padding);

            & > span {
                border: 1px solid black;
            }
        }
      `
    ];
    
    @property({ attribute: 'forms-string' })
    formsString:string | undefined = "";

    @state()
    wordForms:{"gender": string,  "alternative-forms": Array<string>} = {"gender": "", "alternative-forms": []};

    connectedCallback(): void {
        super.connectedCallback();
        console.log("WordFormsHelper:",this.formsString);
        if(this.formsString !== undefined && this.formsString !== '') {
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
            //this.wordForms = {"gender": "", "alternative-forms": []};
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
            this.wordForms['alternative-forms']
            ? html`
                <div class="forms-container">
                    ${this.wordForms['alternative-forms'].map((item) => {
                        return html`<span>${item}</span>`
                    })}
                </div>
            `
            : nothing
        }`;
        return html`
            <div>
                ${genderNode}
                ${altNode}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "work-form-helper": WordFormHelper,
    }
  }