export default class BrowserViewHandler {

    constructor(stateManager, ipcRenderer) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;

        this._appPackage = this._ipcRenderer.sendSync('app', 'package');
        this._startPage = this._ipcRenderer.sendSync('store', 'startPage');

        this._subscribe();
    }

    _subscribe() {
        this._ipcRenderer.on('browserView_loading', (event, data) => {
            this._stateManager.dispatch('browserView_loading', data);
        });

        this._ipcRenderer.on('browserView_page', (event, data) => {
            this._stateManager.dispatch('browserView_page', data);
        });

        this._stateManager.actionHandler
            .add('browserView_loading', (data) => {
                return {isLoading: data.isLoading};
            })
            .add('browserView_page', (data) => {
                return {
                    startPage: this._startPage,
                    url: data.url,
                    title: data.title,
                    canGoBack: data.canGoBack,
                    canGoForward: data.canGoForward
                };
            })
            .add('browserView_startPage', (data) => {
                if (data.url) {
                    this._startPage = data.url;
                    this._ipcRenderer.sendSync('store', 'startPage', this._startPage);
                }
                this._ipcRenderer.sendSync('browserView_loadUrl', this._startPage);
                return false;
            })
            .add('browserView_loadUrl', (data) => {
                this._ipcRenderer.sendSync('browserView_loadUrl', data.url);
                return false;
            })
            .add('browserView_goBack', () => {
                this._ipcRenderer.sendSync('browserView_goBack');
                return false;
            })
            .add('browserView_goForward', () => {
                this._ipcRenderer.sendSync('browserView_goForward');
                return false;
            })
            .add('browserView_reload', () => {
                this._ipcRenderer.sendSync('browserView_reload');
                return false;
            })
            .add('browserView_stop', () => {
                this._ipcRenderer.sendSync('browserView_stop');
                return false;
            })
            .add('browserView_appBugsPage', () => {
                this._ipcRenderer.sendSync('browserView_loadUrl', this._appPackage.bugs);
                return false;
            });
    }

}
