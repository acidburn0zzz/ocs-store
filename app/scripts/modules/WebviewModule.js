export default class WebviewModule {

    constructor(stateManager) {
        this.stateManager = stateManager;

        this.stateManager.eventHandler
            .add('webview-navigation', this.navigationEvent.bind(this));
    }

    navigationEvent(params) {
        const webviewComponent = this.stateManager.target.contentRoot
            .querySelector('webview-component');
        switch (params.method) {
            case 'setSrc':
                webviewComponent.setSrc(params.url);
                break;
            case 'goBack':
                webviewComponent.goBack();
                break;
            case 'goForward':
                webviewComponent.goForward();
                break;
            case 'reload':
                webviewComponent.reload();
                break;
        }
        return false;
    }

}
