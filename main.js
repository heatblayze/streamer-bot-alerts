const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require("url");
const settings = require("./settings");

const mySettings = new settings();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        title: 'Streamer.bot Alerts'
    });
    win.maximize();
    win.setMenuBarVisibility(false);
    //win.removeMenu();

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/editor/dist/editor/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    win.webContents.on('did-fail-load', async () => {
        await win.loadFile(path.join(__dirname, `/editor/dist/editor/index.html`));
    });
};

app.whenReady().then(() => {
    ipcMain.handle('getSettings', function () {
        return mySettings.get();
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});