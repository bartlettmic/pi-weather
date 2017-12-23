const imageManipulator = require("jimp");

const DARK_IMAGE_SIZE_THRESHOLD = 600 //KB
const IMAGE_HEIGHT = 1080;
const IMAGE_WIDTH = 1920;

var config = { snapshot: {}, publicDirectory:"" };

module.exports = function(_config) {
    for (var p of Object.keys(config)) config[p]=_config[p]
    return tryRaspiStill
}

///////////////////////////////////////////// Helper functions
function tryRaspiStill(callback) {
    new(require('node-raspistill').Raspistill)({
        noFileSave: true,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
    })
    .takePhoto()
    .then((buff) => { curateAndSaveImage(buff, callback); }, webcamFallback(callback))
}
    
function curateAndSaveImage(buffBase64, callback) {
    var KB = Buffer.byteLength(buffBase64, 'base64') / 1000;
    process.stdout.write(" " + KB + "KB");
    if (KB > DARK_IMAGE_SIZE_THRESHOLD) {
        var timestamp = Math.round((new Date()).getTime() / 1000)
        try {
            imageManipulator.read(buffBase64, (err, image) => {
                if (err) callback(err)
                else {
                    //Preserve unmodified image if config specified a directory
                    if (config.snapshot.timelapseDirectory) image.write(`${config.snapshot.timelapseDirectory}${timestamp}.${image.getExtension()}`);
                    image.resize(IMAGE_WIDTH / 4, IMAGE_HEIGHT / 4).write(config.publicDirectory + config.snapshot.fileName, callback)
                }
            })
        } catch (e) {}
        process.stdout.write("+");
        callback(null, timestamp);
    } else {
        process.stdout.write("-");
        callback(null, -1)
    }
}

function webcamFallback(callback) {
    require("node-webcam").capture("\\", {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        quality: 100,
        delay: 0,
        output: "jpeg",
        saveShots: false,
        callbackReturn: "base64"
    }, (err, URI) => {
        if (err) callback(err)
        else curateAndSaveImage(URItoBase64(URI), callback)
    })
}

function URItoBase64(URI) {
    return (new Buffer(URI.substring(URI.indexOf('base64') + 7), 'base64'))
}