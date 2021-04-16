const path = require('path')
const { deepFreeze } = require('@keg-hub/jsutils')

module.exports = deepFreeze({
  IMG_MANIFEST: 'manifest.json',
  TEMP_PATH: path.join(__dirname, `../../.tmp`),
})