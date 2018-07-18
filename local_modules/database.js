var db = {};
var history = {};
var config = { db: {}, updateInterval: 0 };

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]

    try { //Initialize Directory
        require('fs').mkdirSync(config.db.directory);
        console.log("Database initialized in", config.db.directory)
    } catch (e) {
        console.log("Database found in", config.db.directory)
    }
    return {
        insert: intializeDatabase,
        find: intializeDatabase
    }
}

//Helper
function insert(data) {
    return new Promise((resolve, reject) => {
        history.push(data)
        while (history.length > config.db.historyMaxSize) history.shift();
        db.insert(data, err => {
            if (err) reject(err)
            resolve(history) // Return comprehensive history including the new data.
        });
    })
}

function find(epoch, measurements) { // Get entries from given epoch to most recent.
    return new Promise((resolve, reject) => {
        var filter = { _id: 0 };
        if (measurements)
            for (var m of measurements) filter[m] = 1;

        db.find({
                timestamp: {
                    $gt: Date.now() - epoch
                }
            },
            filter,
            (err, docs) => {
                if (err) reject(err)
                resolve(docs)
            })
    });
}

function intializeDatabase(data) {
    db = new(require('nedb'))({
        filename: config.db.directory + config.db.fileName,
        autoload: true
    });
    return new Promise((resolve, reject) => {
        db.ensureIndex({ fieldName: 'timestamp', expireAfterSeconds: config.db.retention }, err => {
            if (err) reject(err)

            db.find({ timestamp: { $gt: Date.now() - config.db.retention } }, { _id: 0 }, (err, docs) => {
                if (err) reject(err)
                history = docs;

                //Future function calls should now update the db's which now definitely exist
                this[__filename.split(/[\\/]/).splice(-1)[0].split('.')[0]] = {
                    insert: insert,
                    find: find
                }
                resolve(insert(data));
            });
        })
    })
}