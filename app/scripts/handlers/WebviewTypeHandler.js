export default class WebviewTypeHandler {

    constructor(stateManager, ipcRenderer) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;

        this._isDebugMode = this._ipcRenderer.sendSync('app', 'isDebugMode');
        this._startPage = this._ipcRenderer.sendSync('store-application', 'startPage');

        this._webviewComponent = null;

        this._subscribe();
    }

    _subscribe() {
        this._stateManager.actionHandler
            .add('webview_activate', (data) => {
                this._webviewComponent = data.component;
                return {
                    src: this._startPage,
                    isActivated: true,
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
            .add('webview_navigation', (data) => {
                switch (data.action) {
                    case 'load':
                        this._webviewComponent.loadUrl(data.url);
                        break;
                    case 'home':
                        this._webviewComponent.loadUrl(this._startPage);
                        break;
                    case 'back':
                        this._webviewComponent.goBack();
                        break;
                    case 'forward':
                        this._webviewComponent.goForward();
                        break;
                    case 'reload':
                        this._webviewComponent.reload();
                        break;
                    case 'stop':
                        this._webviewComponent.stop();
                        break;
                }
                return false;
            });
    }

}
