const path = require('path')
const { loadConfig } = require('./loadConfig')
const { saveConfig } = require('./saveConfig')
const { Logger } = require('@keg-hub/cli-utils')
const { jsonModel } = require('../constants/jsonModel')
const { validateModel } = require('./validateModel')
const { IMG_MANIFEST } = require('../constants/constants')
const { loadManifestError } = require('../utils/errors/errors')
const { isArr, isObj, deepMerge, set } = require('@keg-hub/jsutils')

/**
 * Loads the image config file the de-compressed .tar folder
 * @function
 * @private
 * @throws
 * @param {string} configLoc - Path to the image JSON config file
 *
 * @returns {Object} - Image JSON config as a JS Object
 */
const loadImgConfig = (configLoc) => {
   try {
    const config = require(configLoc)
    return isArr(config)
      ? config[0]
      : isObj(config)
        ? config
        : loadManifestError(`Image config must be an object or array`, configLoc)
   }
   catch(err){
     loadManifestError(err.message, configLoc)
   }
}

/**
 * Loads the image manifest JSON file which contains the image config location
 * @function
 * @private
 * @throws
 * @param {string} tarFolder - Path to the folder that contains the image manifest JSON
 *
 * @returns {Object} - Image manifest JSON as a JS Object
 */
const loadManifest = tarFolder => {
  const manifestLoc = path.join(tarFolder, IMG_MANIFEST)
  try {
  const manifest = require(manifestLoc)
  return isArr(manifest)
    ? manifest[0]
    : isObj(manifest)
      ? manifest
      : loadManifestError(`Image manifest must be an object or array`, manifestLoc)
  }
  catch(err){
    loadManifestError(err.message, manifestLoc)
  }
}

/**
 * Modifies an exported docker image json config
 * Uses the passed in config, remove, and add params
 * @function
 * @exported
 * @param {string} tarFolder - Path to the exported tar folder
 * @param {Object} params - Params for modifying the json config
 *
 * @returns {boolean} - True if the config was successfully modified
 */
const modifyImg = async (tarFolder, params) => {
  const { add, config, log, remove } = params

  config && log && Logger.pair(`Loading custom image config...`)
  const customConfig = config && loadConfig(config)

  const manifest = loadManifest(tarFolder)
  const configLoc = path.join(tarFolder, manifest.Config)
  const imgConfig = loadImgConfig(configLoc)

  log && Logger.pair(`Modifying image manifest at path`, tarFolder)

  // Merge with the customConfig
  // Pass customConfig last so it has priority 
  let modified = deepMerge(imgConfig, customConfig)

  // We don't want to completely remove items from the config
  // Because that will create an invalid JSON file that docker won't load
  // So instead we the value to null
  remove.map(item => (set(modified, item, null)))

  // Loop over the items to be added and add them
  add.map(item => (set(modified, ...item.split('='))))

  // Validate the model match the defined jsonModel spec
  // This ensures we create a valid json config that docker can load
  // If it's invalid, then validateModel will throw
  validateModel(modified, jsonModel)

  // Save the config file overwriting the original
  log && Logger.pair(`Saving modified image config to path`, configLoc)
  await saveConfig(configLoc, modified)

  return modified
}

module.exports = {
    modifyImg
}