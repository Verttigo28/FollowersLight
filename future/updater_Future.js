const {autoUpdater} = require("electron-updater");
const app = global.electron.app;
const BrowserWindow = global.electron.BrowserWindow;
const ipcMain = global.electron.ipcMain;
const listener = require("../mechanics/listener")

let updater;

function createUpdaterWindows() {
    updater = new BrowserWindow({
        resizable: false,
        backgroundColor: "lightgray",
        height: 500,
        width: 690,
        title: "Followers light updater",
        webPreferences: {
            nodeIntegration: true
        }
    });
    updater.on('closed', () => {
        updater = null;
    });
    updater.loadURL(`file://${__dirname}/render/version.html`);
    return updater;
}


autoUpdater.on('update-available', (info) => {
    updater.webContents.send('newUpdate', info);
    createUpdaterWindows();
})

autoUpdater.on('update-not-available', () => {
    listener.sendNoUpdate();
})

autoUpdater.on('error', (err) => {
    updater.webContents.send('error', err);
})

autoUpdater.on('download-progress', (progressObj) => {
    updater.webContents.send('progressBar', progressObj);
})

autoUpdater.on('update-downloaded', (info) => {
    updater.webContents.send('updateDownloaded', info);
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', function()  {
    autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on("askForUpdates", async (event) => {
    autoUpdater.checkForUpdatesAndNotify();
});
