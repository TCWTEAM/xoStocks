const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const remote = require('electron').remote
const ipc = require('electron').ipcMain

document.getElementById("addBtn").addEventListener("click", function(){

  createAddWin()

})

function createAddWin() {
  const BrowserWindow = remote.BrowserWindow
  addWin = new BrowserWindow({
    width: 500,
    height: 300
  })
  addWin.setMenu(null)
  addWin.loadFile('add.html')
}

function openModal(stock) {
  //if youre looking at this you are probably calling me an idiot but for some reason ipc's would cause my whole project to crash, this was the only way
  fs.truncate('./data/tempConainment.txt', 0, function() {
    console.log('done')
  })

  fs.writeFile('./data/tempConainment.txt', stock, function(err) {
    console.log(err)
  })

  const BrowserWindow = remote.BrowserWindow
  modalWin = new BrowserWindow({
    width:1100,
    height:1000,
    modal: true
  })
  modalWin.webContents.openDevTools()
  modalWin.setMenu(null)
  modalWin.loadFile('modal.html')
}

function openSettings() {
  const BrowserWindow = remote.BrowserWindow
  settingsWin = new BrowserWindow({
    width:750,
    height:400
  })
  settingsWin.webContents.openDevTools()
  settingsWin.setMenu(null)
  settingsWin.loadFile('settings.html')
}

document.getElementById('settingBtn').addEventListener("click", function(){
  openSettings()
})
