"use strict"

const electron = require("electron")
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require("os")
const path = require("path")
const config = require(path.join(__dirname, "package.json"))
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;
const bridge = require("./mechanics/bridgepairing.js");
const twitter = require("./mechanics/twitter.js");
const keys = require("./config/config.json");
const light = require("./mechanics/getAllLights");
const auth = require("oauth-electron-twitter")
const {autoUpdater} = require("electron-updater");

let mainWindow = null;

require("electron-reload")(__dirname);
app.setName(config.productName)

autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    console.log('Update available.');
    let swalOptions = {
        title: "",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true
    };
    alert.fireWithFrame(swalOptions, "Delete file?", null, false);
})
autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.');
    mainWindow.webContents.send("callbackUpdates", false);
})
autoUpdater.on('error', (err) => {
    console.log('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded');
});

app.on('window-all-closed', () => {
    app.quit();
});


app.on("ready", function () {

    autoUpdater.checkForUpdatesAndNotify().then(r => console.log(r));

    mainWindow = new BrowserWindow({
        resizable: false,
        backgroundColor: "lightgray",
        height: 650,
        width: 1000,
        title: config.productName,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "/preload/preload.js"),
            defaultEncoding: "UTF-8"
        }
    })
    mainWindow.setFullScreen(false)
    mainWindow.setFullScreenable(false)
    mainWindow.loadURL(`file://${__dirname}/render/index.html`)

    // Enable keyboard shortcuts for Developer Tools on letious platforms.
    let platform = os.platform()
    if (platform === "darwin") {
        globalShortcut.register("Command+Option+I", () => {
            mainWindow.webContents.openDevTools()
        })
    } else if (platform === "linux" || platform === "win32") {
        globalShortcut.register("Control+Shift+I", () => {
            mainWindow.webContents.openDevTools()
        })
    }

    mainWindow.once("ready-to-show", () => {
        mainWindow.setMenu(null)
        mainWindow.show()
    })

    mainWindow.onbeforeunload = (e) => {
        // Prevent Command-R from unloading the window contents.
        e.returnValue = false
    }

    mainWindow.on("closed", function () {
        mainWindow = null
    })

    ipcMain.on("askLights", async (event, bridge) => {
        light.getAllLights(bridge).then((data) => {
            mainWindow.webContents.send("callBackLights", true, data);
        }).catch((err) => {
            mainWindow.webContents.send("callBackLights", false, err);
        })
    });

    ipcMain.on("askTwitterApproval", async (event) => {
        let info = {
                key: keys.consumer_key,
                secret: keys.consumer_secret
            },
            window = new BrowserWindow({webPreferences: {nodeIntegration: false}});
        auth.login(info, window).then((r) => {
            mainWindow.webContents.send("callBackTwitter", true, r);
            window.close();
        }).catch((err) => {
            mainWindow.webContents.send("callBackTwitter", false, err);
        })
    });

    ipcMain.on("askBridgePairing", async (event) => {
        bridge.discoverAndCreateUser().then((data) => {
            mainWindow.webContents.send("callbackBridge", true, data);
        }).catch((err) => {
            mainWindow.webContents.send("callbackBridge", false, err);
        });
    });

    ipcMain.on("isTwitterRunning", async (event) => {
        mainWindow.webContents.send("callbackTwitterRunning", true, twitter.started);
    });

    ipcMain.on("askStatusApp", async (event) => {
        let twitterStatus = twitter.getStatus();
        let data = {twitterStatus}
        mainWindow.webContents.send("callbackStatus", true, data);
    });

    ipcMain.on("StartTwitterBot", async (event, data) => {
        twitter.start(data.bridgeUser, data.Token, data.TokenSecret, data.light, data.twitterUser);
    });

    ipcMain.on("StopTwitterBot", async (event) => {
        twitter.stop();
        mainWindow.webContents.send("callBackTwitterBot", true, twitter.started);
    });

    const Alert = require("electron-alert");

    let alert = new Alert();


    ipcMain.on("askForUpdates", async (event) => {
        autoUpdater.checkForUpdatesAndNotify().then(r => {
            if(r === null) {

            }
        });

    });

})


app.on("window-all-closed", () => {
    app.quit()
})

exports.sendTwitterData = (success, data) => {
    mainWindow.webContents.send("callBackTwitterData", success, data);
}
