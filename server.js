var childProcess = require('child_process');
var fs = require('fs');
var exp = require('express')
var app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))
// var http = require('http').Server(app);
var schedule = require('node-schedule');
var _md5 = fs.readFileSync('md5', {}, function(err, buf) { return buf });

schedule.scheduleJob('*/5 * * * *', function() {
    var process = childProcess.fork("./weather.js");
    _md5 = fs.readFileSync('md5', {}, function(err, buf) { return buf });
});

var _port = 8080;

app.listen(_port, () => { console.log('Listening on ' + _port); });
app.get('/', function(req, res) { res.render('index', { _md5: _md5 }); });