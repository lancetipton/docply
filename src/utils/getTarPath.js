const path = require('path')
const { uuid } = require('@keg-hub/jsutils')
const { TEMP_PATH, MOCK_IMG_PATH } = require('../constants/constants')

/**
 * Gets the tmp folder that stores the exported image .tar
 * Uses the __mocks__ folder when test argument is true
 * @function
 * @private
 * @param {string} folder - Name of the tar export folder within the tmp folder 
 * @param {boolean} test - Is docply running in test mode
 *
 * @returns {string} - Path to the exported image tar folder
 */
const getTarFolder = (folder=uuid(), test) => {
  return path.join(test ? MOCK_IMG_PATH : TEMP_PATH, folder)
}

/**
 * Gets the path to the docker exported tar file
 * @function
 * @private
 * @param {string} folder - Name of the tar export folder within the tmp folder 
 * @param {boolean} test - Is docply running in test mode
 *
 * @returns {string} - Path to the exported image tar folder
 */
const getTarPath = (tarName=uuid(), test) => {
  const tarPath = path.extname(tarName) === '.tar' ? tarName : `${tarName}.tar`
  return path.join(test ? MOCK_IMG_PATH : TEMP_PATH, tarPath)
}

module.exports = {
  getTarFolder,
  getTarPath
}