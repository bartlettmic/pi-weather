const fs = require('fs');
const RaspiCam = require("raspicam");
const Particle = require('particle-api-js');
const particle = new Particle();
const token = 'ab3e0bb7c384847246e3c8276afa54adbf5971f4';
const ID = '3b0035000247353137323334';

// var schedule = require('node-schedule');
// var j = schedule.scheduleJob('*/5 * * * *', function() {
var camera = new RaspiCam({ mode: "photo", output: "./snapshot.png", w: 1920, h: 1080, e: "png" });
camera.start();
// camera.stop();
camera.on("started", function() { console.log("Taking picture"); });
camera.on("exited", function() { consolg.log("Closed camera"); });

particle.getDevice({ deviceId: ID, auth: token }).then(function(data) {
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
// });