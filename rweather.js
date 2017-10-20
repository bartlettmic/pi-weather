// module.exports = function(callback) {
    const fs = require('fs');
    const Particle = require('particle-api-js');
    const particle = new Particle();
    const imgur = require('imgur');
    const config = require('./config');
    const parse = require('./parse-weather');

    imgur.setCredentials(config.imgur.username, config.imgur.password, config.imgur.client);
    if (!config.imgur.client) {
        config.imgur.client = imgur.getClientId()
        fs.writeFileSync('config.json', JSON.stringify(config, null, "\t"), 'utf8');
    }

    new(require('node-raspistill').Raspistill)({ outputDir: './', fileName: config.imageFileName.split('.')[0], width: 1920, height: 1080, encoding: config.imageFileName.split('.')[1], })
    .takePhoto().then((buff) => {
        process.stdout.write(" " + (Buffer.byteLength(buff, 'base64') / 1000) + "KB ");
        if (Buffer.byteLength(buff, 'base64') / 1000 > 600) {
            imgur.uploadBase64(buff.toString('base64'), config.imgur.album).then(() => { console.log('+') }).catch((err) => { console.error("!") });
        } else console.log("-")
    }).catch((err) => { console.log("Unable to access Pi Camera module."); callback(err) })


    particle.callFunction({ deviceId: config.ID, name: 'update', argument: '', auth: config.token })
        .then(function(data) {
                process.stdout.write('Updated... ');
                particle.getDevice({ deviceId: config.ID, auth: config.token }).then(function(data) {
                        var promises = [];
                        for (var v of Object.getOwnPropertyNames(data.body.variables)) {
                            promises.push(particle.getVariable({ deviceId: config.ID, name: v, auth: config.token })
                                .then(function(data) {
                                    var _trunc = (+data.body.result).toFixed(2);
                                    if (!isNaN(_trunc)) data.body.result = _trunc;
                                    // process.stdout.write(data.body.name + "=" + data.body.result + " ")
                                    return data;
                                }, function(err) { console.log(err);
                                    callback(err) })
                            )
                        }
                        Promise.all(promises).then(values => {
                            var output = {};
                            for (var v of values) output[v.body.name] = v.body.result;
                            output.timestamp = Date.now().toString();
                            output.rain *= 0.011;
                            output = parse(output)
                            fs.writeFileSync('weather.json', JSON.stringify(output, null, "\t"), 'utf8');
                            // for (var v of Object.getOwnPropertyNames(output)) {}
                            process.stdout.write(output.timestamp);
                            return callback(null, output)
                        }).catch(function(err) { console.log("Unable to resolve all promises.");
                            callback(err) })
                    },
                    function(err) { console.log('Device call failed.', err);
                        callback(err) });
            },
            function(err) { console.log('Unable to update station.', err);
                callback(err) });
                
        function callback(err, data) { console.log(err); console.log(data)}
// }