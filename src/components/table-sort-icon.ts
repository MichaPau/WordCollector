import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import compStyles from '../styles/default-component.styles.js';
import {SORT_TABLE, SORT_ICON_ACTIVE} from '../controllers/event_controller.js';
import { SorterItem, SortableColumn } from '../app-types.js';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

@customElement('table-sort-icon')
export class TableSortIcon extends LitElement {

    @property()
    sort_state:"neutral" | "sorted"| "reversed" = "neutral";

    @property()
    column_name?: SortableColumn;

    //column_name: string | undefined = undefined;

    @property()
    column_type: "string" | "number" | "date" = "string";

    @state()
    sort_state_map = new Map([
        ["neutral", "arrow-right-square"],
        ["sorted", "arrow-down-square"],
        ["reversed", "arrow-up-square"],
    ]);
    static styles = [

      compStyles,  
      css`
        sl-icon-button::part(base) {
            color: whitesmoke
        }
      `
    ];
    
    toggleSortState() {
        // if(this.sort_state === "neutral")
        //     this.sort_state = "sorted";
        // else if (this.sort_state === "sorted")
        //     this.sort_state = "reversed";
        // else
        //     this.sort_state = "neutral";

        if(this.sort_state === "neutral" || this.sort_state === "reversed")
            this.sort_state = "sorted";
        else 
            this.sort_state = "reversed";
        
        
        const sortDetail:SorterItem = {column: this.column_name as string, reversed: this.sort_state === "reversed" ? true : false, type: this.column_type };
        const sortEv = new CustomEvent(SORT_TABLE, {bubbles: true, composed: true, detail: sortDetail});

        this.dispatchEvent(new CustomEvent(SORT_ICON_ACTIVE, {bubbles: true, composed: true, detail: this}));

        this.dispatchEvent(sortEv);
    }
    render() {
        let icon_name = this.sort_state_map.get(this.sort_state)!;
        return html`
        <sl-tooltip content=${this.sort_state} hoist>
            <sl-icon-button name=${icon_name} @click=${this.toggleSortState}></sl-icon-button>
        </sl-tooltip>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "table-sort-icon": TableSortIcon,
    }
  }