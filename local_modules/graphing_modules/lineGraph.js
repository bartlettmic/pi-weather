var config = { server: {} };
var wind


module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    return function() {}
}