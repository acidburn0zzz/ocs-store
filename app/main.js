const fs = require('fs');
const {spawn} = require('child_process');

const {app, BrowserWindow, ipcMain} = require('electron');
const ElectronStore = require('electron-store');
const request = require('request');

const appPackage = require('../package.json');
const appConfig = require('./configs/application.json');
const ocsManagerConfig = require('./configs/ocs-manager.json');

const isDebugMode = process.argv.includes('--debug');
const previewpicDirectory = `${app.getPath('userData')}/previewpic`;
const windowIcon = `${__dirname}/images/app-icons/ocs-store.png`;
const indexFileUrl = `file://${__dirname}/index.html`;
const storeAppConfigStorage = 'application';

let topWindow = null;
let ocsManager = null;
let ocsManagerUrl = '';

async function startOcsManager() {
    return new Promise((resolve) => {
        const resolveUrl = (data) => {
            const matches = data.toString()
                .match(/Websocket server started at: "(wss?:\/\/.+)"/);
            if (matches) {
                ocsManagerUrl = matches[1];
                resolve(true);
            }
        };

        ocsManager = spawn(ocsManagerConfig.bin, ['-p', ocsManagerConfig.port]);

        ocsManager.stdout.on('data', (data) => {
            console.log(`[${ocsManagerConfig.bin}] ${data}`);
            if (!ocsManagerUrl) {
                resolveUrl(data);
            }
        });

        ocsManager.stderr.on('data', (data) => {
            console.error(`[${ocsManagerConfig.bin}] ${data}`);
            if (!ocsManagerUrl) {
                resolveUrl(data);
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
        ocsManagerUrl = '';
    }
}

function createWindow() {
    const appConfigStore = new ElectronStore({
        name: storeAppConfigStorage,
        defaults: appConfig.defaults
    });

    const windowBounds = appConfigStore.get('windowBounds');

    topWindow = new BrowserWindow({
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

    if (!isDebugMode) {
        topWindow.setMenu(null);
    }

    topWindow.loadURL(indexFileUrl);

    topWindow.on('close', () => {
        const appConfigStore = new ElectronStore({name: storeAppConfigStorage});
        appConfigStore.set('windowBounds', topWindow.getBounds());
    });

    topWindow.on('closed', () => {
        topWindow = null;
    });

    if (isDebugMode) {
        topWindow.webContents.openDevTools();
    }
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

/*function atob(string) {
    return Buffer.from(string, 'base64').toString('binary');
}*/

function previewpicFilename(itemKey) {
    // "itemKey" will be URL to product file
    return btoa(itemKey).slice(-255);
}

function downloadPreviewpic(itemKey, url) {
    if (!isDirectory(previewpicDirectory)) {
        fs.mkdirSync(previewpicDirectory);
    }
    const path = `${previewpicDirectory}/${previewpicFilename(itemKey)}`;
    request.get(url)
        .on('error', (error) => {
            console.error(error);
        })
        .pipe(fs.createWriteStream(path));
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
    if (topWindow === null) {
        createWindow();
    }
});

app.on('web-contents-created', (event, webContents) => {
    if (webContents.getType() === 'webview') {
        webContents.on('will-navigate', (event, url) => {
            if (url.startsWith('ocs://') || url.startsWith('ocss://')) {
                // Cancel ocs protocol navigation
                event.preventDefault();
            }
        });
    }
});

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
    const appConfigStore = new ElectronStore({name: storeAppConfigStorage});
    if (key && value) {
        appConfigStore.set(key, value);
    }
    event.returnValue = key ? appConfigStore.get(key) : appConfigStore.store;
});

ipcMain.on('previewpic', (event, action, itemKey, url) => {
    if (action === 'directory') {
        event.returnValue = previewpicDirectory;
    }
    else if (action === 'path' && itemKey) {
        event.returnValue = `${previewpicDirectory}/${previewpicFilename(itemKey)}`;
    }
    else if (action === 'download' && itemKey && url) {
        downloadPreviewpic(itemKey, url);
        event.returnValue = undefined;
    }
    else if (action === 'remove' && itemKey) {
        removePreviewpic(itemKey);
        event.returnValue = undefined;
    }
    else {
        event.returnValue = false;
    }
});
