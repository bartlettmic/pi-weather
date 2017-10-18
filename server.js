const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const vibrant = require('node-vibrant')
const config = require('./config');
const weather = require('./weather.js')
var photonWeatherOutput, palette;

var update = function() {
    weather((err, output) => {
        if (err) console.log(err)
        else {
            photonWeatherOutput = output;
            palette = new vibrant(config.imageFileName, {}).getPalette((err, pal) => { palette = getColor(pal) })
        }
    })
}
update()

// setInterval(update, 60000)
setInterval(update, 300000)

const app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))

// schedule.scheduleJob('*/1 * * * *', () => {

// });

var _port = 8080;

app.listen(_port, () => { console.log('Listening on ' + _port); });

//Request -> Response
app.get('/', function(req, res) {
    res.render('index', {
        config: config,
        palette: palette,
        measurements: photonWeatherOutput.measurements,
        timestamp: photonWeatherOutput.timestamp,
        uptime: photonWeatherOutput.uptime
    });
});

function getColor(palette) {
    if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");
}