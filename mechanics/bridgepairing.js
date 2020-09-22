const v3 = require("node-hue-api").v3
    , discovery = v3.discovery
    , hueApi = v3.api
;

const appName = "TikTokLight";
const deviceName = "Phillips Hue";

async function discoverBridge() {
    const discoveryResults = await discovery.nupnpSearch();

    if (discoveryResults.length === 0) {
        return null;
    } else {
        //if you have more than 1 Hue Bridge, tell me
        return discoveryResults[0].ipaddress;
    }
}

exports.discoverAndCreateUser = async () => {
    let pairingSequence = new Promise(async (resolve, reject) => {
        const ipAddress = await discoverBridge();
        if (ipAddress === null) reject({error: "0", message: "Can't find the Hue bridge"})

        const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();

        let createdUser;
        try {
            createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);

            const authenticatedApi = await hueApi.createLocal(ipAddress).connect(createdUser.username);
            const bridgeConfig = await authenticatedApi.configuration.getConfiguration();

            resolve({
                username: createdUser.username,
                bridgeName: bridgeConfig.name,
                bridgeIP: bridgeConfig.ipaddress
            });

        } catch (err) {
            if (err.getHueErrorType() === 101) {
                reject({
                    error: "1",
                    message: "Bridge detected but you need to press the button"
                });
            } else {
                reject({
                    error: "2",
                    message: err.message
                });
            }
        }
    });
    return await pairingSequence;
}