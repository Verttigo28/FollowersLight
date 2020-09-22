const v3 = require("node-hue-api").v3;

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
            }).catch(e=> reject(e))
    })
    return await promise;

}
