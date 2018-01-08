const imageManipulator = require("jimp");
// const vibrant = require('node-vibrant')

const DARK_IMAGE_SIZE_THRESHOLD = 600 //KB
    // const config.snapshot.height = 1080;
    // const config.snapshot.width = 1920;

var config = { snapshot: {}, server: {} };
var filePath = "";

// const raspistill = require('node-raspistill').Raspistill
// const camera = new raspistill({
//     noFileSave: true,
//     width: config.snapshot.width,
//     height: config.snapshot.height,
//     time: 0,
// });

const PiCamera = require('pi-camera');
var camera
const defaultReturn = { timestamp: -1, palette: config.snapshot.defaultPalette }

module.exports = function(_config) {
    for (var p of Object.keys(config)) config[p] = _config[p]
    filePath = config.server.staticDirectory + config.snapshot.fileName

    camera = new PiCamera({
        mode: 'photo',
        output: config.server.staticDirectory + 'tmp.jpg',
        width: config.snapshot.width,
        height: config.snapshot.height,
        nopreview: true,
    });

    return tryRaspiStill
}

///////////////////////////////////////////// Helper functions
function tryRaspiStill(callback) {
    return new Promise((resolve, reject) => {
        // camera.takePhoto()
        camera.snap()
            .then(buff => {
                console.log(buff)
                resolve({ image: curateAndSaveImage(buff) })
            })
            .catch(err => resolve(defaultReturn))
    })
}

function curateAndSaveImage(buffBase64, callback) {
    var KB = Buffer.byteLength(buffBase64, 'base64') / 1000;
    console.log(KB)
    var save = KB > DARK_IMAGE_SIZE_THRESHOLD
    if (save) {
        var timestamp = Math.round((new Date()).getTime() / 1000)
        try {
            imageManipulator.read(buffBase64, (err, image) => {
                if (err) callback(err)
                else {
                    //Preserve unmodified image if config specified a directory
                    if (config.snapshot.timelapseDirectory) image.write(`${config.snapshot.timelapseDirectory}${timestamp}.${image.getExtension()}`);
                    image.resize(config.snapshot.width / 4, config.snapshot.height / 4).write(filePath, err => { if (err) callback(err) })
                }
            })
        } catch (e) {}
        return { timestamp: timestamp, palette: palette }
    } else return defaultReturn
        // callback(null, timestamp,  KB, save);
}

// function webcamFallback(callback) {
//     require("node-webcam").capture(config.server.staticDirectory, {
//         width: config.snapshot.width,
//         height: config.snapshot.height,
//         quality: 100,
//         delay: 0,
//         output: "jpeg",
//         saveShots: false,
//         callbackReturn: "base64"
//     }, (err, URI) => {
//         if (err) callback(err)
//         else curateAndSaveImage(URItoBase64(URI), callback)
//     })
// }

// function URItoBase64(URI) {
//     return (new Buffer(URI.substring(URI.indexOf('base64') + 7), 'base64'))
// }