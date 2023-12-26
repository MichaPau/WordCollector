import { LitElement, html, css} from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {SlButton, SlTextarea } from '@shoelace-style/shoelace';

import {DELETE_DEFINITION,  UPDATE_DEFINITION} from '../controllers/event_controller.js';

import compStyles from '../styles/default-component.styles.js';
import { Definition } from '../app-types.js';
import { DeferredEvent } from '../events/app-events.js';

import './mini-alert-confirm.js';
import { MiniAlertConfirm } from './mini-alert-confirm.js';

@customElement('definition-area')
export class DefinitionArea extends LitElement {

    static styles = [
      compStyles,  
      css`
        :host {
            width: 100%;
            position: relative;
        }
        #area-container {
            display: flex;
            align-items: center;
            gap: var(--main-padding);
            justify-content: space-between;
            width: 100%;

            position: relative;

        }
        .def-text {
            flex: 1 1 80%;
            /* height: 3em; */
        }

        /* #text-area:not(:read-only)::part(textarea):focus {
           border: 2px solid red;
        } */
       .focus-readonly::part(textarea):focus {
    
            background-color: var(--sl-input-background-color-focus);
            border-color: var(--sl-input-border-color-focus);
            color: var(--sl-input-color-focus);
            box-shadow: 0 0 0 1px #1d69b9;
            border-radius: var(--sl-input-border-radius-medium);

       }
       .focus-enabled::part(textarea):focus {

            background-color: var(--sl-input-background-color-focus);
            border-color: var(--sl-input-border-color-focus);
            color: var(--sl-input-color-focus);
            box-shadow: 0 0 0 2px #b6b91d;
            border-radius: var(--sl-input-border-radius-medium);
       }

       /* #confirm-delete-alert::part(base) {
            position: absolute;
            z-index: var(--sl-z-index-toast);
            width: 30%;
            min-width: 280px;
            top: 50%;
            right:0;
            transform: translate(0, -50%);
       } */
       sl-alert::part(message) {
        padding: var(--sl-spacing-x-small);
       }
       
       .default-padding {
        padding: var(--main-padding);
       }

       .dialog-wrapper {
        position: absolute;
        z-index: var(--sl-z-index-toast);
        min-width: 280px;
        width: 30%;
        right:0;
        
       }
       .confirmDeleteStyle:modal {
        background-color: rgba(255, 255, 255, 0.0);
        width: 30%;
        min-width: 280px;
        transform: translate(0, -50%);
        border: none;

       
       }

       .confirm-styles {
        color: var(--sl-color-warning-600);
       }
      `
    ];
    

    @state()
    editState: boolean = false;

    @property({type: Object})
    definition?:Definition;

    @query("#text-area")
    textArea?:SlTextarea;

    @query("#confirm-alert")
    confirmAlert!:MiniAlertConfirm;

    @query("#confirm-delete-alert")
    confirmDeleteAlert!:HTMLDialogElement;

    @query("#delete-cancel-button")
    deleteCancelButton!:SlButton;

