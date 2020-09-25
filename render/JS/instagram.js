'use strict'

let started = false;

function getLights() {
    //Send request
    window.api.send("askLights", localStorage.getItem("username"));
    //Request back
    window.api.receive("callBackLights", (success, data) => {
        if (!success) {
            alert(data.message);
            return;
        }
        let ls = document.getElementById("lightSelector");
        data.forEach((light) => {
            let option = document.createElement("option");
            option.text = light._data.name;
            option.value = light._data.id;
            ls.add(option)
        })
    });
}

function toggleBot() {
    if (!started) {
        let bridgeUser = localStorage.getItem("username");
        let light = document.getElementById("lightSelector").value;
        let instaUser = document.getElementById("inputUsername").value;
        let data = {
            bridgeUser,
            light,
            instaUser
        }
        window.api.send("StartInstaBot", data);
        started = true;
        document.getElementById("toggleBot").innerText = "Stop Bot";
    } else {
        started = false;
        window.api.send("StopInstaBot");
        window.api.receive("callBackInstaBot", (success, data) => {
            if (!success) {
                alert(data.message);
                return;
            }
            document.getElementById("toggleBot").innerText = "Start Bot";
        });
    }

}

function isInstaRunning() {
    window.api.send("isInstaRunning");
    window.api.receive("callbackInstaRunning", (success, isRunning) => {
        if (!success) {
            alert(isRunning.message);
            return;
        }
        document.getElementById("toggleBot").disabled = false;
        if (isRunning) {
            started = true;
            document.getElementById("toggleBot").innerText = "Stop Bot";
        } else {
            started = false
            document.getElementById("toggleBot").innerText = "Start Bot";
        }
    });
}


window.api.receive("callBackInstaData", (success, data) => {
    if (!success) {
        alert(data.message);
        document.getElementById("toggleBot").innerText = "Start Bot";
        return;
    }
    let date = new Date();
    let dateFormat = (date.getHours()<10?'0':'') + date.getHours()  + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
    document.getElementById("toggleBot").innerText = "Stop Bot";
    document.getElementById("counts").innerText = data.followerCount;
    document.getElementById("pipeline").innerText = data.pipeline;
    document.getElementById("colorDisplay").innerText = data.colorDisplay;
    document.getElementById("lastCheck").innerText = dateFormat;
    document.getElementById("inputUsername").value = data.user;

});

function init(){
    getLights();
    isInstaRunning();
}

