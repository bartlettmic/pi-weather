#!node

const config = require('./config.json');


const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const vibrant = require('node-vibrant')
const modules = require('./local_modules')(config);

var photonWeatherOutput = { measurements: null, timestamp: null, uptime: null },
    palette = "158,197,216",
    imageTimestamp = (new Date()).getTime();

var update = function() {
    modules.fetchWeather((err, output) => {
        if (err) console.log(err)
        else photonWeatherOutput = output;
    })

    modules.capturePhoto((err, timestamp) => {
        if (err) console.log(JSON.stringify(err, null, ''))
        else {
            if (timestamp > 0) {
                imageTimestamp = timestamp;
                palette = new vibrant(config.publicDirectory + config.snapshot.fileName, {}).getPalette((err, pal) => {
                    try { palette = getColor(pal) } catch (e) { palette = "158,197,216" };
                })
            }
            console.log()
        }
    });
}
update();

setInterval(update, config.refreshRate)

const app = exp();
app.set('views', config.publicDirectory);
app.set('view engine', 'pug');
app.use(exp.static(config.publicDirectory))

// schedule.scheduleJob('*/1 * * * *', () => {

// });

var _port = 8080;

app.listen(_port, () => { console.log('Listening on ' + _port); });

//Request -> Response
app.get('/', function(req, res) {
    res.render('index', {
        palette: palette,
        imageFileName: config.snapshot.fileName,
        imageTimestamp: imageTimestamp,
        measurements: photonWeatherOutput.measurements,
        weatherTimestamp: photonWeatherOutput.timestamp,
        uptime: photonWeatherOutput.uptime
    });
});

function getColor(palette) {
    var palettes = ['LightVibrant', 'LightMuted', 'Vibrant', 'Muted', 'DarkMuted']
    for (var pal of palettes) {
        try {
            return palette[pal]._rgb.map((c) => { return Math.round(c) }).join(",")
        } catch (e) {}
    }

    // if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");

}