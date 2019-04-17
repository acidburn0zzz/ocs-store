const fs = require('fs');
const {spawn} = require('child_process');

const {app, BrowserWindow, BrowserView, ipcMain} = require('electron');
const ElectronStore = require('electron-store');
const request = require('request');

const appPackage = require('../package.json');
const appConfig = require('./configs/application.json');
const ocsManagerConfig = require('./configs/ocs-manager.json');

const isDebugMode = process.argv.includes('--debug');
const previewpicDirectory = `${app.getPath('userData')}/previewpic`;
const windowIcon = `${__dirname}/images/app-icons/ocs-store.png`;
const windowIndexFileUrl = `file://${__dirname}/index.html`;
const viewSessionPartition = 'persist:opendesktop';
const viewPreloadScript = `${__dirname}/scripts/renderers/browser-view.js`;
const appConfigStoreStorage = 'application';

let mainWindow = null;
let mainView = null;
let ocsManager = null;
let ocsManagerUrl = '';

async function startOcsManager() {
    return new Promise((resolve) => {
        const resolveOcsManagerUrl = (data) => {
            const matches = data.toString().match(/Websocket server started at: "(wss?:\/\/.+)"/);
            if (matches) {
                ocsManagerUrl = matches[1];
                resolve(true);
            }
        };

        ocsManager = spawn(ocsManagerConfig.bin, ['-p', ocsManagerConfig.port]);

        ocsManager.stdout.on('data', (data) => {
            console.log(`[${ocsManagerConfig.bin}] ${data}`);
            if (!ocsManagerUrl) {
                resolveOcsManagerUrl(data);
            }
        });

        ocsManager.stderr.on('data', (data) => {
            console.error(`[${ocsManagerConfig.bin}] ${data}`);
            if (!ocsManagerUrl) {
                resolveOcsManagerUrl(data);
            }
        });

        ocsManager.on('close', (code) => {
            console.log(`${ocsManagerConfig.bin} exited with code ${code}`);
        });

        ocsManager.on('error', () => {
            console.error(`Failed to start ${ocsManagerConfig.bin}`);
            resolve(false);
        });
    });
}

function stopOcsManager() {
    if (ocsManager) {
        ocsManager.kill();
        ocsManager = null;
        ocsManagerUrl = '';
    }
}

function createWindow() {
    const appConfigStore = new ElectronStore({
        name: appConfigStoreStorage,
        defaults: appConfig.defaults
    });

    const windowBounds = appConfigStore.get('windowBounds');

    mainWindow = new BrowserWindow({
        title: appPackage.productName,
        icon: windowIcon,
        x: windowBounds.x,
        y: windowBounds.y,
        width: windowBounds.width,
        height: windowBounds.height,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.on('close', () => {
        const appConfigStore = new ElectronStore({name: appConfigStoreStorage});
        appConfigStore.set('windowBounds', mainWindow.getBounds());
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (mainView) {
            mainView.destroy();
            mainView = null;
        }
    });

    if (isDebugMode) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }
    else {
        mainWindow.setMenu(null);
    }

    mainWindow.loadURL(windowIndexFileUrl);

    createView();
}

function createView() {
    const detectOcsApiInfo = (url) => {
        // Detect provider key and content id from page url
        // https://www.opendesktop.org/s/Gnome/p/123456789/?key=val#hash
        //
        // providerKey = https://www.opendesktop.org/ocs/v1/
        // contentId = 123456789
        const info = {
            providerKey: '',
            contentId: ''
        };
        const matches = url.match(/(https?:\/\/[^/]+).*\/p\/([^/?#]+)/);
        if (matches) {
            info.providerKey = `${matches[1]}/ocs/v1/`;
            info.contentId = matches[2];
        }
        return info;
    };

    mainView = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            partition: viewSessionPartition,
            preload: viewPreloadScript
        }
    });

    mainWindow.setBrowserView(mainView);

    const toolbarHeight = 40;
    const windowBounds = mainWindow.getBounds();
    mainView.setBounds({
        x: 0,
        y: toolbarHeight,
        width: windowBounds.width,
        height: windowBounds.height - toolbarHeight
    });

    mainView.setAutoResize({
        width: true,
        height: true
    });

    mainView.webContents.on('did-start-loading', () => {
        mainWindow.webContents.send('browserView_loading', {isLoading: true});
    });

    mainView.webContents.on('did-stop-loading', () => {
        mainWindow.webContents.send('browserView_loading', {isLoading: false});
    });

    mainView.webContents.on('dom-ready', () => {
        mainWindow.webContents.send('browserView_page', {
            url: mainView.webContents.getURL(),
            title: mainView.webContents.getTitle(),
            canGoBack: mainView.webContents.canGoBack(),
            canGoForward: mainView.webContents.canGoForward()
        });

        if (isDebugMode) {
            mainView.webContents.openDevTools({mode: 'detach'});
        }

        mainView.webContents.send('ipcMessage');
    });

    mainView.webContents.on('new-window', (event, url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            event.preventDefault();
            mainWindow.webContents.send('ocsManager_openUrl', {url: url});
        }
    });

    mainView.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith('ocs://') || url.startsWith('ocss://')) {
            event.preventDefault();
            const info = detectOcsApiInfo(mainView.webContents.getURL());
            mainWindow.webContents.send('ocsManager_getItemByOcsUrl', {url: url, ...info});
        }
    });

    ipcMain.on('browserView_loadUrl', (event, url) => {
        mainView.webContents.loadURL(url);
        event.returnValue = undefined;
    });

    ipcMain.on('browserView_getUrl', (event) => {
        event.returnValue = mainView.webContents.getURL();
    });

    ipcMain.on('browserView_getTitle', (event) => {
        event.returnValue = mainView.webContents.getTitle();
    });

    ipcMain.on('browserView_goBack', (event) => {
        mainView.webContents.goBack();
        event.returnValue = undefined;
    });

    ipcMain.on('browserView_goForward', (event) => {
        mainView.webContents.goForward();
        event.returnValue = undefined;
    });

    ipcMain.on('browserView_reload', (event) => {
        mainView.webContents.reload();
        event.returnValue = undefined;
    });

    ipcMain.on('browserView_stop', (event) => {
        mainView.webContents.stop();
        event.returnValue = undefined;
    });

    ipcMain.on('browserView_executeJavaScript', (event, ...args) => {
        mainView.webContents.executeJavaScript(...args);
        event.returnValue = undefined;
    });

    //ipcMain.on('ipcMessage', (event) => {});

    const appConfigStore = new ElectronStore({name: appConfigStoreStorage});
    const startPage = appConfigStore.get('startPage');

    mainView.webContents.loadURL(startPage);
}

