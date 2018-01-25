const imageManipulator = require("jimp");
// const vibrant = require('node-vibrant')

const DARK_IMAGE_SIZE_THRESHOLD = 600 //KB

var config = { snapshot: {}, server: {} };
var filePath = "";

const raspistill = require('node-raspistill').Raspistill
const camera = new raspistill({
    noFileSave: true,
    width: config.snapshot.width,
    height: config.snapshot.height,
    time: 0,
});

const defaultReturn = { timestamp: -1, palette: config.snapshot.defaultPalette }

module.exports = function(_config) {
    for (var p of Object.keys(config)) config[p] = _config[p]
    filePath = config.server.staticDirectory + config.snapshot.fileName
    return tryRaspiStill
}

///////////////////////////////////////////// Helper functions
function tryRaspiStill(callback) {
    return new Promise((resolve, reject) => {
        // camera.takePhoto()
        camera.takePhoto()
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
    var save = KB > DARK_IMAGE_SIZE_THRESHOLD;
    var timestamp = -1;
    if (save) {
        timestamp = Math.round((new Date()).getTime() / 1000)
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
    } 
    // var palette = 
    return { timestamp: timestamp, palette: palette }
}


function getColor(palette) {
    var palettes = ['LightVibrant', 'LightMuted', 'Vibrant', 'Muted', 'DarkMuted']
    for (var pal of palettes) {
        try {
            return palette[pal]._rgb.map((c) => { return Math.round(c) }).join(",")
        } catch (e) {}
    }
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