const BrowserWindow = global.electron.BrowserWindow;
const ipcMain = global.electron.ipcMain;
const bridge = require("./bridgepairing.js");
const twitter = require("./twitter.js");
const keys = require("../config/config.json");
const light = require("./getAllLights");
const auth = require("oauth-electron-twitter")

let mainWindow = global.mainWindow;


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
    global.mainWindow.webContents.send("callbackStatus", true, data);
});

ipcMain.on("StartTwitterBot", async (event, data) => {
    twitter.start(data.bridgeUser, data.Token, data.TokenSecret, data.light, data.twitterUser);
});

ipcMain.on("StopTwitterBot", async (event) => {
    twitter.stop();
    mainWindow.webContents.send("callBackTwitterBot", true, twitter.started);
});

exports.sendTwitterData = (success, data) => {
    mainWindow.webContents.send("callBackTwitterData", success, data);
}

exports.sendNoUpdate = () => {
    mainWindow.webContents.send("callbackUpdate", false);
}
