const cp = require('child_process');
const fs = require('fs');
const exp = require('express')
const schedule = require('node-schedule');
const vibrant = require('node-vibrant')
const config = require('./config.json');

const app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))
var _md5 = fs.readFileSync('md5', {}, function(err, buf) { return buf });
var palette = new vibrant(config.imageFileName, {}).getPalette((err, pal) => {
    palette = getColor(pal)
    console.log(palette)
})

schedule.scheduleJob('*/5 * * * *', () => {
    cp.fork("./weather.js").on('exit', () => {
        _md5 = fs.readFileSync('md5', {}, (err, buf) => { return buf });
        palette = new vibrant(config.imageFileName, {}).getPalette((err, pal) => { palette = palette = getColor(pal) })
    })
});

var _port = 8080;

// const http = require('http').Server(app);
app.listen(_port, () => { console.log('Listening on ' + _port); });
app.get('/', function(req, res) { res.render('index', { config: config, _md5: _md5, palette: palette }); });

function getColor(palette) {
    // if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
    if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
    // if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");
}