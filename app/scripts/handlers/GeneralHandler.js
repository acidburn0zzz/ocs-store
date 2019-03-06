export default class GeneralHandler {

    constructor(stateManager, ipcRenderer) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;

        this._appPackage = this._ipcRenderer.sendSync('app', 'package');

        this._subscribe();
    }

    _subscribe() {
        this._stateManager.actionHandler
            .add('general_about', () => {
                return this._appPackage;
            });
    }

}
