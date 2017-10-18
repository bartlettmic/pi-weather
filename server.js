const cp = require('child_process');
const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const vibrant = require('node-vibrant')
const config = require('./config.json');
// var weather = require('./weather.json');

const app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))
    // var _md5 = fs.readFileSync('md5', {}, function(err, buf) { return buf });
var palette = new vibrant(config.imageFileName, {}).getPalette((err, pal) => {
    palette = getColor(pal)
    console.log(palette)
})

schedule.scheduleJob('*/5 * * * *', () => {
    cp.fork("./weather.js").on('exit', () => {
        // _md5 = fs.readFileSync('md5', {}, (err, buf) => { return buf });
        palette = new vibrant(config.imageFileName, {}).getPalette((err, pal) => { palette = getColor(pal) })
var weather = require('./weather.json');
    })
});

var _port = 8080;

// const http = require('http').Server(app);
app.listen(_port, () => { console.log('Listening on ' + _port); });
app.get('/', function(req, res) {
    var weather = require('./weather.json');
    // weather.dicks = function() { return 5; }
    
    //PASS IN SOME FUNCTIONS YO
    
    res.render('index', {
        config: config,
        palette: palette,
        weather: weather,
        uptime: parseUptime(weather.uptime),
        timestamp: parseTimestamp(weather.timestamp),
        weatherData: formatWeatherData(weather)
    });
});

function formatWeatherData(data) {
    // return JSON.stringify(data, null, "\t").replace(/\"/g, "").slice(3,-2).split(/,\n\t*/).slice(0,-1).join("<br/>")
   return JSON.stringify(data, null, "\t").replace(/\"/g, "").slice(3,-2).split(/,\n\t*/)
}

function getColor(palette) {
    if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");
}

function parseTimestamp(ms) {
    var d = new Date(+ms);
    return (d.getHours() % 13) +
        ':' + d.getMinutes()
        //+ ':' + d.getSeconds() 
        +
        ' ' + (d.getHours() > 12 ? 'PM' : 'AM') + ', ' +
        (d.getMonth() + 1) + '/' +
        d.getDate() + '/' +
        (d.getFullYear().toString().substr(-2));
}

function parseUptime(ms) {
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + sec + "s";
}