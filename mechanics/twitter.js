const twitterFollowersCount = require("twitter-followers-count");
const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;
const app = require("../app")

const config = require("../config/config.json")

let BridgeUser;
let user;
let LIGHT_ID = 0;
let fansCount;
let pipeline = 0;
let refreshFollower;
let colorDisplay = 0;
let refreshLight;
let started = false;

exports.started = started;


let getTwitterFollowers;

function getFollowersCount() {
    (async () => {
        try {
            let data = await getTwitterFollowers([user])
            let count = data[user];

            if (fansCount === undefined) fansCount = count;

            if (count > fansCount) {
                let diff = count - fansCount;
                pipeline += diff;
            }
            fansCount = count;
        } catch(e) {
            started = false;
            getTwitterFollowers = null;
            turnOffLight();
            clearInterval(refreshLight)
            clearInterval(refreshFollower)
            app.sendTwitterData(false, {message: "Unknown user"});
        }
    })();
}

function changeLightColor() {
    //if the pipeline is not empty
    if (pipeline > 0) {
        v3.discovery.nupnpSearch()
            .then((searchResults) => {
                const host = searchResults[0].ipaddress;
                return v3.api.createLocal(host).connect(BridgeUser);
            })
            .then((api) => {
                colorDisplay = Math.floor(Math.random() * Math.floor(65535));
                const stateON = new LightState().on().hue(colorDisplay).brightness(100);
                const stateOFF = new LightState().off();
                pipeline--;

                api.lights.setLightState(LIGHT_ID, stateON).then(() => {
                    setTimeout(() => {
                        api.lights.setLightState(LIGHT_ID, stateOFF);
                    }, 1000);
                });
            })
    }
}

function turnOffLight() {
    v3.discovery.nupnpSearch()
        .then((searchResults) => {
            const host = searchResults[0].ipaddress;
            return v3.api.createLocal(host).connect(BridgeUser);
        })
        .then((api) => {
            const stateOFF = new LightState().off();
            api.lights.setLightState(LIGHT_ID, stateOFF);
        })
}

exports.start = (bridgeUser, Token, TokenSecret, light, twitterUser) => {

    BridgeUser = bridgeUser;
    LIGHT_ID = light;
    started = true;
    user = twitterUser;
    
    getTwitterFollowers = twitterFollowersCount({
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        access_token_key: Token,
        access_token_secret: TokenSecret,
    })

    //Bypass setInterval
    getFollowersCount();
    changeLightColor()

    //Launch Followers collect
    refreshFollower = setInterval(() => {
        getFollowersCount();
    }, 1000 * 2);

    //Launch Light system
    refreshLight = setInterval(() => {
        changeLightColor();
        app.sendTwitterData(true, {
            followerCount: fansCount,
            user,
            pipeline,
            colorDisplay
        })
    }, 2000);

}

exports.stop = () => {
    started = false;
    getTwitterFollowers = null;
    pipeline = 0;
    fansCount = undefined;
    turnOffLight();
    clearInterval(refreshLight)
    clearInterval(refreshFollower)
}

exports.getStatus = () => {
    return started;
}
