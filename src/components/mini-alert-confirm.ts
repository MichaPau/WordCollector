import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import compStyles from '../styles/default-component.styles.js';

import '@shoelace-style/shoelace/dist/components/resize-observer/resize-observer.js';

@customElement('mini-alert-confirm')
export class MiniAlertConfirm extends LitElement {

    static styles = [
      compStyles,  
      css`
        

        .dialog-wrapper {
            position: absolute;
            z-index: var(--sl-z-index-toast);
            /* min-width: 280px;
            width: 30%; */
            width: 100%;
            right:0;
       }
       .dialog-style:modal {
            background-color: rgba(255, 255, 255, 0.0);
            width: 30%;
            min-width: 280px;
            transform: translate(0, -50%);
            border: none;

        }
        .confirm-styles {
            color: var(--sl-color-warning-600);
        }
        sl-alert::part(message) {
            padding: var(--sl-spacing-x-small);
        }
       
        .default-padding {
            padding: var(--main-padding);
        }

        /* dialog {
            animation: fade-out 0.2s ease-out;
        }

        dialog[open] {
            animation: fade-in 0.2s ease-out;
        }

        
        @keyframes fade-in {
        0% {
            opacity: 0;
            display: none;
        }

        100% {
            opacity: 1;
            display: block;
        }}
        @keyframes fade-out {
        0% {
            opacity: 1;
            display: block;
        }

        100% {
            opacity: 0;
            display: none;
        }} */



/* Animation keyframes */

      `
    ];
    
    @property()
    alertText = "Confirm.";

    @property({attribute: "ok-button-label"})
    okButtonLabel = "Ok";

    @property({attribute: "cancel-button-label"})
    cancelButtonLabel = "Cancel";

    @query("#confirm-dialog")
    confirmDialog!:HTMLDialogElement;
    
    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener("resize", this.onResizeHandler);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.onResizeHandler);
    }
    show() {
        this.positionAlert();
        this.confirmDialog.showModal();
    }

    hide() {
        this.confirmDialog.close();
    }


    positionAlert = () => {
        //console.log(this.confirmDialog);
        const wrapper = this.shadowRoot!.getElementById("dialog-wrapper")!;
        const bR = wrapper.getBoundingClientRect();
        this.confirmDialog.style.marginTop = bR.top + "px";
        this.confirmDialog.style.marginLeft = (bR.right - 280) + "px";
       
    }
    onResizeHandler = () => {
        if(this.confirmDialog.open) {
            this.positionAlert();
        }
    }
    render() {
        return html`
        <sl-resize-observer @sl-resize=${this.onResizeHandler}>
            <div class="dialog-wrapper" id="dialog-wrapper">
            <dialog id="confirm-dialog" class="dialog-style">
                <sl-alert variant="warning" open>
                    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                    ${this.alertText}
                    <div class="horizontal default-padding">
                        <sl-button autofocus id="delete-cancel-button" size="small" 
                            @click=${() => {
                                this.dispatchEvent(new Event('on-confirm-cancel', {bubbles: true, composed: true}));
                                this.hide();
                            }}>Cancel</sl-button>
                        <sl-button size="small" @click=${ 
                            () => {
                                this.dispatchEvent(new Event('on-confirm-ok', {bubbles: true, composed: true}));
                                this.hide();
                            }}>Delete</sl-button></div>
                </sl-alert>
            </dialog>
            </div>
        </sl-resize-observer>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "mini-alert-confirm": MiniAlertConfirm,
    }
  }