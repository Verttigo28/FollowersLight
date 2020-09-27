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
                for(let i=0; i< diff;i++){
                    lightAPI.changeLightColor(true, null, LIGHT_ID, BridgeUser)
                }
            }
            fansCount = count;
        } catch(e) {
            started = false;
            getTwitterFollowers = null;
            lightAPI.turnOffLight(BridgeUser);
            clearInterval(refreshData)
            clearInterval(refreshFollower)
            listener.sendTwitterData(false, {message: "Unknown user"});
        }
    })();
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
    clearInterval(refreshData)
    clearInterval(refreshFollower)
}

exports.getStatus = () => {
    return started;
}
