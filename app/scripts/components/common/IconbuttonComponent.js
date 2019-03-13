import BaseComponent from './BaseComponent.js';

export default class IconbuttonComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-title', 'data-icon', 'data-size', 'data-color', 'data-state', 'data-checked'];
    }

    init() {
        this._sizes = {
            'smaller': '12px',
            'small': '18px',
            'medium': '24px',
            'large': '36px',
            'larger': '48px'
        };
    }

    render() {
        const title = this.getAttribute('data-title') || '';
        const icon = this.getAttribute('data-icon') || '';
        const size = this.getAttribute('data-size') || 'medium';
        const color = this.getAttribute('data-color') || 'dark';
        const state = this.getAttribute('data-state') || 'active';

        const disabled = (state === 'inactive') ? 'disabled' : '';
        const checked = this.hasAttribute('data-checked') ? 'data-checked' : '';

        return this.html`
            <style>
            ${this.sharedStyle}
            @import url(styles/material-icons.css);
            </style>

            <style>
            :host {
                display: inline-block;
                width: calc(${this._sizes[size]} + 6px);
                height: calc(${this._sizes[size]} + 6px);
                line-height: 1;
            }

            button {
                -webkit-appearance: none;
                appearance: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: inherit;
                height: inherit;
                border: 0;
                border-radius: 3px;
                background-color: transparent;
                outline: none;
                transition: background-color 0.2s ease-out;
            }
            button:enabled {
                cursor: pointer;
            }
            button:enabled:hover {
                background-color: var(--color-active);
            }
            button[data-checked],
            button[data-checked]:hover {
                background-color: var(--color-information-secondary);
            }
            </style>

            <button title="${title}" ?disabled=${disabled} ?data-checked=${checked}>
            <i class="material-icons md-${size} md-${color} md-${state}">${icon}</i>
            </button>
        `;
    }

}
