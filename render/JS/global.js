'use strict'

function checkUpdates() {
    window.api.send("askForUpdate");
}

window.api.receive("callbackUpdate", (available) => {
    console.log("ICIIIIIIIIII ")
    if (!available) {
        alert("No update available, check back later")
    }
});
