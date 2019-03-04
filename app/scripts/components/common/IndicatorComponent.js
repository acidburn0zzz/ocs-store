import BaseComponent from './BaseComponent.js';

export default class IndicatorComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-status'];
    }

    render() {
        const status = this.getAttribute('data-status') || 'inactive';

        return `
            ${this.sharedStyle}

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
            div[data-indicator][data-status="active"] {
                position: relative;
                top: 0;
                left: 0;
                width: 50%;
                height: inherit;
                background-color: var(--color-information);
                animation-name: slide;
                animation-duration: 1s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
            }
            div[data-indicator][data-status="inactive"] {
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

            <div data-container>
            <div data-indicator data-status="${status}"></div>
            </div>
        `;
    }

}
