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