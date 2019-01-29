export default class OcsManagerModule {

    constructor(stateManager, ocsManagerWsApi) {
        this.stateManager = stateManager;
        this.ocsManagerWsApi = ocsManagerWsApi;

        this.installTypes = {};
        this.installedItems = {};
        this.updateAvailableItems = {};

        this.updateCheckAfter = 24; // hours

        this.stateManager.actionHandler
            .add('ocs-url', this.ocsUrlAction.bind(this))
            .add('external-url', this.externalUrlAction.bind(this));

        this.ocsManagerWsApi.eventHandler
            /*.add('open', () => {
                console.log('WebSocket open');
            })
            .add('close', () => {
                console.log('WebSocket close');
            })
            .add('message', (event) => {
                console.log('message', event);
            })*/
            .add('error', (event) => {
                console.error(event);
            });

        this.ocsManagerWsApi.eventHandler
            .add('open', () => {
                this.ocsManagerWsApi.send('initial', 'WebSocketServer::serverUrl', []);
            });

        this.ocsManagerWsApi.funcHandler
            .add('WebSocketServer::serverUrl', this.WebSocketServer_serverUrlFunc.bind(this))
            .add('ConfigHandler::getAppConfigInstallTypes', this.ConfigHandler_getAppConfigInstallTypesFunc.bind(this))
            .add('ConfigHandler::getUsrConfigApplication', this.ConfigHandler_getUsrConfigApplicationFunc.bind(this))
            .add('UpdateHandler::checkAllStarted', this.UpdateHandler_checkAllStartedFunc.bind(this))
            .add('UpdateHandler::checkAllFinished', this.UpdateHandler_checkAllFinishedFunc.bind(this))
            .add('ConfigHandler::getUsrConfigUpdateAvailableItems', this.ConfigHandler_getUsrConfigUpdateAvailableItemsFunc.bind(this))
            .add('ConfigHandler::getUsrConfigInstalledItems', this.ConfigHandler_getUsrConfigInstalledItemsFunc.bind(this))
            .add('DesktopThemeHandler::isApplicableType', this.DesktopThemeHandler_isApplicableTypeFunc.bind(this))
            //.add('ItemHandler::metadataSetChanged', this.ItemHandler_metadataSetChangedFunc.bind(this))
            //.add('ItemHandler::metadataSet', this.ItemHandler_metadataSetFunc.bind(this))
            .add('ItemHandler::downloadStarted', this.ItemHandler_downloadStartedFunc.bind(this))
            .add('ItemHandler::downloadFinished', this.ItemHandler_downloadFinishedFunc.bind(this))
            .add('ItemHandler::downloadProgress', this.ItemHandler_downloadProgressFunc.bind(this))
            .add('ItemHandler::saveStarted', this.ItemHandler_saveStartedFunc.bind(this))
            .add('ItemHandler::saveFinished', this.ItemHandler_saveFinishedFunc.bind(this))
            .add('ItemHandler::installStarted', this.ItemHandler_installStartedFunc.bind(this))
            .add('ItemHandler::installFinished', this.ItemHandler_installFinishedFunc.bind(this))
            .add('ItemHandler::uninstall', this.ItemHandler_uninstallFunc.bind(this))
            .add('ItemHandler::uninstallStarted', this.ItemHandler_uninstallStartedFunc.bind(this))
            .add('ItemHandler::uninstallFinished', this.ItemHandler_uninstallFinishedFunc.bind(this))
            .add('UpdateHandler::updateStarted', this.UpdateHandler_updateStartedFunc.bind(this))
            .add('UpdateHandler::updateFinished', this.UpdateHandler_updateFinishedFunc.bind(this))
            .add('UpdateHandler::updateProgress', this.UpdateHandler_updateProgressFunc.bind(this));

        this.ocsManagerWsApi.connect();
    }

    //// Handlers for stateManager ////

    ocsUrlAction(params) {
        this.ocsManagerWsApi.send('', 'ItemHandler::getItemByOcsUrl', [params.url, params.providerKey, params.contentId]);
        return false;
    }

    externalUrlAction(params) {
        this.ocsManagerWsApi.send('', 'SystemHandler::openUrl', [params.url]);
        return false;
    }


    //// Handlers for ocsManagerWsApi ////

    WebSocketServer_serverUrlFunc(data) {
        if (data.id === 'initial') {
            this.ocsManagerWsApi.send('initial', 'ConfigHandler::getAppConfigInstallTypes', []);
        }
    }

    ConfigHandler_getAppConfigInstallTypesFunc(data) {
        if (data.id === 'initial') {
            this.installTypes = data.data[0];
            this.ocsManagerWsApi.send('initial', 'ConfigHandler::getUsrConfigApplication', []);
        }
    }

    ConfigHandler_getUsrConfigApplicationFunc(data) {
        if (data.id === 'initial') {
            if (!data.data[0].update_checked_at
                || (data.data[0].update_checked_at + (1000 * 60 * 60 * this.updateCheckAfter)) < new Date().getTime()
            ) {
                this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigInstalledItems', []);
                this.ocsManagerWsApi.send('', 'UpdateHandler::checkAll', []); // Will get the installedItems data again
            }
            else {
                this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigUpdateAvailableItems', []);
            }
        }
    }

    UpdateHandler_checkAllStartedFunc(data) {
        if (!data.data[0]) {
            console.error(new Error('Item update check failed'));
            this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigUpdateAvailableItems', []);
        }
    }

    UpdateHandler_checkAllFinishedFunc(data) {
        if (!data.data[0]) {
            console.error(new Error('Item update check failed'));
        }
        this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigUpdateAvailableItems', []);
    }

    ConfigHandler_getUsrConfigUpdateAvailableItemsFunc(data) {
        this.updateAvailableItems = data.data[0];

        // update component

        this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigInstalledItems', []);
    }

    ConfigHandler_getUsrConfigInstalledItemsFunc(data) {
        this.installedItems = data.data[0];

        // update component
    }

    DesktopThemeHandler_isApplicableTypeFunc(data) {
        // update component
    }

    ItemHandler_metadataSetChangedFunc(data) {
        this.ocsManagerWsApi.send('', 'ItemHandler::metadataSet', []);
    }

    ItemHandler_metadataSetFunc(data) {
        console.log(data.data[0]);
    }

    ItemHandler_downloadStartedFunc(data) {
        if (data.data[0].status !== 'success_downloadstart') {
            console.error(new Error(data.data[0].message));
        }
        else if (data.data[0].metadata.command === 'install') {
            // download preview pic
        }
        // update component
    }

    ItemHandler_downloadFinishedFunc(data) {
        if (data.data[0].status !== 'success_download') {
            console.error(new Error(data.data[0].message));
        }
        // update component
    }

    ItemHandler_downloadProgressFunc(data) {
        // update component
    }

    ItemHandler_saveStartedFunc(data) {
        if (data.data[0].status !== 'success_savestart') {
            console.error(new Error(data.data[0].message));
        }
        // update component
    }

    ItemHandler_saveFinishedFunc(data) {
        if (data.data[0].status !== 'success_save') {
            console.error(new Error(data.data[0].message));
        }
        // update component
    }

    ItemHandler_installStartedFunc(data) {
        if (data.data[0].status !== 'success_installstart') {
            console.error(new Error(data.data[0].message));
        }
        // update component
    }

    ItemHandler_installFinishedFunc(data) {
        if (data.data[0].status !== 'success_install') {
            console.error(new Error(data.data[0].message));
        }

        // update component

        this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigInstalledItems', []);
    }

    ItemHandler_uninstallFunc(data) {
        // remove preview pic
    }

    ItemHandler_uninstallStartedFunc(data) {
        if (data.data[0].status !== 'success_uninstallstart') {
            console.error(new Error(data.data[0].message));
        }
    }

    ItemHandler_uninstallFinishedFunc(data) {
        if (data.data[0].status !== 'success_uninstall') {
            console.error(new Error(data.data[0].message));
        }
        //this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigInstalledItems', []);
        this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigUpdateAvailableItems', []);
    }

    UpdateHandler_updateStartedFunc(data) {
        if (!data.data[1]) {
            console.error(new Error('Item update failed'));
        }
    }

    UpdateHandler_updateFinishedFunc(data) {
        if (!data.data[1]) {
            console.error(new Error('Item update failed'));
        }
        this.ocsManagerWsApi.send('', 'ConfigHandler::getUsrConfigUpdateAvailableItems', []);
    }

    UpdateHandler_updateProgressFunc(data) {
        // update component
    }

}
