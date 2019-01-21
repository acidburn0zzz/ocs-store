const {ipcRenderer} = require('electron');

import BaseComponent from './BaseComponent.js';

export default class WebviewComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}
        `;
    }

    componentUpdatedCallback() {
        const webviewElement = document.createElement('webview');
        webviewElement.setAttribute('partition', 'persist:opendesktop');
        webviewElement.setAttribute('preload', './scripts/renderers/webview-ipc.js');
        webviewElement.setAttribute('src', ipcRenderer.sendSync('store-application', 'startPage'));
        webviewElement.className = 'flex-auto';
        this.contentRoot.appendChild(webviewElement);

        webviewElement.addEventListener('did-start-loading', () => {
        });

        webviewElement.addEventListener('did-stop-loading', () => {
        });

        webviewElement.addEventListener('dom-ready', () => {
            if (ipcRenderer.sendSync('app', 'isDebugMode')) {
                webviewElement.openDevTools();
            }
        });

        webviewElement.addEventListener('will-navigate', (event) => {
        });

        webviewElement.addEventListener('ipc-message', (event) => {
        });
    }

}
