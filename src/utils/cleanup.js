const path = require('path')
const rimraf = require('rimraf')
const { TEMP_PATH } = require('../constants/constants')

const cleanup = async () => {
  return new Promise((res, rej) => rimraf(
    path.join(TEMP_PATH, './*'),
    err => err ? rej(err) : res(true)
  ))
}

module.exports = {
  cleanup
}