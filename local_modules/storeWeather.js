var db = {};
var history = {};
var config = { db: {}, updateRate: 0 };

module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]

    try { //Initialize Directory
        require('fs').mkdirSync(config.db.directory);
        console.log("Database initialized in", config.db.directory)
    } catch (e) {}
    return intializeDatabase;
}

//Helper
function storeData(data, callback) {
    history.push(data)
    db.insert(data, err => { callback(null, history) });
}

function intializeDatabase(data, callback) {
    var name = __filename.split(/[\\/]/).splice(-1)[0].split('.')[0]

    db = new(require('nedb'))({
        filename: config.db.directory + config.db.fileName,
        autoload: true
    });

    db.ensureIndex({ fieldName: 'timestamp', expireAfterSeconds: config.db.retention }, err => {
        if (err) callback(err)

        db.find({ timestamp: { $gt: Date.now() - config.db.retention } }, { _id: 0 }, (err, docs) => {
            if (err) callback(err)
            history = docs;

            //Future function calls should now update the db's which now definitely exist
            this[name] = storeData
            storeData(data, callback)
        });
    })
}