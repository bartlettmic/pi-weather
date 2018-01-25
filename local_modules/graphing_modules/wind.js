var config = { server: {}, db: {}, updateRate: 0 };
var wind


module.exports = function(Config) {
    for (var p of Object.keys(config)) config[p] = Config[p]
    LoadWindTemplate()
    return GenerateAnenometerVane
}

function LoadWindTemplate() {
    wind = {
        template: require('fs').readFileSync(`${config.server.assetDirectory}AnenometerVaneTemplate.svg`).toString(),
        center: { x: 0, y: 0 }
    }

    wind.template = wind.template.split("<").map(e => "<" + e);

    wind.template.shift()
    wind.template.pop()

    for (var line of wind.template) {
        var words = line.split(/\s|\/>/)
        if (words[0] === "<circle") {
            words.shift()
            words.pop()
            words.pop()
            words.pop()
            words = JSON.parse('{' + words.map(w => {
                var vals = w.split('=')
                vals = `"${vals[0]}":${vals[1]}`
                return vals;
            }).join(",") + '}')

            //Get the information about the template programmatically
            wind.center.x = parseFloat(words.cx)
            wind.center.y = parseFloat(words.cy)
            wind.radius = parseFloat(words.r)
            break;
        }
    }
}

function GenerateAnenometerVane(history) {

    var graph = JSON.parse(JSON.stringify(wind.template));

    var maxspeed = Math.max.apply(Math, history.map(o => { return o.measurements.windspd }))

    if (maxspeed < 1) {

        // graph.push(`<text class="cls-3" transform="translate(${wind.center.x/1.5} ${wind.center.y}) scale(2)">No wind</text>`)
        var dr = 0.7071 * wind.radius;

        var a = {
            x: wind.center.x + dr,
            y: wind.center.y + dr
        }
        var b = {
            x: wind.center.x - dr,
            y: wind.center.y - dr
        }
        graph.push(`<line stroke="#F00" x1="${a.x}" x2="${b.x}" y1="${a.y}" y2="${b.y}" />`)
        graph.push(`<line stroke="#F00" x1="${a.x}" x2="${b.x}" y1="${b.y}" y2="${a.y}" />`)
            // <text class="cls-3" transform="translate(54.1 3.7) scale(1)">N</text>
    } else
        for (var i = 0; i < history.length; i++)
            graph.push(
                GenerateArrowhead(
                    history[i].measurements.winddir,
                    history[i].measurements.windspd / maxspeed,
                    i / history.length
                )
            )
            // graph.push(GenerateArrowhead(getDirection(parseInt(Math.random()*8)), history[i].measurements.windspd / maxspeed, i / history.length))

    graph = graph.join("")
    graph += "</svg>"
    return graph;
}

function GenerateArrowhead(direction, magnitude, recentness) {
    magnitude = magnitude | 1
    var r = wind.radius * recentness
    var a = Math.PI * (getDirection(direction) - 2) / 4
    var da = Math.PI / 35

    var angle = {
        left: a - da,
        right: a + da
    }
    var r2 = r * 0.75;
    var r3 = r * 0.8125

    var fuselage = {
        tip: {
            x: Math.cos(a) * r + wind.center.x,
            y: Math.sin(a) * r + wind.center.y
        },
        butt: {
            x: Math.cos(a) * r3 + wind.center.x,
            y: Math.sin(a) * r3 + wind.center.y
        },
    }

    var wings = {
        left: {
            x: Math.cos(angle.left) * r2 + wind.center.x,
            y: Math.sin(angle.left) * r2 + wind.center.y
        },
        right: {
            x: Math.cos(angle.right) * r2 + wind.center.x,
            y: Math.sin(angle.right) * r2 + wind.center.y
        }
    };


    var d = `M${wings.left.x} ${wings.left.y} L${fuselage.tip.x} ${fuselage.tip.y} L${wings.right.x} ${wings.right.y} L${fuselage.butt.x} ${fuselage.butt.y} Z`

    return `<path fill="rgba(255,255,255,${magnitude*recentness})" d="${d}" />`
}

function getDirection(oct) {
    if (isNaN(oct)) switch (oct) {
        case "N":
            return 0
        case "NE":
            return 1
        case "E":
            return 2
        case "SE":
            return 3
        case "S":
            return 4
        case "SW":
            return 5
        case "W":
            return 6
        case "NW":
            return 7
        default:
            return -1
    }
    else switch (oct) {
        case 0:
            return "N"
        case 1:
            return "NE"
        case 2:
            return "E"
        case 3:
            return "SE"
        case 4:
            return "S"
        case 5:
            return "SW"
        case 6:
            return "W"
        case 7:
            return "NW"
        default:
            return "?"
    }
}