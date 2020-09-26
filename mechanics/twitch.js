const {ApiClient} = require("twitch")
const {ElectronAuthProvider} = require("twitch-electron-auth-provider")
const keys = require("../config/config.json")
const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;
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

function turnOffLight() {
    v3.discovery.nupnpSearch()
        .then(searchResults => {
            const host = searchResults[0].ipaddress;
            return v3.api.createLocal(host).connect(BridgeUser);
        })
        .then(api => {
            const stateOFF = new LightState().off();
            api.lights.getAll().forEach((light) => {
                api.lights.setLightState(light._data.id, stateOFF);
            })
        });
}

function changeLightColor(random, color, lightID) {
    busy = true;
    v3.discovery.nupnpSearch()
        .then((searchResults) => {
            const host = searchResults[0].ipaddress;
            return v3.api.createLocal(host).connect(BridgeUser);
        })
        .then((hueAPI) => {
            let stateON;
            if (random) {
                color = Math.floor(Math.random() * Math.floor(65535));
                stateON = new LightState().on().hue(color).brightness(100);
            } else {
                stateON = new LightState().on().rgb(color).brightness(100);
            }
            const stateOFF = new LightState().off();

            hueAPI.lights.setLightState(lightID, stateON).then(() => {
                setTimeout(() => {
                    hueAPI.lights.setLightState(lightID, stateOFF);
                    busy = false;
                }, 1000);
            });


        })
}

exports.start = async (data) => {
    await pubSubClient.registerUserListener(await loginTwitch());
    BridgeUser = data[0].BridgeUser;
    started = true;
    busy = false;

    if (data[0].active) {
        onBits = await pubSubClient.onBits(userID, userID, bitsData => {
            let pipeline;
            if (bitsData.bits <= 10) {
                pipeline += 1;
            } else {
                pipeline += parseInt((bitsData.bits / 10), 10);
            }

            for (let i = 0; i < pipeline; i++) {
                setTimeout(() => {
                    if (busy) {
                        i--;
                    } else {
                        changeLightColor(data[0].color.random, data[0].onBits.color.rgb, data[0].lightID)
                    }
                }, 2000 * i)
            }
        });
    }

    if (data[1].active) {
        onSubscription = await pubSubClient.onSubscription(userID, () => {
            for (let i = 0; i < 1; i++) {
                setTimeout(() => {
                    if (busy) {
                        i--;
                    } else {
                        changeLightColor(data[1].color.random, data[1].color.rgb, data[1].lightID)
                    }
                }, 200)
            }
        });
    }

    /* Not working
    if (data[2].active) {
        onBitsBadgeUnlock = await pubSubClient.onBitsBadgeUnlock(userID, () => {
            for (let i = 0; i < 1; i++) {
                setTimeout(() => {
                    if (busy) {
                        i--;
                    } else {
                        changeLightColor(data[2].color.random, data[2].color.rgb, data[2].lightID)
                    }
                }, 200)
            }
        });
    }
     */

    if (data[3].active) {
        onModAction = await pubSubClient.onModAction(userID, userID, () => {
            for (let i = 0; i < 1; i++) {
                setTimeout(() => {
                    if (busy) {
                        i--;
                    } else {
                        changeLightColor(data[3].color.random, data[3].color.rgb, data[3].lightID)
                    }
                }, 200)
            }
        });
    }

}

exports.stop = () => {
    started = false;
    busy = false;
    turnOffLight();
    onBitsBadgeUnlock.remove();
    onBits.remove();
    onModAction.remove();
    onSubscription.remove();
}


