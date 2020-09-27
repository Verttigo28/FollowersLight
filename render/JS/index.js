'use strict'

function checkVitals() {
    if (localStorage.getItem("username") !== null) {
        document.getElementById("hueLink").innerText = "Linked";
        document.getElementById("hueLinkImg").src = "data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=";
    }

    window.api.send("askStatusApp");
    window.api.receive("callbackStatus", (success, data) => {
        if (!success) {
            alert(data.message);
            return;
        }
        if (data.twitterStatus) {
            document.getElementById("twitterSpan").innerText = "Bot running";
            document.getElementById("twitterImage").src = "data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=";
        }
        if (data.instaStatus) {
            document.getElementById("instaSpan").innerText = "Bot running";
            document.getElementById("instaImage").src = "data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=";
        }
        if (data.twitchStatus) {
            document.getElementById("twitchSpan").innerText = "Bot running";
            document.getElementById("twitchImage").src = "data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=";
        }
    });
}