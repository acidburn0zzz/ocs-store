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

let topWindow = null;
let ocsManager = null;
let ocsManagerUrl = '';

async function startOcsManager() {
    return new Promise((resolve) => {
        let url = '';

        const resolveUrl = (data) => {
            const matches = data.toString()
                .match(/Websocket server started at: "(wss?:\/\/.+)"/);
            if (matches) {
                url = matches[1];
                resolve(url);
            }
        };

        ocsManager = spawn(ocsManagerConfig.bin, ['-p', ocsManagerConfig.port]);

        ocsManager.stdout.on('data', (data) => {
            console.log(`[${ocsManagerConfig.bin}] ${data}`);
            if (!url) {
                resolveUrl(data);
            }
        });

        ocsManager.stderr.on('data', (data) => {
            console.error(`[${ocsManagerConfig.bin}] ${data}`);
            if (!url) {
                resolveUrl(data);
            }
        });

        ocsManager.on('close', (code) => {
            console.log(`${ocsManagerConfig.bin} exited with code ${code}`);
        });

        ocsManager.on('error', () => {
            console.error(`Failed to start ${ocsManagerConfig.bin}`);
            resolve(url);
        });
    });
}

function stopOcsManager() {
    if (ocsManager) {
        ocsManager.kill();
    }
}

function createWindow() {
    const appConfigStore = new ElectronStore({
        name: 'application',
        defaults: appConfig.defaults
    });

    const windowBounds = appConfigStore.get('windowBounds');

    topWindow = new BrowserWindow({
        title: appPackage.productName,
        icon: `${__dirname}/images/app-icons/ocs-store.png`,
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

    topWindow.loadURL(`file://${__dirname}/index.html`);

    if (isDebugMode) {
        topWindow.webContents.openDevTools();
    }

    topWindow.on('close', () => {
        const appConfigStore = new ElectronStore({name: 'application'});
        appConfigStore.set('windowBounds', topWindow.getBounds());
    });

    topWindow.on('closed', () => {
        topWindow = null;
    });
}

function isFile(path) {
    try {
        const stats = fs.statSync(path);
        if (stats.isFile()) {
            return true;
        }
    }
    catch (error) {
        console.error(error);
    }
    return false;
}

function isDirectory(path) {
    try {
        const stats = fs.statSync(path);
        if (stats.isDirectory()) {
            return true;
        }
    }
    catch (error) {
        console.error(error);
    }
    return false;
}

function btoa(string) {
    const buffer = (string instanceof Buffer) ? string : Buffer.from(string.toString(), 'binary');
    return buffer.toString('base64');
}

/*function atob(string) {
    return Buffer.from(string, 'base64').toString('binary');
}*/

function previewpicFilename(itemKey) {
    // "itemKey" will be URL of product file
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
    ocsManagerUrl = await startOcsManager();
    createWindow();
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

ipcMain.on('store-application', (event, key, value) => {
    const appConfigStore = new ElectronStore({name: 'application'});
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
