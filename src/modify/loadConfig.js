const rootDir = require('app-root-path').path
const { loadModule } = require('@keg-hub/jsutils/src/node')

/**
 * Checks if the passed in config is a json object and tries to parse it
 * @function
 * @private
 * @throws - If is a JSON string, and JSON.parse fails
 * @param {string} Config - JSON as a string or path to a config file
 *
 * @returns {Object|boolean} - Parsed JSON config as an JS Object or false
 */
const tryAsJson = config => {
  // Check if is starts with an object or escape character
  // If not, then assumer it's not json and return
  return !config.startsWith('{') && !config.startsWith('\\')
    ? false
    : JSON.parse(config)
}

const tryAsFilePath = config => {

}

/**
 * Loads the custom config object from a file path or from string JSON
 * @function
 * @exported
 * @param {string} Config - JSON as a string or path to a config file
 *
 * @returns {Object} - Parsed JSON config, loaded file config or an empty Object
 */
const loadConfig = config => {
  let loadedConfig = tryAsJson(config)
  return loadedConfig ||
    loadModule(config, { rootDir }) ||
    {}
}

module.exports = {
  loadConfig
}