function isFile(path) {
    try {
        const stats = fs.statSync(path);
        return stats.isFile();
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

function isDirectory(path) {
    try {
        const stats = fs.statSync(path);
        return stats.isDirectory();
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

function btoa(string) {
    const buffer = (string instanceof Buffer) ? string : Buffer.from(string.toString(), 'binary');
    return buffer.toString('base64');
}

//function atob(string) {
//    return Buffer.from(string, 'base64').toString('binary');
//}

function previewpicFilename(itemKey) {
    // "itemKey" will be URL to product file
    return btoa(itemKey).slice(-255);
}

function downloadPreviewpic(itemKey, url) {
    if (!isDirectory(previewpicDirectory)) {
        fs.mkdirSync(previewpicDirectory);
    }
    const path = `${previewpicDirectory}/${previewpicFilename(itemKey)}`;
    request.get(url).on('error', (error) => {
        console.error(error);
    }).pipe(fs.createWriteStream(path));
}

function removePreviewpic(itemKey) {
    const path = `${previewpicDirectory}/${previewpicFilename(itemKey)}`;
    if (isFile(path)) {
        fs.unlinkSync(path);
    }
}

app.on('ready', async () => {
    if (await startOcsManager()) {
        createWindow();
    }
    else {
        app.quit();
    }
});

app.on('quit', () => {
    stopOcsManager();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

/*app.on('web-contents-created', (event, webContents) => {
    if (webContents.getType() === 'webview') {
        webContents.on('will-navigate', (event, url) => {
            if (url.startsWith('ocs://') || url.startsWith('ocss://')) {
                // Cancel ocs protocol navigation
                event.preventDefault();
            }
        });
    }
});*/

ipcMain.on('app', (event, key) => {
    const data = {
        package: appPackage,
        config: appConfig,
        isDebugMode: isDebugMode
    };
    event.returnValue = key ? data[key] : data;
});

ipcMain.on('ocs-manager', (event, key) => {
    const data = {
        config: ocsManagerConfig,
        url: ocsManagerUrl
    };
    event.returnValue = key ? data[key] : data;
});

ipcMain.on('store', (event, key, value) => {
    const appConfigStore = new ElectronStore({name: appConfigStoreStorage});
    if (key && value) {
        appConfigStore.set(key, value);
    }
    event.returnValue = key ? appConfigStore.get(key) : appConfigStore.store;
});

ipcMain.on('previewpic', (event, kind, itemKey, url) => {
    if (kind === 'directory') {
        event.returnValue = previewpicDirectory;
    }
    else if (kind === 'path' && itemKey) {
        event.returnValue = `${previewpicDirectory}/${previewpicFilename(itemKey)}`;
    }
    else if (kind === 'download' && itemKey && url) {
        downloadPreviewpic(itemKey, url);
        event.returnValue = undefined;
    }
    else if (kind === 'remove' && itemKey) {
        removePreviewpic(itemKey);
        event.returnValue = undefined;
    }
    else {
        event.returnValue = false;
    }
});
