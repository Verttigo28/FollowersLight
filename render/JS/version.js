const {ipcRenderer} = require("electron");

let versionInfo;

ipcRenderer.on("newUpdate", function (event, info) {
    versionInfo = info;
    $('#subTitle').innerText = "Updating to " + info.version
    $('#progress').hidden = false;

    let ul = document.getElementById("list");
    info.releaseNotes.forEach((note) => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(note));
        ul.appendChild(li);
    })
})

ipcRenderer.on("error", function (event, err) {
    alert(err)
})

ipcRenderer.on("progressBar", function (event, progressObj) {
    $('#progressbar').attr('aria-valuenow', progressObj.percent).css('width', progressObj.percent + '%');
    $('#percentage').innerText = "Download : " + progressObj.percent + "%";
})

function okForUpdate() {
    ipcRenderer.send("okForUpdate", true)
}

function close() {
    ipcRenderer.send("close", true)
}

function skipVersion() {
    localStorage.setItem("SkipVersion", versionInfo.version)
    close();
}
