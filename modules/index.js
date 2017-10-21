const path = require("path");

var currentDir = path.join(__dirname);
var currentFile = path.basename(__filename)
var _export = {};

require("fs").readdirSync(currentDir).forEach((file) => {
    if (file != currentFile) _export[file.split('.')[0]] = require("./" + file)
});

module.exports = _export;