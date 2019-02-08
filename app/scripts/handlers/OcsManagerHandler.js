export default class OcsManagerHandler {

    constructor(stateManager, ocsManagerApi) {
        this._stateManager = stateManager;
        this._ocsManagerApi = ocsManagerApi;

        this._collectiondialogComponent = this._stateManager.target.contentRoot
            .querySelector('collectiondialog-component');

        this._installTypes = {};
        this._installedItems = {};
        this._updateAvailableItems = {};

        this._updateCheckAfter = 86400000; // 1day (ms)

        this._subscribe();

        this._ocsManagerApi.callback
            .set('ItemHandler::metadataSetChanged', this.ItemHandler_metadataSetChanged.bind(this))
            .set('ItemHandler::downloadStarted', this.ItemHandler_downloadStarted.bind(this))
            .set('ItemHandler::downloadFinished', this.ItemHandler_downloadFinished.bind(this))
            .set('ItemHandler::downloadProgress', this.ItemHandler_downloadProgress.bind(this))
            .set('ItemHandler::saveStarted', this.ItemHandler_saveStarted.bind(this))
            .set('ItemHandler::saveFinished', this.ItemHandler_saveFinished.bind(this))
            .set('ItemHandler::installStarted', this.ItemHandler_installStarted.bind(this))
            .set('ItemHandler::installFinished', this.ItemHandler_installFinished.bind(this))
            .set('ItemHandler::uninstallStarted', this.ItemHandler_uninstallStarted.bind(this))
            .set('ItemHandler::uninstallFinished', this.ItemHandler_uninstallFinished.bind(this))
            .set('UpdateHandler::checkAllStarted', this.UpdateHandler_checkAllStarted.bind(this))
            .set('UpdateHandler::checkAllFinished', this.UpdateHandler_checkAllFinished.bind(this))
            .set('UpdateHandler::updateStarted', this.UpdateHandler_updateStarted.bind(this))
            .set('UpdateHandler::updateFinished', this.UpdateHandler_updateFinished.bind(this))
            .set('UpdateHandler::updateProgress', this.UpdateHandler_updateProgress.bind(this));
    }

    _subscribe() {
        this._stateManager.actionHandler
            .add('ocsManager_initial', async () => {
                if (await this._ocsManagerApi.connect()) {
                    let message = null;

                    message = await this._ocsManagerApi.sendSync('ConfigHandler::getAppConfigInstallTypes', []);
                    this._installTypes = message.data[0];

                    message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
                    this._installedItems = message.data[0];

                    message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
                    this._updateAvailableItems = message.data[0];

                    message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigApplication', []);
                    if (!message.data[0].update_checked_at
                        || (message.data[0].update_checked_at + this._updateCheckAfter) < new Date().getTime()
                    ) {
                        this._ocsManagerApi.send('UpdateHandler::checkAll', []);
                    }
                }
                return false;
            })
            .add('ocsManager_ocsUrl', (params) => {
                this._ocsManagerApi.send(
                    'ItemHandler::getItemByOcsUrl',
                    [params.url, params.providerKey, params.contentId]
                );
                return false;
            })
            .add('ocsManager_externalUrl', (params) => {
                this._ocsManagerApi.send('SystemHandler::openUrl', [params.url]);
                return false;
            })
            .add('ocsManager_downloading', async () => {
                const message = await this._ocsManagerApi.sendSync('ItemHandler::metadataSet', []);
                const metadataSet = message.data[0];
                return {
                    downloading: Object.keys(metadataSet).length,
                    metadataSet: metadataSet
                };
            })
            .add('ocsManager_navigation', (params) => {
                switch (params.action) {
                    case 'collection':
                        this._collectiondialogComponent.open();
                        break;
                }
                return false;
            });
    }

    //// For ocsManagerApi ////

    ItemHandler_metadataSetChanged() {
        this._stateManager.dispatch('ocsManager_downloading', {});
    }

    ItemHandler_downloadStarted(message) {
        console.log(message);
        if (message.data[0].status !== 'success_downloadstart') {
            console.error(new Error(message.data[0].message));
        }
        else if (message.data[0].metadata.command === 'install') {
            // download preview pic
        }
        // update component
    }

    ItemHandler_downloadFinished(message) {
        console.log(message);
        if (message.data[0].status !== 'success_download') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    ItemHandler_downloadProgress(message) {
        console.log(message);
        // update component
    }

    ItemHandler_saveStarted(message) {
        console.log(message);
        if (message.data[0].status !== 'success_savestart') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    ItemHandler_saveFinished(message) {
        console.log(message);
        if (message.data[0].status !== 'success_save') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    ItemHandler_installStarted(message) {
        console.log(message);
        if (message.data[0].status !== 'success_installstart') {
            console.error(new Error(message.data[0].message));
        }
        // update component
    }

    async ItemHandler_installFinished(message) {
        console.log(message);
        if (message.data[0].status !== 'success_install') {
            console.error(new Error(message.data[0].message));
        }

        // update component

        message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
        this._installedItems = message.data[0];
    }

    ItemHandler_uninstallStarted(message) {
        console.log(message);
        if (message.data[0].status !== 'success_uninstallstart') {
            console.error(new Error(message.data[0].message));
        }
    }

    async ItemHandler_uninstallFinished(message) {
        console.log(message);
        if (message.data[0].status !== 'success_uninstall') {
            console.error(new Error(message.data[0].message));
        }
        message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
        this._installedItems = message.data[0];
        message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        this._updateAvailableItems = message.data[0];

        // remove preview pic
    }

    UpdateHandler_checkAllStarted(message) {
        console.log(message);
        if (!message.data[0]) {
            console.error(new Error('Item update check failed'));
        }
    }

    async UpdateHandler_checkAllFinished(message) {
        console.log(message);
        if (!message.data[0]) {
            console.error(new Error('Item update check failed'));
        }
        message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        this._updateAvailableItems = message.data[0];
        // update component
    }

    UpdateHandler_updateStarted(message) {
        console.log(message);
        if (!message.data[1]) {
            console.error(new Error('Item update failed'));
        }
    }

    async UpdateHandler_updateFinished(message) {
        console.log(message);
        if (!message.data[1]) {
            console.error(new Error('Item update failed'));
        }
        message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        this._updateAvailableItems = message.data[0];
    }

    UpdateHandler_updateProgress(message) {
        console.log(message);
        // update component
    }

}
