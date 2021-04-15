const { isStr } = require('@keg-hub/jsutils')
const { error } = require('@keg-hub/cli-utils')

const tarCreateError = (err, imgRef) => {
  const message = err ? `\n${err.message}` : ''
  error.throwError(`Failed to create tar for ${imgRef}!${message}\n`)
}

const dockerCmdError = err => {
  const message = err ? isStr(err) ? err : err.message : false
  error.throwError(message || `Docker command failed!`)
}

module.exports = {
  dockerCmdError,
  tarCreateError
}