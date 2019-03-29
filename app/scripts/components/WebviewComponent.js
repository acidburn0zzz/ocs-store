import BaseComponent from './common/BaseComponent.js';

export default class WebviewComponent extends BaseComponent {

    init() {
        this.state = {
            partition: '',
            preload: '',
            startPage: '',
            isDebugMode: false
        };

        this._isActivated = false;
        this._webview = null;

        this._viewHandler_webview_activate = this._viewHandler_webview_activate.bind(this);
        this._viewHandler_webview_config = this._viewHandler_webview_config.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('webview_activate', this._viewHandler_webview_activate)
            .add('webview_config', this._viewHandler_webview_config);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('webview_activate', this._viewHandler_webview_activate)
            .remove('webview_config', this._viewHandler_webview_config);
    }

    render() {
        return `
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
            }
            webview {
                flex: 1 1 auto;
            }
            </style>
        `;
    }

    componentUpdatedCallback() {
        if (this._isActivated) {
            this._createWebview();
        }
        else {
            this.dispatch('webview_activate', {component: this});
        }
    }

    loadUrl(url) {
        this._webview.setAttribute('src', url);
    }

    getUrl() {
        return this._webview.getURL();
    }

    getTitle() {
        return this._webview.getTitle();
    }

    goBack() {
        this._webview.goBack();
    }

    goForward() {
        this._webview.goForward();
    }

    reload() {
        this._webview.reload();
    }

    stop() {
        this._webview.stop();
    }

    executeJavaScript(...args) {
        this._webview.executeJavaScript(...args);
    }

    _createWebview() {
        this._webview = document.createElement('webview');

        this._webview.setAttribute('partition', this.state.partition);
        this._webview.setAttribute('preload', this.state.preload);
        this._webview.setAttribute('src', this.state.startPage);

        this._webview.addEventListener('did-start-loading', () => {
            this.dispatch('webview_loading', {isLoading: true});
        });

        this._webview.addEventListener('did-stop-loading', () => {
            this.dispatch('webview_loading', {isLoading: false});
        });

        this._webview.addEventListener('dom-ready', () => {
            this.dispatch('webview_page', {
                url: this._webview.getURL(),
                title: this._webview.getTitle(),
                canGoBack: this._webview.canGoBack(),
                canGoForward: this._webview.canGoForward()
            });

            if (this.state.isDebugMode) {
                this._webview.openDevTools();
            }

            this._webview.send('ipc-message');
        });

        this._webview.addEventListener('new-window', (event) => {
            if (event.url.startsWith('http://') || event.url.startsWith('https://')) {
                this.dispatch('ocsManager_openUrl', {url: event.url});
            }
        });

        this._webview.addEventListener('will-navigate', (event) => {
            // See also "will-navigate" event handling in main.js
            if (event.url.startsWith('ocs://') || event.url.startsWith('ocss://')) {
                const info = this._detectOcsApiInfo(this._webview.getURL());
                this.dispatch('ocsManager_getItemByOcsUrl', {url: event.url, ...info});
            }
        });

        //this._webview.addEventListener('ipc-message', (event) => {});

        this.contentRoot.appendChild(this._webview);
    }

    _detectOcsApiInfo(url) {
        // Detect provider key and content id from page url
        // https://www.opendesktop.org/s/Gnome/p/123456789/?key=val#hash
        //
        // providerKey = https://www.opendesktop.org/ocs/v1/
        // contentId = 123456789
        const info = {
            providerKey: '',
            contentId: ''
        };
        const matches = url.match(/(https?:\/\/[^/]+).*\/p\/([^/?#]+)/);
        if (matches) {
            info.providerKey = `${matches[1]}/ocs/v1/`;
            info.contentId = matches[2];
        }
        return info;
    }

    _viewHandler_webview_activate(state) {
        this._isActivated = state.isActivated;
        this.dispatch('webview_config', {});
    }

    _viewHandler_webview_config(state) {
        this.update({...this.state, ...state});
    }

}
