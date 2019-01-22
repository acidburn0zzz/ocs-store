const {ipcRenderer} = require('electron');

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
                box-shadow: none;
                width: 24px;
                height: 24px;
                border: 0;
                background-color: rgba(0,0,0,0);
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 18px 18px;
                transition: background-color 0.2s ease-out;
            }
            button.button:hover {
                border: 0;
                background-color: rgba(0,0,0,0.1);
            }
            </style>

            <button class="button icon-${this.getAttribute('data-ref')}"></button>
        `;
    }

    componentUpdatedCallback() {
        const buttonElement = this.contentRoot.querySelector('button');
        buttonElement.addEventListener('click', () => {
            switch (this.getAttribute('data-ref')) {
                case 'back':
                    this.dispatch('webview-navigation', {method: 'goBack'});
                    break;
                case 'forward':
                    this.dispatch('webview-navigation', {method: 'goForward'});
                    break;
                case 'refresh':
                    this.dispatch('webview-navigation', {method: 'reload'});
                    break;
                case 'home':
                    this.dispatch('webview-navigation', {
                        method: 'setSrc',
                        url: ipcRenderer.sendSync('store-application', 'startPage')
                    });
                    break;
                case 'collection':
                    this.dispatch('', {});
                    break;
            }
        }, false);
    }

}
