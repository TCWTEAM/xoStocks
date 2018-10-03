/* Handles deleting a stock from the list */
const remote = require('electron').remote

function adelete(stock) {
  //Get the modal win in an object
  var modalWin = remote.getCurrentWindow()
  fs.readFile('./data/watchlist.txt', 'utf8', function(err, contents) {
    var cj = contents.split('\n')
    var newStock = []
    for (i = 0; i < cj.length; i++) {
      if (cj[i] != stock) {
        newStock.push(cj[i])
      }
    }
    fs.truncate('./data/watchlist.txt', 0, function() {
      console.log('done')
    })
    for (i = 0; i < newStock.length; i++) {
      if (newStock[i] != "") {
        fs.appendFile('./data/watchlist.txt', newStock[i] + '\n', function(err) {
          console.log('i')
        });
      }
    }
    //close modal win
    modalWin.close()
  })

}
