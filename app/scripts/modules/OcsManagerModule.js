export default class OcsManagerModule {

    constructor(stateManager, ocsManagerApi) {
        this.stateManager = stateManager;
        this.ocsManagerApi = ocsManagerApi;

        /*
        this.collectionComponent = this.stateManager.target.contentRoot
            .querySelector('collection-component');
        */

        this.stateManager.actionHandler
            .add('ocsManager_ocsUrl', this.ocsUrlAction.bind(this))
            .add('ocsManager_externalUrl', this.externalUrlAction.bind(this));

        this.stateManager.viewHandler
            .add('ocsManager_ocsUrl', this.ocsUrlView.bind(this));

        this.installTypes = {};
        this.installedItems = {};
        this.updateAvailableItems = {};

        this.updateCheckAfter = 24; // hours

        this._setupOcsManagerApi();
    }

    async _setupOcsManagerApi() {
        this.ocsManagerApi.callback
            .set('ItemHandler::metadataSetChanged', this.ItemHandler_metadataSetChanged.bind(this))
            .set('ItemHandler::downloadStarted', this.ItemHandler_downloadStarted.bind(this))
            .set('ItemHandler::downloadFinished', this.ItemHandler_downloadFinished.bind(this))
            .set('ItemHandler::downloadProgress', this.ItemHandler_downloadProgress.bind(this))
            .set('ItemHandler::saveStarted', this.ItemHandler_saveStarted.bind(this))
            .set('ItemHandler::saveFinished', this.ItemHandler_saveFinished.bind(this))
            .set('ItemHandler::installStarted', this.ItemHandler_installStarted.bind(this))
            .set('ItemHandler::installFinished', this.ItemHandler_installFinished.bind(this))
            //.set('ItemHandler::uninstall', this.ItemHandler_uninstall.bind(this))
            .set('ItemHandler::uninstallStarted', this.ItemHandler_uninstallStarted.bind(this))
            .set('ItemHandler::uninstallFinished', this.ItemHandler_uninstallFinished.bind(this))
            .set('UpdateHandler::checkAllStarted', this.UpdateHandler_checkAllStarted.bind(this))
            .set('UpdateHandler::checkAllFinished', this.UpdateHandler_checkAllFinished.bind(this))
            .set('UpdateHandler::updateStarted', this.UpdateHandler_updateStarted.bind(this))
            .set('UpdateHandler::updateFinished', this.UpdateHandler_updateFinished.bind(this))
            .set('UpdateHandler::updateProgress', this.UpdateHandler_updateProgress.bind(this));

        if (await this.ocsManagerApi.connect()) {
            let message = null;

            message = await this.ocsManagerApi.sendSync('ConfigHandler::getAppConfigInstallTypes', []);
            this.installTypes = message.data[0];

            message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
            this.installedItems = message.data[0];

            message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
            this.updateAvailableItems = message.data[0];

            message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigApplication', []);
            if (!message.data[0].update_checked_at
                || (message.data[0].update_checked_at + (1000 * 60 * 60 * this.updateCheckAfter)) < new Date().getTime()
            ) {
                this.ocsManagerApi.send('UpdateHandler::checkAll', []);
            }
        }
    }

    //// For stateManager ////

    ocsUrlAction(params) {
        this.ocsManagerApi.send('ItemHandler::getItemByOcsUrl', [params.url, params.providerKey, params.contentId]);
        return false;
    }

    ocsUrlView(state) {
    }

    externalUrlAction(params) {
        this.ocsManagerApi.send('SystemHandler::openUrl', [params.url]);
        return false;
    }

    //// For ocsManagerApi ////

    async ItemHandler_metadataSetChanged(message) {
        message = await this.ocsManagerApi.sendSync('ItemHandler::metadataSet', []);
        console.log(message.data[0]);
    }

    ItemHandler_downloadStarted(message) {
        if (message.data[0].status !== 'success_downloadstart') {
            console.error(new Error(message.data[0].message));
        }
        else if (message.data[0].metadata.command === 'install') {
            // download preview pic
        }
        // update component
    }

    ItemHandler_downloadFinished(message) {
        if (message.data[0].status !== 'success_download') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    ItemHandler_downloadProgress(message) {
        // update component
    }

    ItemHandler_saveStarted(message) {
        if (message.data[0].status !== 'success_savestart') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    ItemHandler_saveFinished(message) {
        if (message.data[0].status !== 'success_save') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    ItemHandler_installStarted(message) {
        if (message.data[0].status !== 'success_installstart') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    async ItemHandler_installFinished(message) {
        if (message.data[0].status !== 'success_install') {
            console.error(new Error(message.data[0].message));
        }

        // update component

        message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
        this.installedItems = message.data[0];
    }

    /*
    ItemHandler_uninstall(message) {
        // remove preview pic
    }
    */

    ItemHandler_uninstallStarted(message) {
        if (message.data[0].status !== 'success_uninstallstart') {
            console.error(new Error(message.data[0].message));
        }
    }

    async ItemHandler_uninstallFinished(message) {
        if (message.data[0].status !== 'success_uninstall') {
            console.error(new Error(message.data[0].message));
        }
        message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
        this.installedItems = message.data[0];
        message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        this.updateAvailableItems = message.data[0];
    }

    UpdateHandler_checkAllStarted(message) {
        if (!message.data[0]) {
            console.error(new Error('Item update check failed'));
        }
    }

    async UpdateHandler_checkAllFinished(message) {
        if (!message.data[0]) {
            console.error(new Error('Item update check failed'));
        }
        message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        this.updateAvailableItems = message.data[0];
        // update component
    }

    UpdateHandler_updateStarted(message) {
        if (!message.data[1]) {
            console.error(new Error('Item update failed'));
        }
    }

    async UpdateHandler_updateFinished(message) {
        if (!message.data[1]) {
            console.error(new Error('Item update failed'));
        }
        message = await this.ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        this.updateAvailableItems = message.data[0];
    }

    UpdateHandler_updateProgress(message) {
        // update component
    }

}
