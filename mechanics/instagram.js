const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;
const listener = require("./listener")
const fetch = require('node-fetch');

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

function getFollowersCount() {

    fetch("https://www.instagram.com/" + user + "/?__a=1")
        .then(res => res.json())
        .then(json => {
            let count =  json.graphql.user.edge_followed_by.count;
            if (fansCount === undefined) fansCount = count;

            if (count > fansCount) {
                let diff = count - fansCount;
                pipeline += diff;
            }
            fansCount = count;
        });
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

exports.start = (bridgeUser, light, instaUser) => {

    BridgeUser = bridgeUser;
    LIGHT_ID = light;
    started = true;
    user = instaUser;

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
        listener.sendInstaData(true, {
            followerCount: fansCount,
            user,
            pipeline,
            colorDisplay
        })
    }, 2000);

}

exports.stop = () => {
    started = false;
    pipeline = 0;
    fansCount = undefined;
    turnOffLight();
    clearInterval(refreshLight)
    clearInterval(refreshFollower)
}

exports.getStatus = () => {
    return started;
}
