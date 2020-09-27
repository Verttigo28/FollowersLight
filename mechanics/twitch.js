const {ApiClient} = require("twitch")
const {ElectronAuthProvider} = require("twitch-electron-auth-provider")
const keys = require("../config/config.json")
const lightAPI = require("./lightAPI");
const {PubSubClient} = require("twitch-pubsub-client");
const pubSubClient = new PubSubClient();
const clientId = keys.clientId;
const redirectURI = "http://localhost/";

let onBits, onBitsBadgeUnlock, onModAction, onSubscription, started, userID, BridgeUser, busy;

exports.started = started;

async function loginTwitch() {
    const authProvider = new ElectronAuthProvider({
        clientId,
        redirectURI
    });

    const client = new ApiClient({
        authProvider
    });

    await client.getTokenInfo().then(data => {
        userID = data._data.user_id
    })

    return client;
}

exports.getUserID = async () => {
    await loginTwitch();
    return userID;
}


exports.start = async (data) => {
    await pubSubClient.registerUserListener(await loginTwitch());
    BridgeUser = data[0].BridgeUser;
    started = true;

    if (data[0].active) {
        onBits = await pubSubClient.onBits(userID, userID, bitsData => {
            let pipeline;
            if (bitsData.bits <= 10) {
                pipeline += 1;
            } else {
                pipeline += parseInt((bitsData.bits / 10), 10);
            }

            for (let i = 0; i < pipeline; i++) {
                lightAPI.changeLightColor(data[0].color.random, data[0].onBits.color.rgb, data[0].lightID, BridgeUser)
            }
        });
    }

    if (data[1].active) {
        onSubscription = await pubSubClient.onSubscription(userID, () => {
            lightAPI.changeLightColor(data[1].color.random, data[1].color.rgb, data[1].lightID, BridgeUser)
        });
    }

    /* Not working
    if (data[2].active) {
        onBitsBadgeUnlock = await pubSubClient.onBitsBadgeUnlock(userID, () => {
             lightAPI.changeLightColor(data[2].color.random, data[2].color.rgb, data[2].lightID, BridgeUser)
        });
    }
     */

    if (data[3].active) {
        onModAction = await pubSubClient.onModAction(userID, userID, () => {
            lightAPI.changeLightColor(data[3].color.random, data[3].color.rgb, data[3].lightID, BridgeUser)
        });
    }

}

exports.stop = () => {
    started = false;
    busy = false;
    lightAPI.turnOffLight(BridgeUser);
    onBitsBadgeUnlock.remove();
    onBits.remove();
    onModAction.remove();
    onSubscription.remove();
}


