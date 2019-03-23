import BaseComponent from './BaseComponent.js';

export default class IndicatorComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-state'];
    }

    render() {
        const state = this.getAttribute('data-state') || 'inactive';

        return this.html`
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                width: 100%;
                height: 2px;
            }

            div[data-container] {
                width: inherit;
                height: inherit;
                overflow: hidden;
            }
            div[data-container][data-state="inactive"] {
                display: none;
            }

            div[data-indicator][data-state="active"] {
                position: relative;
                top: 0;
                left: 0;
                width: 50%;
                height: inherit;
                background-color: var(--color-information);
                animation: slide 1s ease-in-out infinite alternate;
            }
            div[data-indicator][data-state="inactive"] {
                display: none;
            }

            @keyframes slide {
                0% {
                    left: -40%;
                }
                100% {
                    left: 90%;
                }
            }
            </style>

            <div data-container data-state="${state}">
            <div data-indicator data-state="${state}"></div>
            </div>
        `;
    }

    start() {
        this.contentRoot.querySelector('div[data-container]').setAttribute('data-state', 'active');
        this.contentRoot.querySelector('div[data-indicator]').setAttribute('data-state', 'active');
        this.dispatch('indicator_start', {});
    }

    stop() {
        this.contentRoot.querySelector('div[data-container]').setAttribute('data-state', 'inactive');
        this.contentRoot.querySelector('div[data-indicator]').setAttribute('data-state', 'inactive');
        this.dispatch('indicator_stop', {});
    }

}
