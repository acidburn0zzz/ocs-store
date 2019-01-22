const {ipcRenderer} = require('electron');

import BaseComponent from './BaseComponent.js';

export default class WebviewComponent extends BaseComponent {

    init() {
        this.state = {
            partition: 'persist:opendesktop',
            preload: './scripts/renderers/webview.js',
            src: ipcRenderer.sendSync('store-application', 'startPage'),
            isDebugMode: ipcRenderer.sendSync('app', 'isDebugMode')
        };
    }

    render() {
        return `
            ${this.sharedStyle}
        `;
    }

    componentUpdatedCallback() {
        const webviewElement = document.createElement('webview');
        webviewElement.setAttribute('partition', this.state.partition);
        webviewElement.setAttribute('preload', this.state.preload);
        webviewElement.setAttribute('src', this.state.src);
        webviewElement.className = 'flex-auto';
        this.contentRoot.appendChild(webviewElement);

        webviewElement.addEventListener('did-start-loading', () => {
        });

        webviewElement.addEventListener('did-stop-loading', () => {
        });

        webviewElement.addEventListener('dom-ready', () => {
            if (this.state.isDebugMode) {
                webviewElement.openDevTools();
            }
        });

        webviewElement.addEventListener('will-navigate', (event) => {
        });

        webviewElement.addEventListener('ipc-message', (event) => {
        });
    }

}
