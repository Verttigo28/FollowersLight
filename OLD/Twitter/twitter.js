const twitterFollowersCount = require("twitter-followers-count");
const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

const config = require("../Config/config.json")

const USERNAME = config.BridgeUser, LIGHT_ID = 1;
let fansCount;
let pipeline = 0;

let user = "Verttigo_"

const getTwitterFollowers = twitterFollowersCount({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret,
})

function getFollowersCount() {
    (async () => {
        let data =  await getTwitterFollowers([user])
        let count =  data[user];

        if (fansCount === undefined) fansCount = count;

        if (count > fansCount) {
            let diff = count - fansCount;
            pipeline += diff;
            console.log("[" + config.AppName +"] New followers : " + diff)
        }
        fansCount = count;
    })();
}

function changeLightColor() {
    //if the pipeline is not empty
    if (pipeline > 0) {
        v3.discovery.nupnpSearch()
            .then((searchResults) => {
                const host = searchResults[0].ipaddress;
                return v3.api.createLocal(host).connect(USERNAME);
            })
            .then((api) => {
                const stateON = new LightState().on().hue(Math.floor(Math.random() * Math.floor(65535))).brightness(100);
                const stateOFF = new LightState().off();
                pipeline--;

                api.lights.setLightState(LIGHT_ID, stateON).then(() => {
                    console.log("[" + config.AppName +"] The light color has been changed, pipeline is at : " + pipeline);
                    setTimeout(() => {
                        api.lights.setLightState(LIGHT_ID, stateOFF);
                    }, 1000);
                });
            })
    }
}

function start() {
    //Bypass setInterval
    getFollowersCount();
    changeLightColor()

    //Launch Followers collect
    setInterval(() => {
        getFollowersCount();
    }, 1000 * 5);

    //Launch Light system
    setInterval(() => {
        changeLightColor();
    }, 2000);

}

start();