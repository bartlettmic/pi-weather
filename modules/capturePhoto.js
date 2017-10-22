const fs = require('fs');
const crypto = require('crypto');
const imgur = require('imgur');
const config = require('./config');

imgur.setCredentials(config.imgur.username, config.imgur.password, (config.imgur.client || saveClientID()));

module.exports = function(callback) {
    new(require('node-raspistill').Raspistill)({

        noFileSave: true,
        width: 1920,
        height: 1080,

    })
    .takePhoto().then((buff) => {
        var _KB = Buffer.byteLength(buff, 'base64') / 1000;
        process.stdout.write(" " + _KB + "KB ");
        if (_KB > 600) {
            fs.writeFileSync("../img/"+config.imageFileName, buff, 'base64')
            imgur.uploadBase64(buff.toString('base64'), config.imgur.album).then(
                // (json) => {
                // console.log(json.data.link)
                console.log('+')
                // }
            ).catch((err) => { console.error("!") });
            callback(null, checksum(buff))
        } else {
            console.log("-");
            callback(null, checksum("static"));
        }
    }, webcamFailsafe(callback))
}

///////////////////////////////////////////// Helper functions
function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'base64')
        .digest(encoding || 'hex')
}

function saveClientID() {
    config.imgur.client = imgur.getClientId()
    fs.writeFileSync('config.json', JSON.stringify(config, null, "\t"), 'utf8');
    return config.imgur.client
}

function webcamFailsafe(callback) {
    require("node-webcam").capture(config.imageFileName, {
        quality: 100,
        delay: 0,
        saveShots: true,
        callbackReturn: "base64"
    }, (err, buff) => {
        callback(err, checksum((buff || "Error")))
    })
}