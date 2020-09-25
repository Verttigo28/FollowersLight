const electron = require("electron")
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require("os")
const path = require("path")
const config = require(path.join(__dirname, "package.json"))
const BrowserWindow = electron.BrowserWindow

let mainWindow = null;
global.electron = electron;
require("electron-reload")(__dirname)
app.setName(config.productName)


app.on("ready", function () {

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

    mainWindow.on("closed", function () {
        mainWindow = null
    })

    global.mainWindow = mainWindow;
    require("./mechanics/listener");
    require("./mechanics/updater");


})

app.on("window-all-closed", () => {
    app.quit()
})





