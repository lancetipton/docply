const path = require('path')
const { deepFreeze } = require('@keg-hub/jsutils')
const TEMP_PATH = path.join(__dirname, `../../.tmp`)

module.exports = deepFreeze({
  TEMP_PATH,
  TAR_CMDS: {
    create: 'c',
    replace: 'r',
    update: 'u',
    list: 't',
    extract: 'x',
  },
})