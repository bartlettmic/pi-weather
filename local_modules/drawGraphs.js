var config = { server: {}, db: {}, updateInterval: 0 };

var charts = {
    wind: {},
    temperature: "",
    pressure: "",
    humidity: "",
    rain: "",
}

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    
    const lineGraphGenerator = require('./submodules/lineGraph.js')(Config)
    
    charts.wind = require('./submodules/windGraph.js')(Config)
    charts.temperature = lineGraphGenerator

    return function(history) {
        
        return {
            wind: charts.wind(history),
            temperature: charts.temperature(history)
        }
    }
}
