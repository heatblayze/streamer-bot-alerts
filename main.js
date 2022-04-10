const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require("url");

const createWindow = () => {
    const win = new BrowserWindow({
        fullscreen: true
    });

    win.loadURL(
        url.format({
          pathname: path.join(__dirname, `/editor/dist/editor/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});