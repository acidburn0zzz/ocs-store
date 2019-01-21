import BaseComponent from './BaseComponent.js';

export default class MenubuttonComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-ref'];
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
            }
            button.button {
                width: 24px;
                height: 24px;
                border: 0;
                background-color: rgba(255,255,255,0.1);
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 24px 24px;
                transition: background-color 0.2s ease-out;
            }
            button.button:hover {
                background-color: rgba(255,255,255,0.2);
            }
            </style>

            <button class="button icon-${this.getAttribute('data-ref')}"></button>
        `;
    }

    componentUpdatedCallback() {
        const buttonElement = this.contentRoot.querySelector('button');
        buttonElement.addEventListener('click', (event) => {
            event.preventDefault();
            switch (this.getAttribute('data-ref')) {
                case 'home':
                    this.dispatch('', {});
                    break;
                case 'collection':
                    this.dispatch('', {});
                    break;
                case 'back':
                    this.dispatch('', {});
                    break;
                case 'forward':
                    this.dispatch('', {});
                    break;
                case 'refresh':
                    this.dispatch('', {});
                    break;
            }
        }, false);
    }

}
