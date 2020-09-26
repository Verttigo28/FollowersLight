const {BrowserWindow, app} = require("electron")
const path = require("path")
const {ApiClient} = require("twitch")
const {ElectronAuthProvider} = require("twitch-electron-auth-provider")
const config = require(path.join(__dirname, "package.json"))

let mainWindow = null;
app.setName(config.productName)

const clientId = "k0ap572penlra4r12dy6nzzezid9on";
const redirectURI = "http://localhost/";

const {PubSubClient} = require("twitch-pubsub-client");
const pubSubClient = new PubSubClient();

app.on("ready", async () => {

    mainWindow = new BrowserWindow({
        resizable: false,
        title: config.productName,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.once("ready-to-show", () => {
        mainWindow.setMenu(null)
        mainWindow.show()
    })

    mainWindow.on("closed", function () {
        mainWindow = null
    })

    const authProvider = new ElectronAuthProvider({
        clientId,
        redirectURI
    });

    const client = new ApiClient({
        authProvider
    });

    await pubSubClient.registerUserListener(client);

    function getID() {
        return new Promise(resolve => {
            client.helix.users.getUserByName("Verttigoestdejapris").then(async (userObject) => {
                resolve(userObject._data.id);
            })
        });
    }

    let userID = await getID();

    const test1 = await pubSubClient.onSubscription(userID, data => {
        console.log(`${data.userDisplayName} just subscribed!`);
    });

    const test2 = await pubSubClient.onModAction(userID, userID, test => {
        console.log(test)
    });

    console.log(userID)


});
