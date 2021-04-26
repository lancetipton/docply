const utils = require('./utils')
const errors = require('./errors')

module.exports = {
  errors,
  utils,
  ...errors,
  ...utils,
}
