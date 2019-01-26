const {ipcRenderer} = require('electron');

export default class WebviewModule {

    constructor(stateManager) {
        this.stateManager = stateManager;

        const container = this.stateManager.target.contentRoot;
        this.webviewComponent = container.querySelector('webview-component');
        this.toolbarComponent = container.querySelector('toolbar-component');

        this.stateManager.actionHandler
            .add('webview-loading', this.loadingAction.bind(this))
            .add('webview-page', this.pageAction.bind(this))
            .add('webview-startpage', this.startpageAction.bind(this))
            .add('webview-navigation', this.navigationAction.bind(this));

        this.stateManager.viewHandler
            .add('webview-loading', this.loadingView.bind(this))
            .add('webview-page', this.pageView.bind(this));
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
            title: params.title || ''
        };
    }

    pageView(state) {
        if (state.url && state.title) {
            this.toolbarComponent.contentRoot
                .querySelector('omnibox-component')
                .update();
        }
    }

    startpageAction(params) {
        ipcRenderer.sendSync('store-application', 'startPage', params.url);
        this.webviewComponent.loadUrl(params.url);
        return false;
    }

    navigationAction(params) {
        switch (params.action) {
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
