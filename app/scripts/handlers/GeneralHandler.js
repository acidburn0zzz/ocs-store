export default class GeneralHandler {

    constructor(stateManager, ipcRenderer) {
        this.stateManager = stateManager;
        this.ipcRenderer = ipcRenderer;

        this.appPackage = this.ipcRenderer.sendSync('app', 'package');

        this.aboutdialogComponent = null;

        this.stateManager.actionHandler
            .add('general_about', this.aboutAction.bind(this));

        this.stateManager.viewHandler
            .add('general_about', this.aboutView.bind(this));
    }

    aboutAction() {
        return {
            name: this.appPackage.name,
            productName: this.appPackage.productName,
            version: this.appPackage.version,
            description: this.appPackage.description,
            author: this.appPackage.author,
            license: this.appPackage.license,
            homepage: this.appPackage.homepage,
            repository: this.appPackage.repository,
            bugs: this.appPackage.bugs
        };
    }

    aboutView() {
        if (!this.aboutdialogComponent) {
            this.aboutdialogComponent = document.createElement('aboutdialog-component');
            this.stateManager.target.contentRoot.appendChild(this.aboutdialogComponent);
        }
        this.aboutdialogComponent.open();
    }

}
