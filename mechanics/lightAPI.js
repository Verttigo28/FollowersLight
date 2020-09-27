const v3 = require("node-hue-api").v3;
const LightState = v3.lightStates.LightState;

let pipeline = [];
let busy = false;

exports.pipeline = pipeline;

exports.getAllLights = async (username) => {
    let promise = new Promise((resolve, reject) => {
        v3.discovery.nupnpSearch()
            .then(searchResults => {
                const host = searchResults[0].ipaddress;
                return v3.api.createLocal(host).connect(username);
            })
            .then(api => {
                return api.lights.getAll();
            })
            .then(allLights => {
                resolve(allLights);
            }).catch(e => reject(e))
    })
    return await promise;

}

exports.turnOffLight = (BridgeUser) => {
    v3.discovery.nupnpSearch()
        .then(searchResults => {
            const host = searchResults[0].ipaddress;
            return v3.api.createLocal(host).connect(BridgeUser);
        })
        .then(async (api) => {
            const stateOFF = new LightState().off();
            let allLights = await api.lights.getAll();
            allLights.forEach((light) => {
                api.lights.setLightState(light._data.id, stateOFF);
            })
        });
}

exports.changeLightColor = (random, color, lightID, BridgeUser) => {
    if (busy) {
        pipeline.push({random, color, lightID, BridgeUser});
    } else {
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
                        pipeline.shift();
                        if (pipeline.length) this.changeLightColor(pipeline[0].random, pipeline[0].color, pipeline[0].lightID ,pipeline[0].BridgeUser);
                        busy = false;
                    }, 1000);
                });
            })
    }
}
