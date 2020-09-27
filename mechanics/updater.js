const {autoUpdater} = require("electron-updater");
const ipcMain = global.electron.ipcMain;
const app = global.electron.app;
const BrowserWindow = global.electron.BrowserWindow;
const listener = require("../mechanics/listener");

let updater;

autoUpdater.autoDownload = false
autoUpdater.fullChangelog = true;

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
    updater.on("closed", () => {
        updater = null;
    });
    updater.loadURL(`file://${__dirname}/render/version.html`);
    return updater;
}

ipcMain.on("askForUpdate", async () => {
    autoUpdater.checkForUpdates();
    createUpdaterWindows();
});

autoUpdater.on("error", (error) => {
    updater.webContents.send("error", "Error: ", error == null ? "unknown" : (error.stack || error).toString());
})

autoUpdater.on("update-available", (info) => {
    updater.webContents.send("newUpdate", info);
})

autoUpdater.on("update-not-available", () => {
    listener.sendNoUpdate();
})

autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on("download-progress", (progressObj) => {
    updater.webContents.send("progressBar", progressObj);
})


app.on('ready',  () => {

    updater.webContents.receive("okForUpdate", (boolean) => {
        if (boolean) autoUpdater.downloadUpdate();
    });
    updater.webContents.receive("close", (boolean) => {
        if (boolean) updater.close();
    });
});


