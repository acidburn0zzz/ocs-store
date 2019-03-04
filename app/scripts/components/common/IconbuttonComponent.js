import BaseComponent from './BaseComponent.js';

export default class IconbuttonComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-title', 'data-icon', 'data-size', 'data-color', 'data-status'];
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
        const status = this.getAttribute('data-status') || 'active';
        const disabled = (status === 'inactive') ? 'disabled' : '';

        return `
            ${this.sharedStyle}

            <style>
            @import url(styles/material-icons.css);

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
                cursor: pointer;
                transition: background-color 0.2s ease-out;
            }
            button:hover {
                background-color: var(--color-active);
            }
            </style>

            <button title="${title}" ${disabled}>
            <i class="material-icons md-${size} md-${color} md-${status}">${icon}</i>
            </button>
        `;
    }

}
