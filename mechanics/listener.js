const BrowserWindow = global.electron.BrowserWindow;
const ipcMain = global.electron.ipcMain;
const bridge = require("./bridgepairing.js");
const twitter = require("./twitter.js");
const insta = require("./instagram.js");
const twitch = require("./twitch.js");
const keys = require("../config/config.json");
const lightAPI = require("./lightAPI");
const auth = require("oauth-electron-twitter")

let mainWindow = global.mainWindow;


ipcMain.on("askLights", async (event, bridge) => {
    lightAPI.getAllLights(bridge).then((data) => {
        mainWindow.webContents.send("callBackLights", true, data);
    }).catch((err) => {
        mainWindow.webContents.send("error", err, "light");
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
        mainWindow.webContents.send("error", err, "twitter");
    })
});

ipcMain.on("askBridgePairing", async (event) => {
    bridge.discoverAndCreateUser().then((data) => {
        mainWindow.webContents.send("callbackBridge", true, data);
    }).catch((err) => {
        mainWindow.webContents.send("error", err, "bridge");
    });
});

ipcMain.on("isTwitterRunning", async (event) => {
    mainWindow.webContents.send("callbackTwitterRunning", true, twitter.getStatus());
});

ipcMain.on("isInstaRunning", async (event) => {
    mainWindow.webContents.send("callbackInstaRunning", true, insta.getStatus());
});

ipcMain.on("isTwitchRunning", async (event) => {
    mainWindow.webContents.send("callbackTwitchRunning", true, twitch.getStatus());
});

ipcMain.on("askStatusApp", async (event) => {
    let twitterStatus = twitter.getStatus();
    let instaStatus = insta.getStatus();
    let twitchStatus = twitch.getStatus();
    let data = {twitterStatus, instaStatus, twitchStatus}
    mainWindow.webContents.send("callbackStatus", true, data);
});

ipcMain.on("StartTwitterBot", async (event, data) => {
    twitter.start(data).catch((err) => sendError(err, "Twitter Bot"));
});

ipcMain.on("StopTwitterBot", async (event) => {
    twitter.stop().catch((err) => sendError(err, "Twitter Bot"));
});

ipcMain.on("StartTwitchBot", async (event, data) => {
    twitch.start(data).catch((err) => sendError(err, "Twitch Bot"));
});

ipcMain.on("StopTwitchBot", async (event) => {
    twitch.stop().catch((err) => sendError(err, "Twitch Bot"));
});

ipcMain.on("StartInstaBot", async (event, data) => {
    insta.start(data).catch((err) => sendError(err, "Instagram Bot"));
});

ipcMain.on("StopInstaBot", async (event) => {
    insta.stop().catch((err) => sendError(err, "Insta Bot"));
});

ipcMain.on("askTwitchConnexion", async (event) => {
    twitch.getUserID().then((userID) => {
        if (userID === undefined) {
            mainWindow.webContents.send("callBackTwitchConnexion", false, null);
        } else {
            mainWindow.webContents.send("callBackTwitchConnexion", true, userID);
        }

    });
});

exports.sendTwitterData = (success, data) => {
    mainWindow.webContents.send("callBackTwitterData", success, data);
}

exports.sendInstaData = (success, data) => {
    mainWindow.webContents.send("callBackInstaData", success, data);
}

exports.sendNoUpdate = () => {
    mainWindow.webContents.send("callbackUpdate", false);
}

function sendError(error, type) {
    mainWindow.webContents.send("error", error, type);
}

exports.sendErrorT = (error, type) =>{
    mainWindow.webContents.send("error", error, type);
}


