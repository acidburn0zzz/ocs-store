import BaseComponent from './BaseComponent.js';

export default class ButtonComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-icon'];
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
            button.button {
                box-shadow: none;
                width: inherit;
                height: inherit;
                border: 0;
                background-color: transparent;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 24px 24px;
                transition: background-color 0.2s ease-out;
            }
            button.button:hover {
                border: 0;
                background-color: var(--color-active);
            }
            </style>

            <button class="button icon-${this.getAttribute('data-icon')}"></button>
        `;
    }

}
