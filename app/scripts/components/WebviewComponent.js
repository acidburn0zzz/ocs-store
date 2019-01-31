const {ipcRenderer} = require('electron');

import BaseComponent from './BaseComponent.js';

export default class WebviewComponent extends BaseComponent {

    init() {
        this.state = {
            partition: 'persist:opendesktop',
            //preload: './scripts/renderers/webview.js',
            src: ipcRenderer.sendSync('store-application', 'startPage'),
            isDebugMode: ipcRenderer.sendSync('app', 'isDebugMode')
        };

        this._webviewElement = null;
    }

    render() {
        return `
            ${this.sharedStyle}
        `;
    }

    componentUpdatedCallback() {
        if (!this._webviewElement) {
            this._createWebviewElement();
        }
        this.contentRoot.appendChild(this._webviewElement);
    }

    loadUrl(url) {
        this._webviewElement.setAttribute('src', url);
    }

    getUrl() {
        return this._webviewElement.getURL();
    }

    getTitle() {
        return this._webviewElement.getTitle();
    }

    goBack() {
        this._webviewElement.goBack();
    }

    goForward() {
        this._webviewElement.goForward();
    }

    reload() {
        this._webviewElement.reload();
    }

    stop() {
        this._webviewElement.stop();
    }

    _createWebviewElement() {
        this._webviewElement = document.createElement('webview');

        this._webviewElement.setAttribute('partition', this.state.partition);
        this._webviewElement.setAttribute('preload', this.state.preload);
        this._webviewElement.setAttribute('src', this.state.src);
        this._webviewElement.className = 'flex-auto';

        this._webviewElement.addEventListener('did-start-loading', () => {
            this.dispatch('webview_loading', {isLoading: true});
        });

        this._webviewElement.addEventListener('did-stop-loading', () => {
            this.dispatch('webview_loading', {isLoading: false});
        });

        this._webviewElement.addEventListener('dom-ready', () => {
            this.dispatch('webview_page', {
                url: this._webviewElement.getURL(),
                title: this._webviewElement.getTitle(),
                canGoBack: this._webviewElement.canGoBack(),
                canGoForward: this._webviewElement.canGoForward()
            });

            if (this.state.isDebugMode) {
                this._webviewElement.openDevTools();
            }

            //this._webviewElement.send('ipc-message');
        });

        this._webviewElement.addEventListener('new-window', (event) => {
            if (event.url.startsWith('http://') || event.url.startsWith('https://')) {
                this.dispatch('ocsManager_externalUrl', {url: event.url});
            }
        });

        this._webviewElement.addEventListener('will-navigate', (event) => {
            if (event.url.startsWith('ocs://') || event.url.startsWith('ocss://')) {
                const info = this._detectOcsApiInfo(this._webviewElement.getURL());
                this.dispatch('ocsManager_ocsUrl', {
                    url: event.url,
                    ...info
                });
            }
        });

        this._webviewElement.addEventListener('did-navigate', (event) => {
        });

        /*
        this._webviewElement.addEventListener('ipc-message', (event) => {
            switch (event.channel) {
                //case 'user-profile': {
                //    break;
                //}
                case 'ocsManager_ocsUrl': {
                    const info = this._detectOcsApiInfo(this._webviewElement.getURL());
                    this.dispatch('ocsManager_ocsUrl', {
                        url: event.args[0],
                        ...info
                    });
                    break;
                }
                case 'ocsManager_externalUrl': {
                    this.dispatch('ocsManager_externalUrl', {url: event.args[0]});
                    break;
                }
            }
        });
        */
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
