const {ipcRenderer} = require('electron');

export default class WebviewHandler {

    constructor(stateManager) {
        this.stateManager = stateManager;

        this.webviewComponent = this.stateManager.target.contentRoot
            .querySelector('webview-component');
        this.toolbarComponent = this.stateManager.target.contentRoot
            .querySelector('toolbar-component');

        this.stateManager.actionHandler
            .add('webview_loading', this.loadingAction.bind(this))
            .add('webview_page', this.pageAction.bind(this))
            .add('webview_startPage', this.startPageAction.bind(this))
            .add('webview_navigation', this.navigationAction.bind(this));

        this.stateManager.viewHandler
            .add('webview_loading', this.loadingView.bind(this))
            .add('webview_page', this.pageView.bind(this));
    }

    loadingAction(params) {
        return {
            isLoading: params.isLoading || false
        };
    }

    loadingView() {
        this.toolbarComponent.checkWebviewLoadingStatus();
    }

    pageAction(params) {
        return {
            url: params.url || '',
            title: params.title || '',
            canGoBack: params.canGoBack || false,
            canGoForward: params.canGoForward || false
        };
    }

    pageView() {
        this.toolbarComponent.checkWebviewPageStatus();

        this.toolbarComponent.contentRoot
            .querySelector('omnibox-component')
            .update();
    }

    startPageAction(params) {
        ipcRenderer.sendSync('store-application', 'startPage', params.url);
        this.webviewComponent.loadUrl(params.url);
        return false;
    }

    navigationAction(params) {
        switch (params.action) {
            case 'load':
                this.webviewComponent.loadUrl(params.url);
                break;
            case 'home':
                this.webviewComponent.loadUrl(
                    ipcRenderer.sendSync('store-application', 'startPage')
                );
                break;
            case 'back':
                this.webviewComponent.goBack();
                break;
            case 'forward':
                this.webviewComponent.goForward();
                break;
            case 'reload':
                this.webviewComponent.reload();
                break;
            case 'stop':
                this.webviewComponent.stop();
                break;
        }
        return false;
    }

}
