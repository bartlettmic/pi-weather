const cp = require('child_process');
const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const config = require('./config.json');

const app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))
var _md5 = fs.readFileSync('md5', {}, function(err, buf) { return buf });

schedule.scheduleJob('*/5 * * * *', () => {
    cp.fork("./weather.js")
        .on('exit', () => {
            _md5 = fs.readFileSync('md5', {}, (err, buf) => { return buf });
        })
});

var _port = 8080;

// const http = require('http').Server(app);
app.listen(_port, () => { console.log('Listening on ' + _port); });
app.get('/', function(req, res) { res.render('index', { _md5: _md5 }); });
