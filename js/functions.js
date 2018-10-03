/*Well im probably going to be yelled at for using dom mostly but that was the point of this project
as I tried to do a project using the hardest methods and was told cant do
a sexy ui without jquery so here. Code is very messy but hey it works idc */
var request = require('request');
const jsonfile = require('jsonfile')
var fs = require('fs')
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
const signale = require('signale')
const rp = require('request-promise')
const ipcR = ('electron').ipcRenderer
const ipcM = require('electron').ipcMain



var sti = ""
var totalRows = 0
var totalCells = 0

function add(ticker) {
  if (ticker.length == "") {
    document.getElementById('responseAdd').innerHTML = '<h5 class="error">Please Enter A Valid Ticker</h5>'
  } else {
    var opts = {
      url: 'https://api.iextrading.com/1.0/stock/' + ticker + '/quote',
      method: 'GET'
    }

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body == "Unknown symbol") {
          document.getElementById('responseAdd').innerHTML = '<h5 class="error">' + ticker + ' Is An Invalid Symbol</h5>'
        } else {
          fs.readFile('./data/watchlist.txt', 'utf8', function(err, contents) {


            var ncall = contents.split('\n')
            if (ncall.includes(ticker)) {
              return document.getElementById('responseAdd').innerHTML = '<h5 class="error">' + ticker + ' Is Already Monitored</h5>'
            }
            ncall.push(ticker)
            fs.truncate('./data/watchlist.txt', 0, function() {
              console.log('done')
            })
            for (var i = 0; i < ncall.length; i++) {
              // Iterate over numeric indexes from 0 to 5, as everyone expects.
              if (ncall[i] != "") {
                fs.appendFile('./data/watchlist.txt', ncall[i] + '\n', function(err) {
                  console.log('i')
                });
              }

            }
          })


        }
        document.getElementById('responseAdd').innerHTML = '<h5 class="success">' + ticker + ' Added To List</h5>'

      } else {
        document.getElementById('responseAdd').innerHTML = '<h5 class="error">' + ticker + ' Is An Invalid Symbol</h5>'
      }
    }
    request(opts, callback);
  }

}

//empty out the main container
function clearContainer() {
  document.getElementsByClassName('container')[0].innerHTML = ""
}


//inititate process of seting up main container
function setupMainContainer() {
  totalRows = 0
  totalCells = 0
  clearContainer()
  document.getElementsByClassName('container')[0].innerHTML = '<div class="row"></div>'
  //cleanse array
  fs.readFile('./data/watchlist.txt', 'utf8', function(err, contents) {
    var rawStockList = contents.split('\n')
    var astockList = []
    var stockList = []
    for (var i = 0; i < rawStockList.length; i++) {
      if (rawStockList[i] != "") {
        astockList.push(rawStockList[i])
      }
    }

    if (astockList.length == 0) {
      document.getElementsByClassName('container')[0].innerHTML = '<h4 class="error">No Stocks Monitored :(</h4>'
    } else {
      //this is horrible code using dom and loops and logic I hate html.

      //for each stock get the data
      for (var i = 0; i < astockList.length; i++) {
        var opts = {
          url: 'https://api.iextrading.com/1.0/stock/' + astockList[i] + '/quote',
          method: 'GET'
        }

        function callback(error, response, body) {
          commitToMain(body)
        }

        request(opts, callback)

      }
      //ipcR.send('createdList', stockList)

    }
  })
}

