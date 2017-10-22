const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const vibrant = require('node-vibrant')
const modules = require('./modules');
var photonWeatherOutput, palette, imageChecksum;

var update = function() {
    modules.fetchWeather((err, output) => {
        if (err) console.log(err)
        else {
            photonWeatherOutput = output;
            palette = new vibrant(modules.config.imageFileName, {}).getPalette((err, pal) => { palette = getColor(pal) })
        }
    })

    modules.capturePhoto((err, output) => {
        if (err) console.log(err)
        else {
            //Sharp shit?
            //  Nah probably do that directly in photo-capture
            imageChecksum = output;
        }
    });
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
        config: modules.config,
        palette: palette,
        imageChecksum: imageChecksum,
        measurements: photonWeatherOutput.measurements,
        timestamp: photonWeatherOutput.timestamp,
        uptime: photonWeatherOutput.uptime
    });
});

function getColor(palette) {
    for (var p of palette) console.log(p)
    if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");
}