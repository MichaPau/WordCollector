import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import compStyles from '../styles/default-component.styles.js';

@customElement('my-component')
export class MyComponent extends LitElement {

    static styles = [
      compStyles,  
      css``
    ];
    
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