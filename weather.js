const fs = require('fs');
const RaspiCam = require("raspicam");
const Particle = require('particle-api-js');
const particle = new Particle();
const config = require('./config.json');

try {
    var camera = new RaspiCam({ mode: "photo", output: "/home/pi/pi-weather/snapshot.png", w: 960, h: 540, e: "png", timeout: 2000 });
    camera.start();
    camera.on("start", function(err, filename) {
        setTimeout(function() { console.log("exitting..."), camera.stop(); }, camera.get("timeout") * 3.0)
    });
    camera.on("read", function(err, filename) {
        setTimeout(function() { console.log("exitting..."), camera.stop(); }, camera.get("timeout"))
    });
} catch (err) { console.log("Unable to access Pi Camera module.") } finally {
    particle.callFunction({ deviceId: config.ID, name: 'update', argument: '', auth: config.token })
        .then(function(data) {
            console.log('Station updated, pulling sensor data...');
            particle.getDevice({ deviceId: config.ID, auth: config.token }).then(function(data) {
                    var promises = [];
                    for (var v of Object.getOwnPropertyNames(data.body.variables)) {
                        promises.push(particle.getVariable({ deviceId: config.ID, name: v, auth: config.token })
                            .then(function(data) {
                                var _trunc = (+data.body.result).toFixed(2);
                                if (!isNaN(_trunc)) data.body.result = _trunc;
                                process.stdout.write(data.body.name + "=" + data.body.result + " ")
                                return data;
                            }, function(err) { console.log(err) })
                        )
                    }
                    Promise.all(promises).then(values => {
                        var output = {};
                        for (var v of values) output[v.body.name] = v.body.result;
                        output.timestamp = new Date().toLocaleString();
                        fs.writeFileSync('weather.json', JSON.stringify(output, null, "\t"), 'utf8');
                        console.log("\nCurrent sensor values recorded.");
                    }).catch(function(err) { console.log("Unable to resolve all promises.", err); })
                },
                function(err) { console.log('Device call failed.', err); });
        }, function(err) { console.log('Unable to update station.', err); });
}