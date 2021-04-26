const config = require('./config')
const modify = require('./modify')
const validateModel = require('./validateModel')

module.exports = {
  config,
  modify,
  validateModel,
  ...config,
  ...modify,
  ...validateModel,
}