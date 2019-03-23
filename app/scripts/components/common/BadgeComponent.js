import BaseComponent from './BaseComponent.js';

export default class BadgeComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-count', 'data-emphasis'];
    }

    render() {
        const count = this.getAttribute('data-count') || '0';
        const emphasis = this.getAttribute('data-emphasis') || 'low';

        return this.html`
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                display: inline-block;
            }

            span {
                display: inline-block;
                padding: 3px 6px;
                border-radius: 10px;
                font-size: 11px;
                line-height: 1;
            }
            span[data-emphasis="low"] {
                background-color: var(--color-active-secondary);
                color: var(--color-text);
            }
            span[data-emphasis="medium"] {
                background-color: var(--color-information);
                color: var(--color-content);
            }
            span[data-emphasis="high"] {
                background-color: var(--color-important);
                color: var(--color-content);
            }
            </style>

            <span data-emphasis="${emphasis}">${count}</span>
        `;
    }

}
