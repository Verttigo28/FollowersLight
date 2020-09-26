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

const pickr2 = new Pickr({
    el: '#color-picker-2',
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


const pickr3 = new Pickr({
    el: '#color-picker-3',
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

const pickr4 = new Pickr({
    el: '#color-picker-4',
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

function enabler(check) {
    if (!check.checked) {
        document.getElementById(check.value + "Div").style.pointerEvents = "none";
        document.getElementById(check.value + "Div").classList.add("text-muted");
    } else if (check.checked) {
        document.getElementById(check.value + "Div").style.pointerEvents = "auto";
        document.getElementById(check.value + "Div").classList.remove("text-muted");
    }
}

function colorRadio(radio) {
    if (radio.name === "bits") {
        if (radio.value === "random") {
            document.getElementById("color-picker-1").hidden = true;
        } else if (radio.value === "manual") {
            document.getElementById("color-picker-1").hidden = false;
        }
    }
    if (radio.name === "sub") {
        if (radio.value === "random") {
            document.getElementById("color-picker-2").hidden = true;
        } else if (radio.value === "manual") {
            document.getElementById("color-picker-2").hidden = false;
        }
    }
    if (radio.name === "badge") {
        if (radio.value === "random") {
            document.getElementById("color-picker-3").hidden = true;
        } else if (radio.value === "manual") {
            document.getElementById("color-picker-3").hidden = false;
        }
    }
    if (radio.name === "mod") {
        if (radio.value === "random") {
            document.getElementById("color-picker-4").hidden = true;
        } else if (radio.value === "manual") {
            document.getElementById("color-picker-4").hidden = false;
        }
    }
}


function connectTwitch() {
    window.api.send("askTwitchConnexion");
    window.api.receive("callBackTwitchConnexion", (success, twitchUserID) => {
        if (!success) {
            alert("Some problem");
            return;
        }
        console.log(twitchUserID)
        localStorage.setItem("twitchUserID", twitchUserID);
        init();
    });
}

function isTwitchRunning() {
    window.api.send("isTwitchRunning");
    window.api.receive("callbackTwitchRunning", (success, isRunning) => {
        if (!success) {
            alert("Some problem");
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
    } else if (localStorage.getItem("twitchUserID") === null) {
        document.getElementById("noTwitch").hidden = false;
        document.getElementById("TwitchApp").hidden = true;
        connectTwitch();
    } else {
        document.getElementById("noTwitch").hidden = true;
        document.getElementById("TwitchApp").hidden = false;
        isTwitchRunning()
        getLights();
    }
}

function getRadioValue(name) {
    let value = document.querySelector('input[name="' + name + '"]:checked').value;
    if (value === "random") {
        return true;
    } else {
        return false;
    }
}

function getColor(name) {
    if (name === "bits") {
        let rgba = pickr1.getSelectedColor().toRGBA();
        rgba.splice(-1, 1)
        return rgba;
    }
    if (name === "sub") {
        let rgba = pickr2.getSelectedColor().toRGBA();
        rgba.splice(-1, 1)
        return rgba;
    }
    if (name === "badge") {
        let rgba = pickr3.getSelectedColor().toRGBA();
        rgba.splice(-1, 1)
        return rgba;
    }
    if (name === "mod") {
        let rgba = pickr4.getSelectedColor().toRGBA();
        rgba.splice(-1, 1)
        return rgba;
    }
}

function getLightID(name) {
    if (name === "bits") {
        return document.getElementById("lightSelector1").value;
    }
    if (name === "sub") {
        return document.getElementById("lightSelector2").value;
    }
    if (name === "badge") {
        return document.getElementById("lightSelector3").value;
    }
    if (name === "mod") {
        return document.getElementById("lightSelector4").value;
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
        let array = [1,2,3,4];
        array.forEach((id) => {
            let ls = document.getElementById("lightSelector" + id);
            data.forEach((light) => {
                let option = document.createElement("option");
                option.text = light._data.name;
                option.value = light._data.id;
                ls.add(option)
            })
        })
    });
}

function lock() {
    let divs = ["sub", "bits", "badge", "mod"]
    divs.forEach((div) => {
        document.getElementById(div + "Div").style.pointerEvents = "none";
        document.getElementById(div + "Div").classList.add("text-muted");
    })
}

function unlock() {
    let divs = ["sub", "bits", "badge", "mod"]
    divs.forEach((div) => {
        document.getElementById(div + "Div").style.pointerEvents = "auto";
        document.getElementById(div + "Div").classList.remove("text-muted");
    })
}

function toggleBot() {
    if (!started) {
        let data = [];
        let checkboxes = document.querySelectorAll('input[type=checkbox]')
        checkboxes.forEach((input) => {
            console.log(getColor(input.value));
            data.push({
                name: input.value,
                active: input.checked,
                BridgeUser: localStorage.getItem("username"),
                lightID: getLightID(input.value),
                color: {
                    random: getRadioValue(input.value),
                    rgb: getColor(input.value)
                }
            })
        })
        started = true;
        lock();
        window.api.send("StartTwitchBot", data);
        document.getElementById("toggleBot").innerText = "Stop Bot";
    } else {
        window.api.send("StopTwitchBot");
        window.api.receive("callBackTwitchBot", (success) => {
            if (!success) {
                alert("Some sort of problem going on");
                return;
            }
            unlock();
            document.getElementById("toggleBot").innerText = "Start Bot";
        });
    }
}