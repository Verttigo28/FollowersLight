const twitterFollowersCount = require("twitter-followers-count");
const lightAPI = require("./lightAPI");
const listener = require("./listener")
const config = require("../config/config.json")

let BridgeUser;
let user;
let LIGHT_ID;
let fansCount;
let refreshFollower;
let refreshData;
let started = false;
let rgb;
let random;

let getTwitterFollowers;

function getFollowersCount() {
    (async () => {
        try {
            let data = await getTwitterFollowers([user])
            let count = data[user];

            if (fansCount === undefined) fansCount = count;

            if (count > fansCount) {
                let diff = count - fansCount;
                for (let i = 0; i < diff; i++) {
                    lightAPI.changeLightColor(random, rgb, LIGHT_ID, BridgeUser, "twitter")
                }
            }
            fansCount = count;
        } catch (e) {
            started = false;
            getTwitterFollowers = null;
            lightAPI.turnOffLight(BridgeUser);
            clearInterval(refreshData)
            clearInterval(refreshFollower)
            listener.sendTwitterData(false, {message: "Unknown user"});
        }
    })();
}


exports.start = (data) => {

    BridgeUser = data.bridgeUser;
    LIGHT_ID = data.light;
    started = true;
    user = data.twitterUser;
    rgb = data.color.rgb;
    random = data.color.random;

    getTwitterFollowers = twitterFollowersCount({
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        access_token_key: data.Token,
        access_token_secret: data.TokenSecret,
    })

    //Bypass setInterval
    getFollowersCount();

    //Launch Followers collect
    refreshFollower = setInterval(() => {
        getFollowersCount();
    }, 1000 * 2);

    //Launch Light system
    refreshData = setInterval(() => {
        listener.sendTwitterData(true, {
            followerCount: fansCount,
            user,
            pipeline: lightAPI.pipeline.length,
        })
    }, 2000);

}

exports.stop = () => {
    started = false;
    getTwitterFollowers = null;
    fansCount = undefined;
    lightAPI.turnOffLight(BridgeUser);
    lightAPI.clearPipelineFromType("twitter");
    clearInterval(refreshData)
    clearInterval(refreshFollower)
}

exports.getStatus = () => {
    return started;
}
