import { css } from 'lit';

export default css`
  :root {
    --sl-focus-ring-width: 1px;
    --sl-focus-ring: 0 0 0 var(--sl-focus-ring-width) #1d69b9;
    
  }
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    --sl-focus-ring-width: 1px;
    --sl-focus-ring: 0 0 0 var(--sl-focus-ring-width) #1d69b9;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  ul, ul li {
    list-style-type: none;
    margin:0;
    padding: 0;
    text-indent: 0;
  }

  .error {
        color: var(--error-color);
  }

  .success {
      color: var(--success-color);
  }
  .center-text {
    text-align: center;
  }
  .bold-style {
    font-weight: 700;
  }
  .hidden {
    visibility: hidden;
    height: 0;
  }

  sl-drawer::part(panel) {
    background-color: rgba(255, 255, 255, 0.7);
  }
  /* sl-button::part(base) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  sl-button::part(base):hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  } */


`;