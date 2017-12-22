#!node
const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const vibrant = require('node-vibrant')
const modules = require('./local_modules');
var photonWeatherOutput, 
palette = "158,197,216", 
imageTimestamp = (new Date()).getTime();

modules.config.imageExt = modules.config.imageFileName.split('.').slice(-1); //Get extension of image from filename, e.g. jpg

var update = function() {
     modules.fetchWeather((output, err) => {
        if (err) console.log(err)
        else {
            photonWeatherOutput = output;            
        }
    })

    modules.capturePhoto((timestamp, err) => {
        if (err) console.log(err)
        else {
            //Sharp shit?
            //  Nah probably do that directly in photo-capture
            if (timestamp > 0) {
                imageTimestamp = timestamp;
                palette = new vibrant(modules.config.publicDirectory + modules.config.imageFileName, {}).getPalette((err, pal) => { 
                    try { palette = getColor(pal) } catch(e) { palette = "158,197,216" };
                })
            }
            
            console.log()
        }
    });
}
update();

// setInterval(update, 60000)
setInterval(update, 300000)

const app = exp();
app.set('views', modules.config.publicDirectory);
app.set('view engine', 'pug');
app.use(exp.static(modules.config.publicDirectory))

// schedule.scheduleJob('*/1 * * * *', () => {

// });

var _port = 8080;

app.listen(_port, () => { console.log('Listening on ' + _port); });

//Request -> Response
app.get('/', function(req, res) {
    res.render('index', {
        config: modules.config,
        palette: palette,
        imageTimestamp: imageTimestamp,        
        measurements: photonWeatherOutput.measurements,
        weatherTimestamp: photonWeatherOutput.timestamp,
        uptime: photonWeatherOutput.uptime
    });
});

function getColor(palette) {
    var palettes = ['LightVibrant','LightMuted','Vibrant','Muted','DarkMuted']
    for (var pal of palettes) {
    try {
        return palette[pal]._rgb.map((c) => { return Math.round(c) }).join(",")
    } catch(e) {}
}

// if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");

}