export default class OcsManagerTypeHandler {

    constructor(stateManager, ocsManagerApi, ipcRenderer) {
        this._stateManager = stateManager;
        this._ocsManagerApi = ocsManagerApi;
        this._ipcRenderer = ipcRenderer;

        this._updateCheckAfter = 86400000; // 1day (ms)
        this._previewpicDirectory = this._ipcRenderer.sendSync('previewpic', 'directory');
        this._installTypes = {};

        this._collectiondialogComponent = null;

        this._subscribe();
        this._receiveMessage();
    }

    _subscribe() {
        this._stateManager.actionHandler
            .add('ocsManager_activate', (data) => {
                this._collectiondialogComponent = data.component;
                return {isActivated: true};
            })
            .add('ocsManager_activate', async () => {
                if (await this._ocsManagerApi.connect()) {
                    let message = null;

                    message = await this._ocsManagerApi.sendSync('ConfigHandler::getAppConfigInstallTypes', []);
                    this._installTypes = message.data[0];

                    message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigApplication', []);
                    if (!message.data[0].update_checked_at
                        || (message.data[0].update_checked_at + this._updateCheckAfter) < new Date().getTime()
                    ) {
                        this._ocsManagerApi.send('UpdateHandler::checkAll', []);
                    }
                }
                return {};
            })
            .add('ocsManager_externalUrl', (data) => {
                this._ocsManagerApi.send('SystemHandler::openUrl', [data.url]);
                return false;
            })
            .add('ocsManager_ocsUrl', (data) => {
                this._ocsManagerApi.send('ItemHandler::getItemByOcsUrl', [data.url, data.providerKey, data.contentId]);
                return false;
            })
            .add('ocsManager_installedItems', async () => {
                const message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
                const installedItems = message.data[0];
                return {
                    installedItems: installedItems,
                    installTypes: this._installTypes,
                    previewpicDirectory: this._previewpicDirectory
                };
            })
            .add('ocsManager_installedItemsByType', async (data) => {
                const installType = data.installType;

                let message = null;

                message = await this._ocsManagerApi.sendSync('DesktopThemeHandler::isApplicableType', [installType]);
                const isApplicableType = message.data[0];

                message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
                const installedItems = message.data[0];

                const installedItemsByType = {};
                for (const [key, value] of Object.entries(installedItems)) {
                    if (value.install_type === installType) {
                        installedItemsByType[key] = value;
                    }
                }

                return {
                    installType: installType,
                    isApplicableType: isApplicableType,
                    installedItemsByType: installedItemsByType,
                    installTypes: this._installTypes,
                    previewpicDirectory: this._previewpicDirectory
                };
            })
            .add('ocsManager_updateAvailableItems', async () => {
                let message = null;

                message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
                const updateAvailableItems = message.data[0];

                message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
                const installedItems = message.data[0];

                return {
                    updateAvailableItems: updateAvailableItems,
                    installedItems: installedItems,
                    installTypes: this._installTypes,
                    previewpicDirectory: this._previewpicDirectory
                };
            })
            .add('ocsManager_downloading', async () => {
                const message = await this._ocsManagerApi.sendSync('ItemHandler::metadataSet', []);
                const metadataSet = message.data[0];
                return {
                    downloading: Object.keys(metadataSet).length,
                    metadataSet: metadataSet
                };
            })
            .add('ocsManager_uninstall', (data) => {
                this._ocsManagerApi.send('ItemHandler::uninstall', [data.itemKey]);
                // Remove preview pic
                this._ipcRenderer.sendSync('previewpic', 'remove', data.itemKey);
                return false;
            })
            .add('ocsManager_apply', (data) => {
                this._ocsManagerApi.send('DesktopThemeHandler::applyTheme', [data.path, data.installType]);
                return false;
            })
            .add('ocsManager_navigation', (data) => {
                switch (data.action) {
                    case 'collection':
                        this._collectiondialogComponent.open();
                        break;
                }
                return false;
            });
    }

    _receiveMessage() {
        this._ocsManagerApi.callback
            .set('ItemHandler::metadataSetChanged', () => {
                this._stateManager.dispatch('ocsManager_downloading', {});
            })
            .set('ItemHandler::downloadStarted', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_downloadstart') {
                    console.error(new Error(message.data[0].message));
                    return;
                }
                // Download preview pic
                if (message.data[0].metadata.command === 'install'
                    && message.data[0].metadata.provider && message.data[0].metadata.content_id
                ) {
                    const previewpicUrl = `${message.data[0].metadata.provider}content/previewpic/${message.data[0].metadata.content_id}`;
                    this._ipcRenderer.sendSync('previewpic', 'download', message.data[0].metadata.url, previewpicUrl);
                }
            })
            .set('ItemHandler::downloadFinished', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_download') {
                    console.error(new Error(message.data[0].message));
                }
            })
            .set('ItemHandler::downloadProgress', (message) => {
                console.log(message);
            })
            .set('ItemHandler::saveStarted', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_savestart') {
                    console.error(new Error(message.data[0].message));
                }
            })
            .set('ItemHandler::saveFinished', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_save') {
                    console.error(new Error(message.data[0].message));
                }
            })
            .set('ItemHandler::installStarted', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_installstart') {
                    console.error(new Error(message.data[0].message));
                }
            })
            .set('ItemHandler::installFinished', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_install') {
                    console.error(new Error(message.data[0].message));
                    return;
                }
                this._stateManager.dispatch('ocsManager_installedItems', {});
            })
            .set('ItemHandler::uninstallStarted', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_uninstallstart') {
                    console.error(new Error(message.data[0].message));
                }
            })
            .set('ItemHandler::uninstallFinished', (message) => {
                console.log(message);
                if (message.data[0].status !== 'success_uninstall') {
                    console.error(new Error(message.data[0].message));
                    return;
                }
                this._stateManager.dispatch('ocsManager_installedItems', {});
                this._stateManager.dispatch('ocsManager_updateAvailableItems', {});
            })
            .set('UpdateHandler::checkAllStarted', (message) => {
                console.log(message);
                if (!message.data[0]) {
                    console.error(new Error('Item update check failed'));
                }
            })
            .set('UpdateHandler::checkAllFinished', (message) => {
                console.log(message);
                if (!message.data[0]) {
                    console.error(new Error('Item update check failed'));
                    return;
                }
                this._stateManager.dispatch('ocsManager_updateAvailableItems', {});
            })
            .set('UpdateHandler::updateStarted', (message) => {
                console.log(message);
                if (!message.data[1]) {
                    console.error(new Error('Item update failed'));
                }
            })
            .set('UpdateHandler::updateFinished', (message) => {
                console.log(message);
                if (!message.data[1]) {
                    console.error(new Error('Item update failed'));
                    return;
                }
                this._stateManager.dispatch('ocsManager_installedItems', {});
                this._stateManager.dispatch('ocsManager_updateAvailableItems', {});
            })
            .set('UpdateHandler::updateProgress', (message) => {
                console.log(message);
            });
    }

}
