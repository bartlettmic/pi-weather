const fs = require('fs');
const config = require('./config');
const DARK_IMAGE_SIZE_FILTER_THRESHOLD = 600//KB
const IMAGE_HEIGHT = 1080;
const IMAGE_WIDTH = 1920;

// imgur.setCredentials(config.imgur.username, config.imgur.password, (config.imgur.client || saveClientID()));

module.exports = function(callback) {
    new(require('node-raspistill').Raspistill)({

        noFileSave: true,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,

    })
    .takePhoto().then((buff) => {filterDarkImagesAndSave(buff, callback); }, webcamFailsafe(callback) )
}

///////////////////////////////////////////// Helper functions
function filterDarkImagesAndSave(buffBase64, callback) {
    var KB = Buffer.byteLength(buffBase64, 'base64') / 1000;
    process.stdout.write(" " + KB + "KB");
    if (KB > DARK_IMAGE_SIZE_FILTER_THRESHOLD) {
        var timestamp = (new Date()).getTime()
       try {
        fs.writeFileSync(config.publicDirectory + config.imageFileName, buffBase64, 'base64')
        if (config.imageDirectory) fs.writeFileSync(`${config.imageDirectory}${Math.round(timestamp / 1000)}.${config.imageExt}`, buffBase64, 'base64')
       } catch(e) {}
        process.stdout.write("+");
        callback(timestamp);
    } 
    else {
        process.stdout.write("-");
        callback(-1)
    }
}

function webcamFailsafe(callback) {
    require("node-webcam").capture("", {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        quality: 100,
        delay: 0,
        output: "jpeg",
        saveShots: false,
        callbackReturn: "base64"
    }, (err, URI) => { 
        if (err) callback(null, err)
        else filterDarkImagesAndSave(URItoBase64(URI), callback)   
    })
}

function URItoBase64(URI) {
    return (new Buffer(URI.substring(URI.indexOf('base64') + 7), 'base64'))
}