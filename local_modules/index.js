const expectedModules = [
    "server",
    "database",
    "drawGraphs",
    "collectWeather",
    "takePhoto",
];

var modules = {};

module.exports = function(config) {
    expectedModules.forEach(module => { modules[module] = require(`./${module}`)(config); })

    /*
    TO-DO: COME UP WITH A WAY TO ONLY UPDATE THE GRAPHS AND SHIT PER-REQUEST
                SAVE TIMESTAMP OF LAST GENERATION AND LAST DATA
    
        HOLD COPY OF DELIVERABLES HERE?
        GIVE UPDATE FUNCTION TO SERVER??????????
        SERIOUSLY WE SHOULDN'T BE RE-RENDERING THE GRAPHS EVERY NEW DATA POINT
    */
    
    
    return function() {
        modules.takePhoto()
            .then(payload => {
                if (payload.timestamp < 0) console.log('-')
                else {
                    console.log('+')
                    modules.server({ image: payload })
                }
            })
            .catch(err => console.log("Photo error", err))

        modules.collectWeather()
            .then(payload => {
                modules.server({ weather: payload });
                modules.database.insert(payload.json).then(history => {
                    modules.server(
                        {
                            // history: history,
                            graphs: modules.drawGraphs(history)
                        }
                    )
                });
                process.stdout.write(payload.pretty.timestamp)
            })
    }
}