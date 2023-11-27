import { css } from 'lit';

export default css`
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

`;