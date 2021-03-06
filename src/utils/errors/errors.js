const { isStr } = require('@keg-hub/jsutils')
const { error, Logger } = require('@keg-hub/cli-utils')

const tarCreateError = (err, imgRef) => {
  const message = err ? `\n${err.message}` : ''
  error.throwError(`Failed to create tar for ${imgRef}!${message}\n`)
}

const dockerCmdError = err => {
  const message = err ? (isStr(err) ? err : err.message) : false
  error.throwError(message || `Docker command failed!`)
}

const loadManifestError = (err, loc) => {
  const message = err ? (isStr(err) ? err : err.message) : ''
  error.throwError(`Error loading image manifest from ${loc}\n`, message)
}

const invalidImgJSON = (output, mess) => {
  const message = mess || `Invalid Image JSON object`
  Logger.error(`\n${message}\n`)
  Logger.log(output)
  error.throwTaskFailed()
}

module.exports = {
  dockerCmdError,
  invalidImgJSON,
  loadManifestError,
  tarCreateError,
}
