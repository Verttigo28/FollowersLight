const {ipcRenderer} = require('electron');

ipcRenderer.on('newUpdate', function(event, info) {

})

ipcRenderer.on('error', function(event, info) {

})


ipcRenderer.on('progressBar', function(event, progressObj) {

})
