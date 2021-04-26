const { fileSys } = require('@keg-hub/cli-utils')

/**
 * Saves the modified config file overwriting the original
 * @function
 * @exported
 * @param {string} location - Path to the image JSON config file
 * @param {Object} config - Modified config file content
 *
 * @returns {Array} - Containing the error if the save fails and the save response
 */
const saveConfig = async (location, config) => {
  return await fileSys.writeFile(location, JSON.stringify(config, null, 2))
}

module.exports = {
  saveConfig,
}
