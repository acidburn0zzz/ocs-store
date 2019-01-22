export default class WebviewModule {

    constructor(stateManager) {
        this.stateManager = stateManager;
        this.webviewComponent = this.stateManager.target.contentRoot
            .querySelector('webview-component');

        this.stateManager.actionHandler
            .add('webview-navigation', this.navigationAction.bind(this));
    }

    navigationAction(params) {
        switch (params.method) {
            case 'setSrc':
                this.webviewComponent.setSrc(params.url);
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

}
