export default class WebviewModule {

    constructor(stateManager) {
        this.stateManager = stateManager;

        const root = this.stateManager.target.contentRoot;
        this.webviewComponent = root.querySelector('webview-component');
        this.toolbarComponent = root.querySelector('toolbar-component');

        this.stateManager.actionHandler
            .add('webview-navigation', this.navigationAction.bind(this));

        this.stateManager.viewHandler
            .add('webview-did-start-loading', this.didStartLoadingView.bind(this))
            .add('webview-did-stop-loading', this.didStopLoadingView.bind(this));
    }

    navigationAction(params) {
        switch (params.method) {
            case 'setUrl':
                this.webviewComponent.setUrl(params.url);
                break;
            case 'goBack':
                this.webviewComponent.goBack();
                break;
            case 'goForward':
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

    didStartLoadingView() {
        this.toolbarComponent.contentRoot
            .querySelector('menubutton-component[data-ref="reload"]')
            .setAttribute('data-ref', 'stop');
    }

    didStopLoadingView() {
        this.toolbarComponent.contentRoot
            .querySelector('menubutton-component[data-ref="stop"]')
            .setAttribute('data-ref', 'reload');
    }

}
