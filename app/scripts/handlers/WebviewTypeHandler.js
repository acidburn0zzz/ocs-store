export default class WebviewTypeHandler {

    constructor(stateManager, ipcRenderer) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;

        this._partition = 'persist:opendesktop';
        this._preload = './scripts/renderers/webview.js';
        this._startPage = this._ipcRenderer.sendSync('store-application', 'startPage');
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
                    src: this._startPage,
                    isDebugMode: this._isDebugMode
                };
            })
            .add('webview_loading', (data) => {
                return {
                    isLoading: data.isLoading
                };
            })
            .add('webview_page', (data) => {
                return {
                    url: data.url,
                    title: data.title,
                    canGoBack: data.canGoBack,
                    canGoForward: data.canGoForward,
                    startPage: this._startPage
                };
            })
            .add('webview_startPage', (data) => {
                this._startPage = data.url;
                this._ipcRenderer.sendSync('store-application', 'startPage', this._startPage);
                this._webviewComponent.loadUrl(this._startPage);
                return false;
            })
            .add('webview_load', (data) => {
                this._webviewComponent.loadUrl(data.url);
                return false;
            })
            .add('webview_home', () => {
                this._webviewComponent.loadUrl(this._startPage);
                return false;
            })
            .add('webview_back', () => {
                this._webviewComponent.goBack();
                return false;
            })
            .add('webview_forward', () => {
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
            });
    }

}
