'use strict'

function checkUpdates() {
    window.api.send("askForUpdate");
}

window.api.receive("callbackUpdate", (available) => {
    if (!available) {
        alert("No update available, check back later")
    }
});


window.api.receive("error", (error, type) => {
   alert(type + " : " + error);
   location.reload();
});
