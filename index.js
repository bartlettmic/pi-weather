var Particle = require('particle-api-js');
var particle = new Particle();
var token = 'ab3e0bb7c384847246e3c8276afa54adbf5971f4';

particle.login({
    username: 'bobbybart62@gmail.com',
    password: 'gibson#1'
}).then(

    function(data) {
        token = data.body.access_token;
    },
    function(err) {
        console.log('Could not log in.', err);
    }
);

var devicesPr = particle.listDevices({ auth: token }),
    photid;

token = 'ab3e0bb7c384847246e3c8276afa54adbf5971f4';

devicesPr.then(

    function(devices) {
        photid = devices.body[0].id
        console.log(devices.body[0]);
    },
    function(err) {
        console.log('List devices call failed: ');
    }
);

// get_wind_speed()
token = 'ab3e0bb7c384847246e3c8276afa54adbf5971f4';

particle.getVariable({ deviceId: '3b0035000247353137323334', name: 'soc', auth: token }).then(function(data) {
    console.log('Device variable retrieved successfully:', data);
}, function(err) {
    console.log('An error occurred while getting attrs:', err);
});