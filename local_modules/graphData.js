var config = { server: {}, db: {}, updateRate: 0 };

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
}