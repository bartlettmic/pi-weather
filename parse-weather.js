    module.exports = function(weather) {
        function parseTimestamp(ms) {
            var d = new Date(+ms);
            return ((d.getHours() + 11) % 12 + 1) +
                ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
                ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()) +
                ' ' + (d.getHours() > 12 ? 'PM' : 'AM') +
                ', ' + (d.getMonth() + 1) +
                '/' + d.getDate() +
                '/' + (d.getFullYear().toString().substr(-2));
        }

        function parseUptime(ms) {
            days = Math.floor(ms / (24 * 60 * 60 * 1000));
            daysms = ms % (24 * 60 * 60 * 1000);
            hours = Math.floor((daysms) / (60 * 60 * 1000));
            hoursms = ms % (60 * 60 * 1000);
            minutes = Math.floor((hoursms) / (60 * 1000));
            minutesms = ms % (60 * 1000);
            sec = Math.floor((minutesms) / (1000));
            return (days > 0 ? days + "d " : "") + hours + "h " + minutes + "m " + sec + "s";
        }

        function formatWeatherData(data) {
            // return JSON.stringify(data, null, "\t").replace(/\"/g, "").slice(3,-2).split(/,\n\t*/).slice(0,-1).join("<br/>")
            return JSON.stringify(data, null, "\t").replace(/\"/g, "").slice(3, -2).split(/,\n\t*/)
        }

        var _export = {
            timestamp: parseTimestamp(weather.timestamp),
            uptime: parseUptime(weather.uptime),
            measurements: formatWeatherData(weather).slice(0,-2)
        }
        
        return _export;
    }