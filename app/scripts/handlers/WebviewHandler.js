export default class WebviewHandler {

    constructor(stateManager, ipcRenderer) {
        this.stateManager = stateManager;
        this.ipcRenderer = ipcRenderer;

        this.webviewComponent = this.stateManager.target.contentRoot
            .querySelector('webview-component');
        this.webviewComponent.setAttribute('data-partition', 'persist:opendesktop');
        this.webviewComponent.setAttribute('data-preload', './scripts/renderers/webview.js');
        this.webviewComponent.setAttribute('data-src', this.ipcRenderer.sendSync('store-application', 'startPage'));
        this.webviewComponent.setAttribute('data-debug', '');

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
            isLoading: params.isLoading
        };
    }

    loadingView() {
        this.toolbarComponent.checkWebviewLoadingStatus();
    }

    pageAction(params) {
        return {
            url: params.url,
            title: params.title,
            canGoBack: params.canGoBack,
            canGoForward: params.canGoForward
        };
    }

    pageView() {
        this.toolbarComponent.checkWebviewPageStatus();

        this.toolbarComponent.contentRoot
            .querySelector('omnibox-component')
            .update();
    }

    startPageAction(params) {
        this.ipcRenderer.sendSync('store-application', 'startPage', params.url);
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
                    this.ipcRenderer.sendSync('store-application', 'startPage')
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
