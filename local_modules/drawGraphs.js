const fs = require('fs')
var config = { server: {}, db: {}, updateRate: 0 };

var charts = {
    wind: {},
    temperature: "",
    pressure: "",
    humidity: "",
    rain: "",
}

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    
    charts.wind = require('./graphing_modules/wind.js')(Config)

    return function(history) {
        
        return {
            wind: charts.wind(history),
            temperature: GenerateLineChart(history)
        }
    }
}

function GenerateLineChart(history) {
    //WHY GOD WHY HAVE YOU FORSAKEN ME TO DO EVERYTHING ON MY OWN ONCE AGAIN
}
