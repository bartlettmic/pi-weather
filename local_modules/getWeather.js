const Particle = require('particle-api-js');
const particle = new Particle();
// const particle = new( (require('particle-api-js'))() )

var config = { particle: {}, weather: {}, server: {} };

module.exports = function(_config) {
    for (var p of Object.keys(config)) config[p] = _config[p]
    if (config.weather.generateFakeData) return fakeWeather
    else return scrapeWeather
}

//Helper
function scrapeWeather() {
    return new Promise((resolve, reject) => {
        particle.callFunction({
                deviceId: config.particle.ID,
                auth: config.particle.token,
                name: 'fakeUpdate',
                // name: 'update',
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
                    speed: +wind_[0],
                    direction: wind_[1]
                }
                resolve({ pretty: prettifyWeather(output), json: output })
            })
            .catch(err => {
                console.log("Error fetching measurements", err),
                    reject(err)
            })
    })
}

function fakeWeather() {
    var fakeOutput = {
        measurements: {
            temperature: truncate(70 - 10 * ((new Date).getHours() / 24) + (1 - 2 * Math.random())),
            humidity: truncate(25 + 10 * ((new Date).getHours() / 24) + (1 - 2 * Math.random())),
            pressure: truncate(730 + 10 * ((new Date).getHours() / 24) + (1 - 2 * Math.random())),
            wind: {
                speed: truncate(Math.random() * 12),
                // direction: getDirection(
                //     parseInt(
                //         (
                //             ((new Date).getHours() % 6)+ 1
                //         ) / 6 * 7 +
                //             (Math.random > 0.5 ? ( 1 - 2 * Math.random() ) : 0)
                //         )
                //     ),
                direction: "W"
            },
            rain: truncate(20 * Math.random() > 19 ? Math.random() * 5 : 0)
        },
        timestamp: Date.now()
    }
    return Promise.resolve({ pretty: prettifyWeather(fakeOutput), json: fakeOutput })
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
    if (data.rain) output["Rain"] = data.rain + " in/hr"
    if (data.wind.speed) output["Wind Speed"] = data.wind.speed + " mph";
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

function getDirection(oct) {
    if (isNaN(oct)) switch (oct) {
        case "N":
            return 0
        case "NE":
            return 1
        case "E":
            return 2
        case "SE":
            return 3
        case "S":
            return 4
        case "SW":
            return 5
        case "W":
            return 6
        case "NW":
            return 7
        default:
            return -1
    }
    else switch (oct % 8) {
        case 0:
            return "N"
        case 1:
            return "NE"
        case 2:
            return "E"
        case 3:
            return "SE"
        case 4:
            return "S"
        case 5:
            return "SW"
        case 6:
            return "W"
        case 7:
            return "NW"
        default:
            return "?"
    }
}