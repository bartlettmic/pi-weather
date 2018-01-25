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


    /*//TO-DO: https
    
        server: { 
            port: {
                http: 8080,
                https: 8443
            }
        }
        
        var fs = require('fs');
        var http = require('http');
        var https = require('https');
        var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
        var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

        var credentials = { key: privateKey, cert: certificate };
        var express = require('express');
        var app = express();

        // your express configuration here

        var httpServer = http.createServer(app);
        var httpsServer = https.createServer(credentials, app);

        httpServer.listen(8080);
        httpsServer.listen(8443);
        
        httpApp.get("*", function (req, res, next) {
            res.redirect("https://" + req.headers.host + "/" + req.path);
        });
    */

    app.listen(config.server.port, () => { console.log('Listening on ' + config.server.port); })

    app.set('views', config.server.viewDirectory).set('view engine', 'pug')
    app.use(exp.static(config.server.staticDirectory))
    app.get('/', (req, res) => { res.render('index', servables) })
    app.get('/weather', (req, res) => { res.jsonp(servables.weather.json) })
    
    app.get('/graph/*', (req, res) => { res.render('graph', { graph: servables.graphs.wind }) })
    
    app.get('/history', (req, res) => { res.jsonp(servables.history) })
    app.get('/servables', (req, res) => { res.send(servables) })

    /* TO-DO: Services:
                        About page!
                        Graph to png
                        Database explorer
                        Immediate update trigger -> async redirect 
                        Isolated graphs? -> Use basic contrast-bg view
                        Forecast?
    */

    return function(payload) {
        //TO-DO: FOR THE LOVE OF GLOB FIND A WAY TO APPEND FUNCTIONS PASSED IN HERE TO SERVABLES
        //        for e.... if e.prototype??????

        servables = Object.assign(servables, payload)
            // console.log(servables)
    }
}