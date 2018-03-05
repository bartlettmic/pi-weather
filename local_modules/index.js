const expectedModules = [
    "server",
    "database",
    "drawGraphs",
    "getWeather",
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

    function update() {
        var promises = [
            (modules.takePhoto()
                .then(payload => {
                    if (payload.timestamp < 0) console.log('-')
                    else {
                        console.log('+')
                        modules.server({ image: payload })
                    }
                    return Promise.resolve(true)
                })),

            (modules.getWeather()
                .then(payload => {
                    modules.server({ weather: payload });
                    modules.database.insert(payload.json).then(history => {
                        modules.server({
                            history: history,
                            graphs: modules.drawGraphs(history)
                        })
                    });
                    process.stdout.write(payload.pretty.timestamp)
                    return Promise.resolve(true)
                }))
        ]
        return Promise.all(promises)
    }


    modules.server({ update: update });

    update().then(val => console.log(val)).catch(err => console.log("Something went terribly wrong!", err));

    return update
}