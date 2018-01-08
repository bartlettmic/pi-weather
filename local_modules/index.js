const vibrant = require('node-vibrant')

const expectedModules = [
    "server", "collectWeather", "storeWeather", "capturePhoto", "graphData"
];

var modules = {};

module.exports = function(config) {
    expectedModules.forEach(module => { modules[module] = require(`./${module}`)(config); })
    return function update() {
        // process.stdout.write('\rUpdating...\r');
        modules.capturePhoto((err, payload) => {
            console.log(payload)
            if (err) console.log('-')
            else {
                // if (saved) {
                console.log('+')
                palette = new vibrant(config.server.staticDirectory + config.snapshot.fileName, {}).getPalette((err, pal) => {
                    try {
                        modules.server({ image: { timestamp: timestamp, palette: getColor(pal) } });
                    } catch (e) {
                        modules.server({ image: { timestamp: timestamp, palette: "158,197,216" } });
                    };
                })
            }
            // process.stdout.write(` ${size}KB${saved ? '+' : '-'}\n`);
            // }
        });

        modules.collectWeather((err, output) => {
            if (err) console.log(err)
            else {
                modules.server({ weather: output });

                modules.storeWeather(output.json, (err, history) => {
                    if (err) console.log(err)

                    //Generate new graphs

                });
                process.stdout.write(output.pretty.timestamp)
            }
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