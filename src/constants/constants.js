const path = require('path')
const { deepFreeze } = require('@keg-hub/jsutils')
const mocksPath = path.join(__dirname, `../__mocks__`)

module.exports = deepFreeze({
  IMG_MANIFEST: 'manifest.json',
  MOCKS_PATH: mocksPath,
  MOCK_IMG_PATH: path.join(mocksPath, './image'),
  TEMP_PATH: path.join(__dirname, `../../.tmp`),
})
