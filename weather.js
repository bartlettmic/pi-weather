const fs = require('fs');
const Particle = require('particle-api-js');
const particle = new Particle();
const imgur = require('imgur');
const config = require('./config.json');

if (!config.imgur.client) {
    config.imgur.client = imgur.getClientId()
    fs.writeFileSync('config.json', JSON.stringify(config, null, "\t"), 'utf8');
}

new(require('node-raspistill').Raspistill)({ outputDir: './', fileName: config.imageFileName.split('.')[0], width: 1920, height: 1080, encoding: config.imageFileName.split('.')[1], })
.takePhoto().then((buff) => {
    fs.writeFileSync('md5', require('md5')(buff), 'utf8');
    fs.writeFileSync("./img/weather/texture-rain-bg.png", buff, 'utf8');
    fs.writeFileSync("./img/weather/texture-rain-fg.png", buff, 'utf8');
    process.stdout.write(" "+(Buffer.byteLength(buff,'base64')/1000) + "KB ");
    if (Buffer.byteLength(buff, 'base64') / 1000 > 600) {
        // console.log("Photo captured")
        imgur.setCredentials(config.imgur.username, config.imgur.password, config.imgur.client);
        imgur.uploadBase64(buff.toString('base64'), config.imgur.album).then(() => { console.log('+') }).catch((err) => { console.error("!") });
    } else console.log("-");
}).catch((err) => { console.log("Unable to access Pi Camera module.") })

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
                            }, function(err) { console.log(err) })
                        )
                    }
                    Promise.all(promises).then(values => {
                        var output = {};
                        for (var v of values) output[v.body.name] = v.body.result;
                        output.timestamp = new Date().toLocaleString();
                        fs.writeFileSync('weather.json', JSON.stringify(output, null, "\t"), 'utf8');
                        // for (var v of Object.getOwnPropertyNames(output)) {}
                        process.stdout.write("(" + output.timestamp + ")");
                    }).catch(function(err) { console.log("Unable to resolve all promises.", err); })
                },
                function(err) { console.log('Device call failed.', err); });
        },
        function(err) { console.log('Unable to update station.', err); });
