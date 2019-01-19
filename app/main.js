const {spawn} = require('child_process');

const {app, BrowserWindow} = require('electron');
const ElectronStore = require('electron-store');

const packageMeta = require('../package.json');
const appConfig = require('./configs/application.json');
const ocsManagerConfig = require('./configs/ocs-manager.json');

const isDebugMode = process.argv.includes('--debug');

let topWindow = null;
let ocsManager = null;

function startOcsManager() {
    ocsManager = spawn(ocsManagerConfig.bin, ['-p', ocsManagerConfig.port]);

    ocsManager.on('close', (code) => {
        console.log(`${ocsManagerConfig.bin} exited with code ${code}`);
    });

    ocsManager.on('error', () => {
        console.error(`Failed to start ${ocsManagerConfig.bin}`);
    });

    ocsManager.stdout.on('data', (data) => {
        console.log(`[${ocsManagerConfig.bin}] ${data}`);
    });

    ocsManager.stderr.on('data', (data) => {
        console.error(`[${ocsManagerConfig.bin}] ${data}`);
    });
}

function stopOcsManager() {
    if (ocsManager) {
        ocsManager.kill();
    }
}

function createWindow() {
    const store = new ElectronStore({
        name: 'application',
        defaults: appConfig.defaults
    });

    const windowBounds = store.get('windowBounds');

    topWindow = new BrowserWindow({
        title: packageMeta.productName,
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
        const store = new ElectronStore({name: 'application'});
        store.set('windowBounds', topWindow.getBounds());
    });

    topWindow.on('closed', () => {
        topWindow = null;
    });
}

app.on('ready', () => {
    startOcsManager();
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
