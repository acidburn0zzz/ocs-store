export default class GeneralHandler {

    constructor(stateManager, ipcRenderer) {
        this.stateManager = stateManager;
        this.ipcRenderer = ipcRenderer;

        this.packageMeta = this.ipcRenderer.sendSync('app', 'package');

        document.title = this.packageMeta.productName;

        this.stateManager.actionHandler
            .add('general_about', this.aboutAction.bind(this));

        this.stateManager.viewHandler
            .add('general_about', this.aboutView.bind(this));
    }

    aboutAction() {
        return {
            name: this.packageMeta.name,
            productName: this.packageMeta.productName,
            version: this.packageMeta.version,
            description: this.packageMeta.description,
            author: this.packageMeta.author,
            license: this.packageMeta.license,
            homepage: this.packageMeta.homepage,
            repository: this.packageMeta.repository,
            bugs: this.packageMeta.bugs
        };
    }

    aboutView() {
        this.stateManager.target.contentRoot
            .appendChild(document.createElement('aboutdialog-component'));
    }

}
