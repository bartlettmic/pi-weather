const expectedModules = [
    "server",
    "collectWeather",
    "storeWeather",
    "capturePhoto",
    "graphData"
];

var modules = {};

module.exports = function(config) {
    expectedModules.forEach(module => { modules[module] = require(`./${module}`)(config); })
    return function update() {
        // process.stdout.write('\rUpdating...\r');

        modules.capturePhoto()
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

                modules.storeWeather(payload.json, (err, history) => {
                    if (err) console.log(err)

                    //Generate new graphs

                });
                process.stdout.write(payload.pretty.timestamp)
            })
    }
}

//Put this in capturePhoto
//Change font color
function getColor(palette) {
    var palettes = ['LightVibrant', 'LightMuted', 'Vibrant', 'Muted', 'DarkMuted']
    for (var pal of palettes) {
        try {
            return palette[pal]._rgb.map((c) => { return Math.round(c) }).join(",")
        } catch (e) {}
    }
}

// if (palette.LightVibrant) return palette.LightVibrant._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.LightMuted) return palette.LightMuted._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.Vibrant) return palette.Vibrant._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.Muted) return palette.Muted._rgb.map((c) => { return Math.round(c) }).join(",");
// if (palette.DarkMuted) return palette.DarkMuted._rgb.map((c) => { return Math.round(c) }).join(",");