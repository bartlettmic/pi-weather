const path = require("path");
// const config = require("../config.json")

var currentDir = path.join(__dirname);
var currentFile = path.basename(__filename)

module.exports = function(config) {
    var payload = {};
    require("fs").readdirSync(currentDir).forEach((file) => {
        if (file != currentFile) {
            var _module = require("./" + file)(config);
            payload[file.split('.')[0]] = _module;
        }
    });
    return payload;
}