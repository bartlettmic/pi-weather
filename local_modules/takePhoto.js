const imageManipulator = require("jimp");
const raspistill = require('node-raspistill').Raspistill
    // const vibrant = require('node-vibrant')

var config = { snapshot: {}, server: {} };
var filePath = "";
var camera;

const defaultReturn = { timestamp: -1, palette: config.snapshot.defaultPalette }

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    filePath = config.server.staticDirectory + config.snapshot.fileName
    camera = new raspistill({
        noFileSave: true,
        width: config.snapshot.width,
        height: config.snapshot.height,
        verticalFlip: true,
        horizontalFlip: true,
        time: 0,
    });
    return tryRaspiStill
}

///////////////////////////////////////////// Helper functions
function tryRaspiStill(callback) {
    return new Promise((resolve, reject) => {
        // camera.takePhoto()
        camera.takePhoto()
            .then(buff => { resolve( curateAndSaveImage(buff, reject) ) })
            .catch(err => resolve(defaultReturn))
    })
}

function curateAndSaveImage(buffBase64, callback) {
    var KB = Buffer.byteLength(buffBase64, 'base64') / 1000;
    if (KB > config.snapshot.kbSizeThreshold) {
        var timestamp = Math.round((new Date()).getTime() / 1000)
        try {
            imageManipulator.read(buffBase64, (err, image) => {
                if (err) callback(err)
                else {
                    //Preserve unmodified image if config specified a directory
                    if (config.snapshot.timelapseDirectory) image.write(`${config.snapshot.timelapseDirectory}${timestamp}.${image.getExtension()}`);
                    image.resize(
                            config.snapshot.width / config.snapshot.downscale,
                            config.snapshot.height / config.snapshot.downscale)
                        .write(filePath, err => { if (err) callback(err) })
                }
            })
            return {timestamp: timestamp, pallette: config.snapshot.defaultPalette}
        } catch (e) {}
    }
    // var palette = 
    return defaultReturn
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