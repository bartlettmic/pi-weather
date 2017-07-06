const fs = require('fs');
const RaspiCam = require("raspicam");
const Particle = require('particle-api-js');
const particle = new Particle();
const config = require('./config.json');

//var schedule = require('node-schedule');
//schedule.scheduleJob('*/5 * * * *', function() {
var camera = new RaspiCam({ mode: "photo", output: "/var/www/html/snapshot.png", w: 960, h: 540, e: "png", timeout: 4000 });
camera.start();
camera.on("read", function(err, filename) {
    setTimeout(function() {
        camera.stop();
        console.log("exitting...");
    }, camera.get("timeout"))
});
console.log(config);
console.log(config.ID);
console.log(config.config);

particle.getDevice({ deviceId: config.ID, auth: config.token }).then(function(data) {
        var promises = [];
        for (var v of Object.getOwnPropertyNames(data.body.variables)) promises.push(particle.getVariable({ deviceId: ID, name: v, auth: token }));
        Promise.all(promises).then(values => {
            var output = {};
            for (var v of values) output[v.body.name] = v.body.result;
            output.timestamp = new Date().toLocaleString();
            fs.writeFileSync('weather.json', JSON.stringify(output), 'utf8');
        })
        .catch(function(err) {
            console.log("Unable to resolve all promises."); // some coding error in handling happened
        });
    },
    function(err) {
        console.log('API call failed.');
    }
);
//});
