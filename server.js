var childProcess = require('child_process');
var fs = require('fs');
var exp = require('express')
var app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))
// var http = require('http').Server(app);
var schedule = require('node-schedule');

schedule.scheduleJob('*/5 * * * *', function() {
    var process = childProcess.fork("./weather.js");
});

var _port = 8080;

app.listen(_port, () => { console.log('Listening on ' + _port); });
app.get('/', function(req, res) { res.render('index', { fs: fs }); });