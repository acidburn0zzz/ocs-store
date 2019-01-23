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
                width: 30px;
                height: 30px;
            }
            button.button {
                box-shadow: none;
                width: 100%;
                height: 100%;
                border: 0;
                background-color: rgba(0,0,0,0);
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 24px 24px;
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
                case 'reload':
                    this.dispatch('webview-navigation', {method: 'reload'});
                    break;
                case 'stop':
                    this.dispatch('webview-navigation', {method: 'stop'});
                    break;
                case 'home':
                    this.dispatch('webview-navigation', {
                        method: 'loadUrl',
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
