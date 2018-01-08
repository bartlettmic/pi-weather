// const schedule = require('node-schedule');
const exp = require('express');
const app = exp()
var config = { server: {}, snapshot: {}, updateRate: 300000 };
var payload = {}

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    payload = { imageFileName: config.snapshot.fileName }

    app.listen(config.server.port, () => { console.log('Listening on ' + config.server.port); })
    app.set('views', config.server.viewDirectory).set('view engine', 'pug')
    app.use(exp.static(config.server.staticDirectory))
    app.get('/', (req, res) => { res.render('index', payload) })
    app.get('/weather', (req, res) => { res.send(payload.weather.json) })

    return function(package) {
        payload = Object.assign(payload, package)
        console.log(payload)
    }
}

        // imageTimestamp: Date.now(),
        // palette: "158,197,216",
        // measurements: [],
        // weatherTimestamp: Date.now(),
        // weatherJSON: {}