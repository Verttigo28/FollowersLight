'use strict'

function checkPairingStatus() {
    if (localStorage.getItem("username") !== null) {
        document.getElementById("pairingTitle").innerText = "Hue Bridge : linked";
        document.getElementById("hueLinkImg").src = "data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=";
        document.getElementById("text1").innerText = "Bridge User : " + localStorage.getItem("username");
        document.getElementById("text2").innerText = "Bridge IP : " + localStorage.getItem("bridgeIP");
        document.getElementById("pairingBTN").innerText = "Disconnect";
    }
}

function toggle() {
    if (localStorage.getItem("username") !== null) {
        localStorage.removeItem("username");
        localStorage.removeItem("bridgeName");
        localStorage.removeItem("bridgeIP");
        location.reload();
    } else {
        //Send request
        window.api.send("askBridgePairing");
        //Request back
        window.api.receive("callbackBridge", (success, data) => {
            console.log(success)
            if (!success) {
                alert(data.message);
                return;
            }
            console.log(data);
            localStorage.setItem("username", data.username);
            localStorage.setItem("bridgeName", data.bridgeName);
            localStorage.setItem("bridgeIP", data.bridgeIP);
            checkPairingStatus();
        });
    }
}