    constructor() {
        super();
        //this.tabIndex = 0;
        //this.contentEditable = 'true';
    }
    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("focusout", this.onFocusOut);
    }
    
    deleteDefinition(item:Definition) {
        var deleteDefEvent = new DeferredEvent<string>(DELETE_DEFINITION, item);
        const p:Promise<string> = deleteDefEvent.promise;
        p.then(() => {
            this.dispatchEvent(new CustomEvent('app-request-word-data', {bubbles: true, composed: true}));
        }).catch((e) => {
            console.log(e);
        });

        this.dispatchEvent(deleteDefEvent);
    }

    enableEdit() {
        
        this.editState = true;
        this.textArea!.focus();
    }
    undoEdit() {
       
        this.editState = false;
        this.textArea!.value = this.definition!.definition;

    }
    saveEdit() {


        console.log("save edit");
        let defItem:Definition = {
            definition_id: this.definition!.definition_id,
            for_word_id: this.definition!.for_word_id,
            language: this.definition!.language,
            definition: this.textArea!.value
        };

        var saveDefEvent = new DeferredEvent<string>(UPDATE_DEFINITION, defItem);
        const p:Promise<string> = saveDefEvent.promise;
        p.then(() => {
            //console.log(result);
            this.editState = false;
            this.dispatchEvent(new CustomEvent('app-request-word-data', {bubbles: true, composed: true}));
        }).catch((e) => {
            console.log(e);
        });

        this.dispatchEvent(saveDefEvent);
    }

    confirmDelete() {
        this.confirmAlert.show();
       
    }
    onFocusOut = (ev:FocusEvent) => {
        
        this.editState = false;
    }
   
    render() {
        const classes = {"focus-readonly": !this.editState, "focus-enabled": this.editState};
        return html`
        <!-- <textarea id="std-textarea" .readonly="${!this.editState}">Test standard textarea</textarea> -->
            <div id="area-container">
            
            <sl-textarea 
                id="text-area" class="def-text" resize="auto" rows="1" size="small"
                value=${this.definition!.definition}
                class="def-text ${classMap(classes)}"
                .readonly="${!this.editState}"
                @dblclick=${(ev:Event) => {
                    ev.preventDefault();
                    if(!this.editState)
                        this.editState = true;
                }}
                @mousedown=${(ev:MouseEvent) => {
                    if(ev.detail > 1)
                        ev.preventDefault();
                    
                }}
            >
            </sl-textarea>
            ${this.editState ? html `
                <sl-tooltip content="Undo edit" hoist>
                    <sl-icon-button name="x-square" label="Undo edit" @mousedown=${(ev:Event) => ev.preventDefault()} @click=${this.undoEdit}></sl-icon-button>
                </sl-tooltip>
            
            ` : html `
                <sl-tooltip content="Edit" hoist>
                    <sl-icon-button name="vector-pen" label="Edit" @mousedown=${(ev:Event) => ev.preventDefault()} @click=${this.enableEdit}></sl-icon-button>
                </sl-tooltip>
            `}
           
            <sl-tooltip content="Save edit" hoist>
                <sl-icon-button name="database-add" label="Save edit" .disabled=${!this.editState} @mousedown=${(ev:Event) => ev.preventDefault()} @click=${this.saveEdit}></sl-icon-button>
            </sl-tooltip>
            <sl-tooltip content="Test" hoist>
                <sl-icon-button name="life-preserver" label="Test" @mousedown=${(ev:Event) => ev.preventDefault()} 
                    @click=${this.confirmDelete}></sl-icon-button>
                
            </sl-tooltip>
            <sl-tooltip content="Delete" hoist>
                <sl-icon-button name="trash" label="Delete" .disabled=${this.editState} @mousedown=${(ev:Event) => ev.preventDefault()} 
                @click=${this.confirmDelete}></sl-icon-button>
            </sl-tooltip>
        
            <mini-alert-confirm id="confirm-alert" 
                @on-confirm-cancel=${() => console.log("confirm-canel:", this.definition)} 
                @on-confirm-ok=${()=>console.log("confirm-ok", this.deleteDefinition(this.definition!))}>
            </mini-alert-confirm>
            <!-- <div class="dialog-wrapper" id="dialog-wrapper">
            <dialog id="confirm-delete-alert" class="confirmDeleteStyle">
                <sl-alert variant="warning" open>
                    <sl-icon slot="icon" name="exclamation-triangle"></sl-icon>
                    Confirm delete this definition.
                    <div class="horizontal default-padding"><sl-button autofocus id="delete-cancel-button" size="small" @click=${() => this.confirmDeleteAlert.close()}>Cancel</sl-button><sl-button size="small" @click=${ () => this.deleteDefinition(this.definition!)}>Delete</sl-button></div>
                </sl-alert>
            </dialog>
            </div> -->
        </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "definition-area": DefinitionArea,
    }
  }