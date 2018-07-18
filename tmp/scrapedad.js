const Particle = require('particle-api-js');
const particle = new Particle();

const config = {
    ID: "1a0035001147343438323536",
    token: "ab3e0bb7c384847246e3c8276afa54adbf5971f4"
}

const expected = [
    "baroTemp",
    "humidity",
    "pascals",
    "wind",
    "windir",
    "rainin"
]

function fetchEach(index, measurements, output) {
    if (!measurements[index]) return Promise.resolve(output)
    process.stdout.write('.')
    return particle.getVariable({ deviceId: config.ID, name: measurements[index], auth: config.token })
        .then(data => {
            var truncatedValue = truncate(data.body.result);
            if (isNaN(truncatedValue)) truncatedValue = data.body.result;
            output[data.body.name] = truncatedValue;
            return Promise.resolve(fetchEach(++index, measurements, output))
        })
}

// setInterval(update, config.updateInterval)

update();

function update() {
    // particle.getDevice({ deviceId: config.ID, auth: config.token }).then(data => fetchEach(0, Object.getOwnPropertyNames(data.body.variables), {}))
    fetchEach(0, expected, {})
        .then(output => pushWeather(output))
        .catch(err => console.log(err))
}

function pushWeather(weather) {
    var output = {
        // temperature: weather.baroTemp,
        // humidity: weather.humidity,
        // pressure: weather.pascals,
        // wind: weather.wind.toString() + get_wind_direction(weather.windir),
        // rain: weather.rainin
        t: weather.baroTemp,
        h: weather.humidity,
        p: weather.pascals,
        w: weather.wind.toString() + get_wind_direction(weather.windir),
        r: weather.rainin
    }
    
    
    
    // WE NEED A TRANSLATION TABLE AAAAAAAAHHHH
    
    
    
    output = JSON.stringify(output);
    console.log(output)
    particle.callFunction({
        deviceId: "3b0035000247353137323334",
        auth: "3e05bc06df412e5df2ad828d36e3d648ce34a34f",
        name: 'pushUpdate',
        argument: output
    }).then(res => console.log("pushed?"))
}

function truncate(num) {
    return Math.round(100 * num) / 100;
}

function get_wind_direction(adc) {
    if (adc == 360) return "N";
    if (adc == 45) return "NE";
    if (adc == 90) return "E";
    if (adc == 135) return "SE";
    if (adc == 180) return "S";
    if (adc == 225) return "SW";
    if (adc == 260) return "W";
    if (adc == 325) return "NW";
    return "ERR"; // error, disconnected?
}