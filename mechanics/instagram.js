const listener = require("./listener")
const lightAPI = require("./lightAPI");
const fetch = require('node-fetch');

let BridgeUser;
let user;
let LIGHT_ID = 0;
let fansCount;
let refreshFollower;
let refreshData;
let started = false;
let rgb;
let random;

function getFollowersCount() {

    fetch("https://www.instagram.com/" + user + "/?__a=1")
        .then(res => res.json())
        .then(json => {
            let count = json.graphql.user.edge_followed_by.count;
            if (fansCount === undefined) fansCount = count;

            if (count > fansCount) {
                let diff = count - fansCount;
                for (let i = 0; i < diff; i++) {
                    lightAPI.changeLightColor(random, rgb, LIGHT_ID, BridgeUser, "insta")
                }
            }
            fansCount = count;
        }).catch(() => {
        started = false;
        lightAPI.turnOffLight(BridgeUser);
        clearInterval(refreshData)
        clearInterval(refreshFollower)
        listener.sendErrorT("The user enter is not valid", "Instagram Bot");
    });
}

exports.start = async (data) => {
    if (data.bridgeUser === null || data.light === null || data.instaUser === null || data.color.random == null || data.color.random == null) return new Error("Not every input have been entered");
    BridgeUser = data.bridgeUser;
    LIGHT_ID = data.light;
    started = true;
    user = data.instaUser;
    rgb = data.color.rgb;
    random = data.color.random;

    //Bypass setInterval
    getFollowersCount();

    //Launch Followers collect
    refreshFollower = setInterval(() => {
        getFollowersCount();
    }, 1000 * 2);

    //Launch Light system
    refreshData = setInterval(() => {
        listener.sendInstaData(true, {
            followerCount: fansCount,
            user,
            pipeline: lightAPI.pipeline.length
        })
    }, 2000);

}

exports.stop = async () => {
    try {
        started = false;
        fansCount = null;
        lightAPI.turnOffLight(BridgeUser);
        clearInterval(refreshData)
        clearInterval(refreshFollower)
        lightAPI.clearPipelineFromType("insta");
    } catch (err) {
        return new Error("Error during bot stopping");
    }
}

exports.getStatus = () => {
    return started;
}
