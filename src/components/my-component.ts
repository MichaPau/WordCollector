import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {

    static styles = css``;
    
    render() {
        return html`
            
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "my-component": MyComponent,
    }
  }