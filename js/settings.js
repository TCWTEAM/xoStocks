const jsonfile = require('jsonfile')
const fs = require('fs')
document.getElementById("btnSaveAll").addEventListener("click", function(){
  saveSettings()
})


function saveSettings() {
  var obj = {
    "webhook": document.getElementById('discordWebhook').value,
    "phonenumber": document.getElementById('phoneNumber').value,
    "delay": document.getElementById('refreshDelay').value
    }

    jsonfile.writeFile('./data/settings.json', obj, function (err) {
      alert("Saved!")
    })
}

function restoreSettings() {
  var file = './data/settings.json'
  jsonfile.readFile(file, function (err, obj) {
    document.getElementById('discordWebhook').value = obj.webhook
    document.getElementById('phoneNumber').value = obj.phonenumber
    document.getElementById('refreshDelay').value = obj.delay
  })
}

alert("NONE OF THESE WORK YET")
