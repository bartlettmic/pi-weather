const spawn = require('child_process').spawn

function readToEnd(stream) {
  return new Promise(((resolve, reject) => {
    const parts = []
    stream.on('error', reject)
    stream.on('data', part => { parts.push(part) })
    stream.on('end', () => { resolve(Buffer.concat(parts)) })
  }))
}

function cmd(args, data) {
  const instance = spawn(args[0], args.slice(1), { stdio: ['pipe', 'pipe', 'inherit'] })
  if (data) {
    instance.stdin.end(data)
  }

  const read = readToEnd(instance.stdout)
  const exit = new Promise(((resolve, reject) => {
    instance.on('error', reject)
    instance.on('exit', exitCode => {
      if (exitCode === 0) {
        resolve()
      } else {
        reject(new Error('process exited with non-zero code'))
      }
    })
  }))
  return exit
    .then(() => read)
}

module.exports = cmd
