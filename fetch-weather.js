const fs = require('fs');
const Particle = require('particle-api-js');
const particle = new Particle();
const config = require('./config');
const parse = require('./parse-weather');

module.exports = function(callback) {
    particle.callFunction({
        deviceId: config.ID,
        auth: config.token,
        name: 'update',
        argument: '' //Update this if we ever need conditional results, maybe sleep?
    }).then((data) => {
        process.stdout.write('Fetching... ');
        particle.getDevice({ deviceId: config.ID, auth: config.token }).then((data) => {
            var promises = [];

            for (var v of Object.getOwnPropertyNames(data.body.variables)) {
                promises.push(
                    particle.getVariable({ deviceId: config.ID, name: v, auth: config.token })
                    .then((data) => {
                        var _trunc = (+data.body.result).toFixed(2);
                        if (!isNaN(_trunc)) data.body.result = _trunc;
                        return data;
                    }, (err) => { console.log(err), callback(err) })
                )
            }

            Promise.all(promises).then(values => {
                var output = {};
                for (var v of values) output[v.body.name] = v.body.result;
                output.timestamp = Date.now().toString();
                output.rain *= 0.011;
                fs.writeFileSync('weather.json', JSON.stringify(output, null, "\t"), 'utf8');
                output = parse(output)
                    // for (var v of Object.getOwnPropertyNames(output)) {}
                process.stdout.write('\r' + output.timestamp);
                callback(null, output)
            }).catch((err) => { console.log("Unable to resolve all promises."), callback(err) })
            
        }, (err) => { console.log('Device call failed.', err), callback(err) });
    }, (err) => { console.log('Unable to update station.', err), callback(err) });
}