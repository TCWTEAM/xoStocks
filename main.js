/* Main Window Renderer */
/* Super Basic Electron Wont Even Comment It Up That Much */
const { app, BrowserWindow } = require('electron')
var ipcMain = require(‘electron’).ipcMain;

function createMainWin() {
  mainWin = new BrowserWindow({
    width: 1100,
    height: 875
  })
  mainWin.setMenu(null)
  mainWin.loadFile('index.html')
  mainWin.webContents.openDevTools()
}

//On ready run the create browser win function
app.on('ready', createMainWin)
