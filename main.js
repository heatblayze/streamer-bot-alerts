const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require("url");
const fs = require("fs");
const settings = require("./settings");
const isDev = require('electron-is-dev');

try {
    require('electron-reloader')(module)
} catch (_) { }

const mySettings = new settings();
var mainWindow;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        title: 'Streamer.bot Alerts',
        show: false,
        backgroundColor: '#202126'
    });
    win.setMenuBarVisibility(false);

    if (!isDev) {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, `/editor/dist/editor/index.html`),
                protocol: "file:",
                slashes: true
            })
        );
    } else {
        // Reload from the live server in dev mode
        win.loadURL("http://localhost:4200")
    }

    win.once('ready-to-show', () => {
        win.maximize();
        win.show();
    });

    win.webContents.on('did-fail-load', async () => {
        await win.loadFile(path.join(__dirname, `/editor/dist/editor/index.html`));
    });

    mainWindow = win;
};

function checkStreamerBotPath(pathname) {
    if (pathname) {
        if (fs.existsSync(pathname) && path.basename(pathname, path.extname(pathname)) == 'Streamer.bot') {
            return true;
        }
    } else {
        return false;
    }
}

app.whenReady().then(() => {
    ipcMain.handle('getSettings', function () {
        return mySettings.getRaw();
    });

    ipcMain.handle('checkStreamerBot', function () {
        let rawData = mySettings.getRaw();
        let data = JSON.parse(rawData);
        return checkStreamerBotPath(data.streamerBotPath);
    });

    ipcMain.handle('findStreamerBot', function () {
        let result = dialog.showOpenDialogSync(mainWindow, {
            properties: ['openFile', 'dontAddToRecent'],
            filters: { name: 'Streamer.bot Executable', extensions: ['exe'] },
            title: 'Locate Streamer.bot.exe'
        });
        if (result) {
            if (checkStreamerBotPath(result[0])) {
                let data = mySettings.get();
                data.streamerBotPath = result[0];
                mySettings.save(data);
                return true;
            }
            return false;
        } else {
            return false;
        }
    });

    ipcMain.handle('getStreamerBotSettings', function () {
        let settingsData = mySettings.get();
        if (settingsData) {
            let settingsPath = path.join(settingsData.streamerBotPath, '../', '/data/settings.json');
            return fs.readFileSync(settingsPath, "utf8");
        } else {
            return null;
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});