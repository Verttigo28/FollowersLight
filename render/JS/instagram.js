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

function colorRadio(radio) {
    if (radio.value === "random") {
        document.getElementById("color-picker-1").hidden = true;
    } else if (radio.value === "manual") {
        document.getElementById("color-picker-1").hidden = false;
    }
}

function getRadioValue() {
    let value = document.querySelector('input[name="insta"]:checked').value;
    if (value === "random") {
        return true;
    } else {
        return false;
    }
}


function toggleBot() {
    if (!started) {
        let bridgeUser = localStorage.getItem("username");
        let light = document.getElementById("lightSelector").value;
        let instaUser = document.getElementById("inputUsername").value;
        let rgb = pickr1.getSelectedColor().toRGBA();
        rgb.splice(-1, 1)
        let data = {
            bridgeUser,
            light,
            instaUser,
            color: {
                random: getRadioValue(),
                rgb: rgb
            }
        }
        window.api.send("StartInstaBot", data);
        started = true;
        document.getElementById("toggleBot").innerText = "Stop Bot";
    } else {
        started = false;
        window.api.send("StopInstaBot");
        document.getElementById("toggleBot").innerText = "Start Bot";
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
    let dateFormat = (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    document.getElementById("toggleBot").innerText = "Stop Bot";
    document.getElementById("counts").innerText = data.followerCount;
    document.getElementById("pipeline").innerText = data.pipeline;
    document.getElementById("lastCheck").innerText = dateFormat;
    document.getElementById("inputUsername").value = data.user;

});

function init() {
    if (localStorage.getItem("username") === null) {
        document.getElementById("toggleBot").disabled = true;
        document.getElementById("global").hidden = true;
        document.getElementById("notLink").hidden = false;
        alert("You can't use the bot if you don't have a Hue Bridge paired")
    } else {
        getLights();
        isInstaRunning();
    }
}

