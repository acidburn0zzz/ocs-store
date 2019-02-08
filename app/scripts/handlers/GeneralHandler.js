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
                return {
                    name: this._appPackage.name,
                    productName: this._appPackage.productName,
                    version: this._appPackage.version,
                    description: this._appPackage.description,
                    author: this._appPackage.author,
                    license: this._appPackage.license,
                    homepage: this._appPackage.homepage,
                    repository: this._appPackage.repository,
                    bugs: this._appPackage.bugs
                };
            });
    }

}
