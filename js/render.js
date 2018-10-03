const ipcM = require('electron').ipcMain

ipc.on('createdList', function (event, arg) {
  console.log(arg)
})
