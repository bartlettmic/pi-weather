var config = { db: {}, updateRate: 0 };

module.exports = function(_config) {
    for (var p of Object.keys(config)) config[p] = _config[p]

    try { //Initialize Directory
        require('fs').mkdirSync(config.db.directory);
        console.log("Database initialized in", config.db.directory)
    } catch (e) {}
    return intializeDatabases;
}

//Helper
function storeData(weather, callback) {
    console.log("in store", weather)
    var timestamp = weather.timestamp
    delete weather.timestamp
    delete weather.uptime
    for (var measurement of Object.keys(weather)) {
        var fileName = `${config.db.directory}${measurement}.hoard`;
        Object.keys(weather).forEach((measurement) => {
            var fileName = config.db.directory + measurement + '.hoard';
            //update
        });
    }
}

function intializeDatabases(weather, callback) {
    var lWeather = JSON.parse(JSON.stringify(weather))
    var name = __filename.split(/[\\/]/).splice(-1)[0].split('.')[0]
    var retention = [config.updateRate / 1000, config.db.totalPointsPerDB];
    delete lWeather.timestamp
    delete lWeather.uptime
    var size = Object.keys(lWeather).length
    var callbacks = 0;
    Object.keys(lWeather).forEach((measurement) => {
        var fileName = config.db.directory + measurement + '.hoard';
        //Create
    });
    
    //Future function calls should now update the db's which now definitely exist
    this[name] = storeData
}