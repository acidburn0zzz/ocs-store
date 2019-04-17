export default class OcsManagerHandler {

    constructor(stateManager, ipcRenderer, ocsManagerApi) {
        this._stateManager = stateManager;
        this._ipcRenderer = ipcRenderer;
        this._ocsManagerApi = ocsManagerApi;

        this._previewpicDirectory = this._ipcRenderer.sendSync('previewpic', 'directory');
        this._installTypes = {};

        //this._webviewComponent = null;
        this._collectiondialogComponent = null;

        this._subscribe();
        this._receiveMessage();
    }

    _subscribe() {
        this._ipcRenderer.on('ocsManager_openUrl', (event, data) => {
            this._stateManager.dispatch('ocsManager_openUrl', data);
        });

        this._ipcRenderer.on('ocsManager_getItemByOcsUrl', (event, data) => {
            this._stateManager.dispatch('ocsManager_getItemByOcsUrl', data);
        });

        this._stateManager.actionHandler
            /*.add('webview_activate', (data) => {
                this._webviewComponent = data.component;
                return {isActivated: true};
            })*/
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
                    const updateCheckedAt = message.data[0].update_checked_at;

                    const updateCheckAfter = this._ipcRenderer.sendSync('app', 'config').updateCheckAfter;

                    if (!updateCheckedAt || (updateCheckedAt + updateCheckAfter) < new Date().getTime()) {
                        this._ocsManagerApi.send('UpdateHandler::checkAll', []);
                    }
                }
                return {};
            })
            .add('ocsManager_collection', (data) => {
                this._collectiondialogComponent.open(data.view || '');
                return false;
            })
            .add('ocsManager_openUrl', (data) => {
                this._ocsManagerApi.send('SystemHandler::openUrl', [data.url]);
                return false;
            })
            .add('ocsManager_getItemByOcsUrl', (data) => {
                this._ocsManagerApi.send('ItemHandler::getItemByOcsUrl', [data.url, data.providerKey, data.contentId]);
                return false;
            })
            .add('ocsManager_installedItems', async () => {
                const message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
                const installedItems = message.data[0];
                return {
                    previewpicDirectory: this._previewpicDirectory,
                    installTypes: this._installTypes,
                    installedItems: installedItems,
                    count: Object.keys(installedItems).length
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
                    previewpicDirectory: this._previewpicDirectory,
                    installTypes: this._installTypes,
                    installType: installType,
                    isApplicableType: isApplicableType,
                    installedItemsByType: installedItemsByType,
                    count: Object.keys(installedItemsByType).length
                };
            })
            .add('ocsManager_updateAvailableItems', async () => {
                let message = null;

                message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigUpdateAvailableItems', []);
                const updateAvailableItems = message.data[0];

                message = await this._ocsManagerApi.sendSync('ConfigHandler::getUsrConfigInstalledItems', []);
                const installedItems = message.data[0];

                const combinedUpdateAvailableItems = {};
                for (const value of Object.values(updateAvailableItems)) {
                    const itemKey = value.installed_item;
                    combinedUpdateAvailableItems[itemKey] = installedItems[itemKey];
                }

                return {
                    previewpicDirectory: this._previewpicDirectory,
                    installTypes: this._installTypes,
                    updateAvailableItems: combinedUpdateAvailableItems,
                    count: Object.keys(combinedUpdateAvailableItems).length
                };
            })
            .add('ocsManager_metadataSet', async () => {
                const message = await this._ocsManagerApi.sendSync('ItemHandler::metadataSet', []);
                const metadataSet = message.data[0];
                return {
                    metadataSet: metadataSet,
                    count: Object.keys(metadataSet).length
                };
            })
            .add('ocsManager_installing', (data) => {
                return {
                    status: data.status,
                    message: data.message,
                    metadata: data.metadata
                };
            })
            .add('ocsManager_downloadProgress', (data) => {
                return {
                    url: data.url,
                    bytesReceived: data.bytesReceived,
                    bytesTotal: data.bytesTotal
                };
            })
            .add('ocsManager_uninstall', (data) => {
                this._ocsManagerApi.send('ItemHandler::uninstall', [data.itemKey]);

                // Remove preview picture
                this._ipcRenderer.sendSync('previewpic', 'remove', data.itemKey);

                return false;
            })
            .add('ocsManager_update', (data) => {
                this._ocsManagerApi.send('UpdateHandler::update', [data.itemKey]);
                return false;
            })
            .add('ocsManager_updateProgress', (data) => {
                return {
                    itemKey: data.itemKey,
                    progress: data.progress
                };
            })
            .add('ocsManager_applyTheme', (data) => {
                this._ocsManagerApi.send('DesktopThemeHandler::applyTheme', [data.path, data.installType]);
                return false;
            });
    }

    _receiveMessage() {
        this._ocsManagerApi.callback
            .set('ItemHandler::metadataSetChanged', () => {
                this._stateManager.dispatch('ocsManager_metadataSet', {});
            })
            .set('ItemHandler::downloadStarted', (message) => {
                if (message.data[0].status !== 'success_downloadstart') {
                    console.error(new Error(message.data[0].message));
                }

                this._stateManager.dispatch('ocsManager_installing', {
                    status: message.data[0].status,
                    message: message.data[0].message,
                    metadata: message.data[0].metadata
                });

                // Download preview picture
                this._ipcRenderer.sendSync('previewpic', 'download', message.data[0].metadata.url);
            })
            .set('ItemHandler::downloadFinished', (message) => {
                if (message.data[0].status !== 'success_download') {
                    console.error(new Error(message.data[0].message));
                }
                this._stateManager.dispatch('ocsManager_installing', {
                    status: message.data[0].status,
                    message: message.data[0].message,
                    metadata: message.data[0].metadata
                });
            })
            .set('ItemHandler::downloadProgress', (message) => {
                this._stateManager.dispatch('ocsManager_downloadProgress', {
                    url: message.data[0],
                    bytesReceived: message.data[1],
                    bytesTotal: message.data[2]
                });
            })
            .set('ItemHandler::saveStarted', (message) => {
                if (message.data[0].status !== 'success_savestart') {
                    console.error(new Error(message.data[0].message));
                }
                this._stateManager.dispatch('ocsManager_installing', {
                    status: message.data[0].status,
                    message: message.data[0].message,
                    metadata: message.data[0].metadata
                });
            })
            .set('ItemHandler::saveFinished', (message) => {
                if (message.data[0].status !== 'success_save') {
                    console.error(new Error(message.data[0].message));
                }
                this._stateManager.dispatch('ocsManager_installing', {
                    status: message.data[0].status,
                    message: message.data[0].message,
                    metadata: message.data[0].metadata
                });
            })
            .set('ItemHandler::installStarted', (message) => {
                if (message.data[0].status !== 'success_installstart') {
                    console.error(new Error(message.data[0].message));
                }
                this._stateManager.dispatch('ocsManager_installing', {
                    status: message.data[0].status,
                    message: message.data[0].message,
                    metadata: message.data[0].metadata
                });
            })
            .set('ItemHandler::installFinished', (message) => {
                if (message.data[0].status !== 'success_install') {
                    console.error(new Error(message.data[0].message));
                }
                this._stateManager.dispatch('ocsManager_installing', {
                    status: message.data[0].status,
                    message: message.data[0].message,
                    metadata: message.data[0].metadata
                });
                this._stateManager.dispatch('ocsManager_installedItems', {});
            })
            .set('ItemHandler::uninstallStarted', (message) => {
                if (message.data[0].status !== 'success_uninstallstart') {
                    console.error(new Error(message.data[0].message));
                }
            })
            .set('ItemHandler::uninstallFinished', (message) => {
                if (message.data[0].status !== 'success_uninstall') {
                    console.error(new Error(message.data[0].message));
                }
                this._stateManager.dispatch('ocsManager_installedItems', {});
                this._stateManager.dispatch('ocsManager_updateAvailableItems', {});
            })
            .set('UpdateHandler::checkAllStarted', (message) => {
                if (!message.data[0]) {
                    console.error(new Error('Item update check failed'));
                }
            })
            .set('UpdateHandler::checkAllFinished', (message) => {
                if (!message.data[0]) {
                    console.error(new Error('Item update check failed'));
                }
                this._stateManager.dispatch('ocsManager_updateAvailableItems', {});
            })
            .set('UpdateHandler::updateStarted', (message) => {
                if (!message.data[1]) {
                    console.error(new Error('Item update failed'));
                }
            })
            .set('UpdateHandler::updateFinished', (message) => {
                if (!message.data[1]) {
                    console.error(new Error('Item update failed'));
                }
                this._stateManager.dispatch('ocsManager_installedItems', {});
                this._stateManager.dispatch('ocsManager_updateAvailableItems', {});
            })
            .set('UpdateHandler::updateProgress', (message) => {
                this._stateManager.dispatch('ocsManager_updateProgress', {
                    itemKey: message.data[0],
                    progress: message.data[1]
                });
            });
    }

}
