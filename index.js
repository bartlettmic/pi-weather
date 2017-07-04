const fs = require('fs');
const Particle = require('particle-api-js');
const particle = new Particle();
const token = 'ab3e0bb7c384847246e3c8276afa54adbf5971f4';
const ID = '3b0035000247353137323334';

var schedule = require('node-schedule');
var j = schedule.scheduleJob('0 * * * * *', function() {
    var output = {};

    var devicesPr = particle.getDevice({ deviceId: ID, auth: token });
    devicesPr.then(function(data) {
            var vars = Object.getOwnPropertyNames(data.body.variables);
            var promises = [];
            for (var v of vars) promises.push(particle.getVariable({ deviceId: ID, name: v, auth: token }));
            Promise.all(promises).then(values => {
                for (var v of values) output[v.body.name] = v.body.result;
                fs.writeFileSync('weather.json', JSON.stringify(output), 'utf8');
            });
        },
        function(err) {
            console.log('API call failed.');
        }
    );
});