const {autoUpdater} = require("electron-updater");
const ipcMain = global.electron.ipcMain;
const { dialog } = require('electron')

autoUpdater.autoDownload = false

autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
            autoUpdater.downloadUpdate()
})

autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
        title: 'No Updates',
        message: 'Current version is up-to-date.'
    })
})

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...'
    }, () => {
        setImmediate(() => autoUpdater.quitAndInstall())
    })
})

autoUpdater.on('download-progress', (progressObj) => {
    if(progressObj.percent == 1 || progressObj.percent == 10 || progressObj.percent == 50 || progressObj.percent == 100) {
        dialog.showMessageBox({
            title: 'Update',
            message: progressObj.progressBar
        })
    }
})

ipcMain.on("askForUpdate", async (event) => {
    autoUpdater.checkForUpdates();
});
