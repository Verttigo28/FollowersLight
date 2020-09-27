'use strict'

let started = false;

const pickr1 = new Pickr({
    el: '#color-picker-1',
    useAsButton: true,
    default: "303030",
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: false,
            rgba: true,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: true,
            save: true
        }
    }
});

function lock() {
    document.getElementById("inputUsername").disabled = true;
    document.getElementById("lightSelector").disabled = true;
    document.getElementById("disconnect").disabled = true;
}

function unlock() {
    document.getElementById("inputUsername").disabled = false;
    document.getElementById("lightSelector").disabled = false;
    document.getElementById("disconnect").disabled = false;
}

function displayTwitterInfo() {
    document.getElementById("toggleBot").disabled = true;
    if (localStorage.getItem("Token") !== null) {
        document.getElementById("subtitle").innerText = "Twitter account connected, you can now enter the username you want!";
        document.getElementById("connectTwitterButton").hidden = true;
        document.getElementById("disconnect").hidden = false;
        document.getElementById("inputUsername").type = "";
        isTwitterRunning();
    } else {
        document.getElementById("lightSelector").disabled = true;
        document.getElementById("disconnect").hidden = true;
    }
}

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
        while (ls.firstChild) ls.removeChild(ls.lastChild);
        data.forEach((light) => {
            let option = document.createElement("option");
            option.text = light._data.name;
            option.value = light._data.id;
            ls.add(option)
        })
    });
}

function connectTwitter() {
    window.api.send("askTwitterApproval");
    window.api.receive("callBackTwitter", (success, data) => {
        if (!success) {
            alert(data.message);
            return;
        }
        localStorage.setItem("Token", data.token)
        localStorage.setItem("TokenSecret", data.tokenSecret)
        location.reload();
    });
}

function disconnect() {
    window.api.send("StopTwitterBot");
    unlock();
    localStorage.removeItem("Token");
    localStorage.removeItem("TokenSecret");
    location.reload();
}

function colorRadio(radio) {
    if (radio.value === "random") {
        document.getElementById("color-picker-1").hidden = true;
    } else if (radio.value === "manual") {
        document.getElementById("color-picker-1").hidden = false;
    }
}
function getRadioValue() {
    let value = document.querySelector('input[name="twitter"]:checked').value;
    if (value === "random") {
        return true;
    } else {
        return false;
    }
}

function toggleBot() {
    if (!started) {
        let Token = localStorage.getItem("Token");
        let TokenSecret = localStorage.getItem("TokenSecret");
        let bridgeUser = localStorage.getItem("username");
        let light = document.getElementById("lightSelector").value;
        let twitterUser = document.getElementById("inputUsername").value;
        let rgb = pickr1.getSelectedColor().toRGBA();
        rgb.splice(-1, 1)
        let data = {
            Token,
            TokenSecret,
            bridgeUser,
            light,
            twitterUser,
            color: {
                random: getRadioValue(),
                rgb: rgb
            }
        }
        window.api.send("StartTwitterBot", data);
        started = true;
        lock();
        document.getElementById("toggleBot").innerText = "Stop Bot";
    } else {
        started = false;
        unlock()
        window.api.send("StopTwitterBot");
        window.api.receive("callBackTwitterBot", (success) => {
            if (!success) {
                alert("Some sort of problem going on");
                return;
            }
            document.getElementById("toggleBot").innerText = "Start Bot";
        });
    }

}

function isTwitterRunning() {
    window.api.send("isTwitterRunning");
    window.api.receive("callbackTwitterRunning", (success, isRunning) => {
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

function init() {
    if (localStorage.getItem("username") === null) {
        document.getElementById("toggleBot").disabled = true;
        document.getElementById("global").hidden = true;
        document.getElementById("notLink").hidden = false;
        alert("You can't use the bot if you don't have a Hue Bridge paired")
    } else {
        getLights();
        displayTwitterInfo();
    }
}

window.api.receive("callBackTwitterData", (success, data) => {
    if (!success) {
        alert(data.message);
        document.getElementById("toggleBot").innerText = "Start Bot";
        return;
    }
    let date = new Date();
    let dateFormat = (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    lock();
    document.getElementById("toggleBot").innerText = "Stop Bot";
    document.getElementById("counts").innerText = data.followerCount;
    document.getElementById("pipeline").innerText = data.pipeline;
    document.getElementById("lastCheck").innerText = dateFormat;
    document.getElementById("inputUsername").value = data.user;

});