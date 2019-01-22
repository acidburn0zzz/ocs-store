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
            this.dispatch('webview-did-start-loading', {});
        });

        webviewElement.addEventListener('did-stop-loading', () => {
            this.dispatch('webview-did-stop-loading', {});
        });

        webviewElement.addEventListener('dom-ready', () => {
            if (this.state.isDebugMode) {
                webviewElement.openDevTools();
            }
            webviewElement.send('ipc-message');
        });

        webviewElement.addEventListener('new-window', (event) => {
            console.log(event);
        });

        webviewElement.addEventListener('will-navigate', (event) => {
            console.log(event);
            if (event.url.startsWith('ocs://') || event.url.startsWith('ocss://')) {
                const info = this._detectOcsApiInfo(webviewElement.getURL());
                this.dispatch('ocs-url', {
                    url: event.url,
                    ...info
                });
            }
        });

        webviewElement.addEventListener('did-navigate', (event) => {
            console.log(event);
        });

        webviewElement.addEventListener('ipc-message', (event) => {
            console.log(event);
            switch (event.channel) {
                //case 'user-profile': {
                //    break;
                //}
                case 'ocs-url': {
                    const info = this._detectOcsApiInfo(webviewElement.getURL());
                    this.dispatch('ocs-url', {
                        url: event.args[0],
                        ...info
                    });
                    break;
                }
                case 'external-url': {
                    this.dispatch('external-url', {url: event.args[0]});
                    break;
                }
            }
        });
    }

    _detectOcsApiInfo(url) {
        // Detect provider key and content id from page url
        // https://www.opendesktop.org/p/123456789/?key=val#hash
        //
        // providerKey = https://www.opendesktop.org/ocs/v1/
        // contentId = 123456789
        const info = {
            providerKey: '',
            contentId: ''
        };
        const pageUrlParts = url.split('?')[0].split('#')[0].split('/p/');
        if (pageUrlParts[0] && pageUrlParts[1]) {
            info.providerKey = `${pageUrlParts[0]}/ocs/v1/`;
            info.contentId = pageUrlParts[1].split('/')[0];
        }
        return info;
    }

}