//commit actions to main container
function commitToMain(data) {

  if (totalCells == 3) {
    totalRows = totalRows + 1
    totalCells = 0
    var currentCont = document.getElementsByClassName('container')[0].innerHTML
    document.getElementsByClassName('container')[0].innerHTML = currentCont + '<div class="row"></row>'
  }

  var stockdata = JSON.parse(data)

  var symbol = stockdata.symbol

  if (stockdata.change < 0) {
    var change = "error"
  } else {
    var change = "success"
  }
  var high = stockdata.high
  var low = stockdata.low
  var lp = stockdata.latestPrice
  var lt = stockdata.latestTime
  var currentrow = document.getElementsByClassName('row')[totalRows].innerHTML
  document.getElementsByClassName('row')[totalRows].innerHTML = currentrow +
    '<div class="col" onclick="openModal(' + "'" + symbol + "'" + ')">' +
    '<h4 class="stockName">' + symbol + '</h4>' +
    '<h3 class="' + change + '">' + lp + '</h3>' +
    '<h5 class="high">High: ' + String(high) + '</h5><h5 class="low">Low: ' + String(low) + '</h5>' +
    '<h5 class="' + change + '">' + 'Change: ' + String(stockdata.change) + '</h5>' +
    '<p class="latestTime">' + lt + ' | ' + stockdata.companyName + '</p>' +
    '</div>'

  totalCells = totalCells + 1

}

function loadInfoOfStock() {
  var stock = document.getElementById('ticker-data').value

  var opts = {
    url: 'https://api.iextrading.com/1.0/stock/' + stock + '/quote',
    method: 'GET'
  }

  function callback(error, response, body) {
    var stockinf = JSON.parse(body)
    if (stockinf.change < 0) {
      var changexo = "error"
    } else {
      var changexo = "success"
    }
    document.getElementById('currentval').className = changexo
    document.getElementById('currentval').innerHTML = stockinf.latestPrice
    document.getElementById('companyName').innerHTML = 'Company Name - ' + stockinf.companyName + '  | '
    document.getElementById('sectorName').innerHTML = 'Sector - ' + stockinf.sector + '  | '
    document.getElementById('pename').innerHTML = 'Exchange - ' + stockinf.primaryExchange + '  '
    document.getElementById('openPrice').innerHTML = 'OPEN - ' + stockinf.open + '  |  '
    if (stockinf.close - stockinf.open < 0) {
      var closeAttr = "error"
    } else {
      var closeAttr = "success"
    }
    document.getElementById("closePrice").className = closeAttr
    document.getElementById('closePrice').innerHTML = 'CLOSE - ' + stockinf.close + '  |  '
    document.getElementById('high').innerHTML = 'HIGH - ' + stockinf.high + '  |  '
    document.getElementById('low').innerHTML = 'LOW - ' + stockinf.low
    document.getElementById('mcap').innerHTML = 'MARKET CAP - ' + stockinf.marketCap + '  |  '

    if (stockinf.change < 0) {
      var changeAttr = "error"
    } else {
      var changeAttr = "success"
    }
    document.getElementById('change').className = changeAttr
    document.getElementById('change').innerHTML = 'Change - ' + stockinf.change
    document.getElementById('52high').innerHTML = 'Week 52 High - ' + stockinf.week52High + '  |  '
    document.getElementById('52low').innerHTML = 'Week 52 Low - ' + stockinf.week52Low + '  |  '
    document.getElementById('volume').innerHTML = 'Volume - ' + stockinf.latestVolume

  }
  request(opts, callback)

  var opts2 = {
    url: 'https://api.iextrading.com/1.0/stock/' + stock + '/news',
    method: 'GET'
  }

  function callback2(error, response, body) {
    var newsinfo = JSON.parse(body)
    console.log(newsinfo.length)
    for (i = 0; i < newsinfo.length; i++) {
      var headline = newsinfo[i].headline
      var source = newsinfo[i].source
      var infoNews = newsinfo[i].summary
      var newsurl = newsinfo[i].url
      var currentNewsCont = document.getElementById('newsContainer').innerHTML
      document.getElementById('newsContainer').innerHTML = currentNewsCont +
        '<div class="row">' +
        '<h5 class="newsHeaders">' + headline + '</h5>' +
        '<a href="' + newsurl + '" class="newsHeaders">Source ' + source + ' | ' + newsurl + '</a><br>' +
        '<p class="stockName">' + infoNews + '</p><br>' +
        '</div>'

    }


  }
  request(opts2, callback2)
}
