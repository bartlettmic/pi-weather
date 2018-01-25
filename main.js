#!node

/*TODO:
    Window-speed chart module
    Databases
    Time-range select -> limit to earliest timestamp in DB
        • Resolution?
    Web socket for updates and such
    loose REST:
        /weather response instead of .json
        /update prompt immediate update
        /camera change camera orientation
        /config self-explanitory 
*/

const config = require('./config.json');
const update = require('./local_modules')(config); 
setInterval((() => { update(); return update; })(), config.updateRate)