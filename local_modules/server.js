
// const schedule = require('node-schedule');
const exp = require('express');
const app = exp()
var config = { server: {}, snapshot: {}, updateRate: 300000 };
var deliverables = {}

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    
    deliverables = {
        imageFileName: config.snapshot.fileName,
        updateRate: config.updateRate,
        graphs: {
          wind: require('fs').readFileSync(`${config.server.assetDirectory}AnenometerVaneTemplate.svg`).toString()
        },
        image: {
            timestamp: Date.now(),
            palette: config.snapshot.defaultPalette
        },
        weather: {
            pretty: {
                measurements: ["Initializing..."],
                timestamp: (new Date).toLocaleString()
            },
            json: {
                measurements: ["Initializing..."],
                timestamp: Date.now()
            }
        }
    }
    
    app.listen(config.server.port, () => { console.log('Listening on ' + config.server.port); })
    
    app.set('views', config.server.viewDirectory).set('view engine', 'pug')
    app.use(exp.static(config.server.staticDirectory))
    app.get('/', (req, res) => { res.render('index', deliverables) })
    app.get('/weather', (req, res) => { res.jsonp(deliverables.weather.json) })
    app.get('/wind', (req, res) => { res.send("<style>body { background-color: grey;}</style>"+deliverables.graphs.wind) })
    app.get('/history', (req, res) => { res.send(deliverables.history) })
    app.get('/deliverables', (req, res) => { res.send(deliverables) })

    return function(payload) {
        deliverables = Object.assign(deliverables, payload)
        // console.log(deliverables)
    }
}