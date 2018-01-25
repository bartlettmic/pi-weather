// const schedule = require('node-schedule');
const exp = require('express');
const app = exp()
var config = { server: {}, snapshot: {}, updateRate: 300000 };
var servables = {}

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]

    servables = {
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
    app.get('/', (req, res) => { res.render('index', servables) })
    app.get('/weather', (req, res) => { res.jsonp(servables.weather.json) })
    app.get('/wind', (req, res) => { res.send("<style>body { background-color: grey;}</style>" + servables.graphs.wind) })
    app.get('/history', (req, res) => { res.send(servables.history) })
    app.get('/servables', (req, res) => { res.send(servables) })

    /* TO-DO: Services:
                        Graph to png service
                        Database explorer service
    */

    return function(payload) {
        //TO-DO: FOR THE LOVE OF GLOB FIND A WAY TO APPEND FUNCTIONS PASSED IN HERE TO SERVABLES
        //        for e.... if e.prototype??????

        servables = Object.assign(servables, payload)
            // console.log(servables)
    }
}