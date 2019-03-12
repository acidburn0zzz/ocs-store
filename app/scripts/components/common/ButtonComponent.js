import BaseComponent from './BaseComponent.js';

export default class ButtonComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-title', 'data-state', 'data-checked'];
    }

    render() {
        const title = this.getAttribute('data-title') || '';
        const state = this.getAttribute('data-state') || 'active';

        const disabled = (state === 'inactive') ? 'disabled' : '';
        const checked = this.hasAttribute('data-checked') ? 'data-checked' : '';

        return this.html`
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                display: inline-block;
                line-height: 1;
            }

            button {
                -webkit-appearance: none;
                appearance: none;
                display: inline-block;
                width: inherit;
                height: inherit;
                padding: 0.5em 1em;
                border: 1px solid var(--color-border);
                border-radius: 3px;
                background-color: var(--color-content);
                outline: none;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            button:enabled {
                cursor: pointer;
            }
            button:enabled:hover {
                border-color: rgba(0,0,0,0.3);
            }
            button:disabled {
                color: var(--color-text-secondary);
            }
            button[data-checked],
            button[data-checked]:hover {
                border-color: var(--color-information);
            }
            </style>

            <button title="${title}" ?disabled=${disabled} ?data-checked=${checked}><slot></slot></button>
        `;
    }

}
