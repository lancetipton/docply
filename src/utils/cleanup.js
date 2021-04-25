const path = require('path')
const rimraf = require('rimraf')
const { TEMP_PATH } = require('../constants/constants')

/**
 * Deletes all files in the .tmp folder
 * Delete is bypassed in running in test mode
 * @function
 * @exported
 * @param {boolean} test - True if docply is running in test mode
 *
 * @returns {boolean} - True if the .tmp folder is cleaned
 */
const cleanup = async () => {
  return new Promise((res, rej) => rimraf(
    path.join(TEMP_PATH, './*'),
    err => err ? rej(err) : res(true)
  ))
}

module.exports = {
  cleanup
}