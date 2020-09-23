const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        //MAIN
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["askBridgePairing", "askLights", "askTwitterApproval", "isTwitterRunning", "StartTwitterBot", "StopTwitterBot", "askStatusApp", "askForUpdates", "startUpdate"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        //RENDER
        receive: (channel, func) => {
            let validChannels = ["callbackBridge", "callBackLights", "callBackTwitter", "callbackTwitterRunning", "callBackTwitterBot", "callBackTwitterData", "callbackStatus", "callbackUpdates"];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);