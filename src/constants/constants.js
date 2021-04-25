const path = require('path')
const { deepFreeze } = require('@keg-hub/jsutils')

module.exports = deepFreeze({
  IMG_MANIFEST: 'manifest.json',
  MOCKS_PATH: path.join(__dirname, `../__mocks__`),
  TEMP_PATH: path.join(__dirname, `../../.tmp`),
})