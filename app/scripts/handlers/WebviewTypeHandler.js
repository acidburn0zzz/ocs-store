export default class WebviewTypeHandler {

    constructor(stateManager, ipcRenderer) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;

        this._startPage = this._ipcRenderer.sendSync('store-application', 'startPage');

        this._webviewComponent = null;

        this._subscribe();
    }

    _subscribe() {
        this._stateManager.actionHandler
            .add('webview_activate', (params) => {
                this._webviewComponent = params.webviewComponent;
                return {
                    src: this._startPage,
                    isActivated: true,
                    isDebugMode: this._ipcRenderer.sendSync('app', 'isDebugMode')
                };
            })
            .add('webview_loading', (params) => {
                return {
                    isLoading: params.isLoading
                };
            })
            .add('webview_page', (params) => {
                return {
                    url: params.url,
                    title: params.title,
                    canGoBack: params.canGoBack,
                    canGoForward: params.canGoForward,
                    startPage: this._startPage
                };
            })
            .add('webview_startPage', (params) => {
                this._startPage = params.url;
                this._ipcRenderer.sendSync('store-application', 'startPage', this._startPage);
                this._webviewComponent.loadUrl(this._startPage);
                return false;
            })
            .add('webview_navigation', (params) => {
                switch (params.action) {
                    case 'load':
                        this._webviewComponent.loadUrl(params.url);
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
