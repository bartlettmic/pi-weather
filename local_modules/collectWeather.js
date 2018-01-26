const Particle = require('particle-api-js');
const particle = new Particle();
// const particle = new( (require('particle-api-js'))() )

var config = { particle: {}, weather: {}, server: {} };

module.exports = function(_config) {
    for (var p of Object.keys(config)) config[p] = _config[p]
    return scrapeWeather
}

//Helper
function scrapeWeather() {
    return new Promise((resolve, reject) => {
        particle.callFunction({
                deviceId: config.particle.ID,
                auth: config.particle.token,
                name: 'update',
                argument: '' //Update this if we ever need conditional results, maybe sleep time?
            })
            .then((data) => {
                return particle.getVariable({
                    name: "JSON",
                    deviceId: config.particle.ID,
                    auth: config.particle.token
                })
            })
            .then(data => {
                var output = {
                    measurements: JSON.parse(data.body.result),
                    timestamp: Date.now()
                };
                
                var wind_ = output.measurements.wind.split(",")
                
                output.measurements.wind = {
                    speed: wind_[0],
                    direction: wind_[1]
                }
                
                output = truncate(output)

                resolve({ pretty: prettifyWeather(output), json: output })
            })
            .catch(err => { console.log("Error fetching measurements"), reject(err) })
    })
}

function prettifyWeather(weather) {
    return {
        measurements: prettifyMeasurements(weather.measurements),
        timestamp: parseTimestamp(weather.timestamp)
        // uptime: parseUptime(weather.uptime),
    }
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

// function parseUptime(ms) {
//     days = Math.floor(ms / (24 * 60 * 60 * 1000));
//     daysms = ms % (24 * 60 * 60 * 1000);
//     hours = Math.floor((daysms) / (60 * 60 * 1000));
//     hoursms = ms % (60 * 60 * 1000);
//     minutes = Math.floor((hoursms) / (60 * 1000));
//     minutesms = ms % (60 * 1000);
//     sec = Math.floor((minutesms) / (1000));
//     return (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + sec + "s";
// }

//TODO: Read these specifications from config
function prettifyMeasurements(data) {
    var output = {}
    output["Temperature"] = data.temperature + "\u00B0F (" + truncate((data.temperature - 32) / 1.8) + "\u00B0C)";
    output["Humidity"] = truncate(data.humidity) + "%";
    output["Pressure"] = truncate(data.pressure) + " hPa"
    output["Rain"] = data.rain + " in/hr"
    output["Wind Speed"] = data.wind.speed + " mph";
    if (data.wind.direction) output["Wind Direction"] = unicodeWindDirection(data.wind.direction);
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