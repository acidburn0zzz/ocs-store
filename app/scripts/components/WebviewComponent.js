const ElectronStore = require('electron-store');

import BaseComponent from './BaseComponent.js';

export default class WebviewComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}
        `;
    }

    componentUpdatedCallback() {
        const store = new ElectronStore({name: 'application'});

        const webviewElement = document.createElement('webview');
        webviewElement.setAttribute('partition', 'persist:opendesktop');
        webviewElement.setAttribute('preload', './scripts/renderers/webview-ipc.js');
        webviewElement.setAttribute('src', store.get('startPage'));
        webviewElement.className = 'flex-auto';
        this.contentRoot.appendChild(webviewElement);
    }

}
