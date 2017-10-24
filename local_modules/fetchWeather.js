const fs = require('fs');
const Particle = require('particle-api-js');
const particle = new Particle();
const config = require('./config');

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
                        var _trunc = truncate(data.body.result);
                        if (!isNaN(_trunc)) data.body.result = _trunc;
                        return data;
                    }, (err) => { console.log(err), callback(err) })
                )
            }

            Promise.all(promises).then(values => {
                var output = {};
                for (var v of values) output[v.body.name] = v.body.result;
                output.timestamp = Date.now();
                output.rain *= 0.011;
                fs.writeFileSync(config.publicDirectory + 'weather.json', JSON.stringify(output, null, "\t"), 'utf8');
                output = parseWeather(output)
                    // for (var v of Object.getOwnPropertyNames(output)) {}
                process.stdout.write('\r' + output.timestamp);
                callback(null, output)
            }).catch((err) => { console.log("Unable to resolve all promises."), callback(err) })

        }, (err) => { console.log('Device call failed.', err), callback(err) });
    }, (err) => { console.log('Unable to update station.', err), callback(err) });
}

//Helper
function parseWeather(weather) {
    var output = {
        timestamp: parseTimestamp(weather.timestamp),
        uptime: parseUptime(weather.uptime),
        measurements: formatWeatherData(weather)
    }
    return output;
}

function parseTimestamp(ms) {
    var d = new Date(+ms);
    return ((d.getHours() + 11) % 12 + 1) +
        ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
        ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()) +
        ' ' + (d.getHours() > 12 ? 'PM' : 'AM') +
        ', ' + (d.getMonth() + 1) +
        '/' + d.getDate() +
        '/' + (d.getFullYear().toString().substr(-2));
}

function parseUptime(ms) {
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + sec + "s";
}

function formatWeatherData(data) {
    var output = {}
    output["Temperature"] = data.temperature + "\u00B0F (" + truncate((data.temperature - 32) / 1.8) + "\u00B0C)";
    output["Humidity"] = data.humidity + "%";
    output["Pressure"] = data.pressure + " Pa"
    output["Rain"] = data.rain + " in/hr"
    output["Wind Speed"] = data.winspd + " mph";
    output["Wind Direction"] = unicodeWindDirection(data.windir);
    output = JSON.stringify(output).replace(/[\"|\{|\}]/g, "").split(/,/)
    output.forEach((value, index) => { output[index] = value.split(':').join(': ') })
    return output;
}

function truncate(num) {
    return Math.round(100 * num) / 100;
}

function unicodeWindDirection(winddir) {
    switch (winddir) {
        case "N":
            return "\u2191"
        case "NE":
            return "\u2197"
        case "E":
            return "\u2192"
        case "SE":
            return "\u2198"
        case "S":
            return "\u2193"
        case "SW":
            return "\u2199"
        case "W":
            return "\u2190"
        case "NW":
            return "\u2196"
        default:
            return "\u21ba"
    }
}