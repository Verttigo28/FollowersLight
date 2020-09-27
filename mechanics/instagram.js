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

exports.started = started;

function getFollowersCount() {

    fetch("https://www.instagram.com/" + user + "/?__a=1")
        .then(res => res.json())
        .then(json => {
            let count =  json.graphql.user.edge_followed_by.count;
            if (fansCount === undefined) fansCount = count;

            if (count > fansCount) {
                let diff = count - fansCount;
                for(let i=0; i< diff;i++){
                    lightAPI.changeLightColor(true, null, LIGHT_ID, BridgeUser)
                }
            }
            fansCount = count;
        }).catch(() => {
        started = false;
        lightAPI.turnOffLight(BridgeUser);
        clearInterval(refreshData)
        clearInterval(refreshFollower)
        listener.sendInstaData(false, {message: "Unknown user"});
    });
}

exports.start = (bridgeUser, light, instaUser) => {

    BridgeUser = bridgeUser;
    LIGHT_ID = light;
    started = true;
    user = instaUser;

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

exports.stop = () => {
    started = false;
    fansCount = undefined;
    lightAPI.turnOffLight(BridgeUser);
    clearInterval(refreshData)
    clearInterval(refreshFollower)
}

exports.getStatus = () => {
    return started;
}
