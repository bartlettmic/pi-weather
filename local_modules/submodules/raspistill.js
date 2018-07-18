// Assumes 'raspistill' script name or binary is available to PATH of given shell. Windows implementation uses a wrapper script with this name to invoke a different binary which achieves the same effect but with webcam.

module.exports = function(opts) {    
   
    let defaultOpts = {
        width: null,
        height: null,
        quality: 100,
        preview: false,
        raw: false,
        fileName: "output.jpg",
        dir: "./",
        delay: 1500,
        verticalFlip: false,
        horizontalFlip: false,        
        shell: os.platform() === "win32" ? "\"C:\\Program Files\\Git\\usr\\bin\\sh.exe\"" : "/usr/bin/bash"
    }

    const argMap = {
        "height": "h",
        "width": "w",
        "quality": "q",
        "preview": "p",
        "raw": "r",
        "output": "o",
        "delay": "t",
        "verticalFlip": "vf",
        "horizontalFlip": "hf"
    }

    defaultOpts.output = `\"${opts.dir || defaultOpts.dir}${opts.fileName || defaultOpts.fileName}\"`
    delete defaultOpts.dir
    delete defaultOpts.fileName

    opts.shell = opts.shell || defaultOpts.shell
    delete defaultOpts.shell

// raspistill -w 1920 -h 1080 -q 100 -vf -hf -t 1500 -o output.png
    
    let execString = `${opts.shell} raspistill`

    // Object.entries({width: 20, preview: true, horizontalFlip: true, fileName:"nice.jpg", verbose: true}).reduce(([k, v], a) => a.concat([argMap[k], v]), [])
    for (let opt of Object.keys(defaultOpts)) {
        let val = opts[opt] || defaultOpts[opt]
        if (!!val) {
            execString += ` -${argMap[opt]}`
            if (typeof(val) != typeof(true)) execString += ` ${val}`
        }
    }
    
    if (opts.verbose) console.log(execString)
    
    const exec = require('util').promisify(require('child_process').exec);
    return function() { return exec(execString) }
}