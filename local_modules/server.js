// const schedule = require('node-schedule');
const exp = require('express');
const app = exp()
var config = { server: {}, snapshot: {}, updateRate: 300000 };
var deliverables = {
    image: {
        timestamp: Date.now(),
        palette: config.snapshot.defaultPalette
    },
    weather: {
        pretty: {
            measurements: ["Initializing..."],
            timestamp: Date.now().toLocaleString()
        },
        json: {
            measurements: ["Initializing..."],
            timestamp: Date.now()
        }
    }
}

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    payload = { imageFileName: config.snapshot.fileName }

    app.listen(config.server.port, () => { console.log('Listening on ' + config.server.port); })
    app.set('views', config.server.viewDirectory).set('view engine', 'pug')
    app.use(exp.static(config.server.staticDirectory))
    app.get('/', (req, res) => { res.render('index', payload) })
    app.get('/weather', (req, res) => { res.jsonp(deliverables.weather.json) })

    return function(payload) {
        deliverables = Object.assign(deliverables, payload)
        // console.log(deliverables)
    }
}

// imageTimestamp: Date.now(),
// palette: config.snapshot.defaultPalette,
// measurements: [],
// weatherTimestamp: Date.now(),
// weatherJSON: {}