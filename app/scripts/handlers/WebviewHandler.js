export default class WebviewHandler {

    constructor(stateManager, ipcRenderer) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;

        this._appPackage = this._ipcRenderer.sendSync('app', 'package');

        this._partition = 'persist:opendesktop';
        this._preload = './scripts/renderers/webview.js';
        this._startPage = this._ipcRenderer.sendSync('store', 'startPage');
        this._isDebugMode = this._ipcRenderer.sendSync('app', 'isDebugMode');

        this._webviewComponent = null;

        this._subscribe();
    }

    _subscribe() {
        this._stateManager.actionHandler
            .add('webview_activate', (data) => {
                this._webviewComponent = data.component;
                return {isActivated: true};
            })
            .add('webview_config', () => {
                return {
                    partition: this._partition,
                    preload: this._preload,
                    startPage: this._startPage,
                    isDebugMode: this._isDebugMode
                };
            })
            .add('webview_loading', (data) => {
                return {isLoading: data.isLoading};
            })
            .add('webview_page', (data) => {
                return {
                    startPage: this._startPage,
                    url: data.url,
                    title: data.title,
                    canGoBack: data.canGoBack,
                    canGoForward: data.canGoForward
                };
            })
            .add('webview_startPage', (data) => {
                if (data.url) {
                    this._startPage = data.url;
                    this._ipcRenderer.sendSync('store', 'startPage', this._startPage);
                }
                this._webviewComponent.loadUrl(this._startPage);
                return false;
            })
            .add('webview_loadUrl', (data) => {
                this._webviewComponent.loadUrl(data.url);
                return false;
            })
            .add('webview_goBack', () => {
                this._webviewComponent.goBack();
                return false;
            })
            .add('webview_goForward', () => {
                this._webviewComponent.goForward();
                return false;
            })
            .add('webview_reload', () => {
                this._webviewComponent.reload();
                return false;
            })
            .add('webview_stop', () => {
                this._webviewComponent.stop();
                return false;
            })
            .add('webview_appBugsPage', () => {
                this._webviewComponent.loadUrl(this._appPackage.bugs);
                return false;
            });
    }

}
