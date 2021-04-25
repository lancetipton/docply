const path = require('path')
const { cleanup } = require('./utils/cleanup')
const { modifyImg } = require('./modify/modify')
const { Logger } = require('@keg-hub/cli-utils')
const { parseArgs } = require('./utils/parseArgs')
const { pack, unpack } = require('./libs/tar/tar')
const { getTarFolder } = require('./utils/getTarPath')
const { getImageRef, saveTar, loadImg } = require('./libs/docker/docker')

/**
 * Get the image to be modified and creates a tar export of it
 * @function
 * @private
 * @param {Object} params - Parsed options of a params object
 *
 * @returns {string} - Path to the exported image tar folder 
 */
const creatTarFromImg = async params => {
  const { from, hash, log, tty, test } = params
  if(hash) return getTarFolder(hash, test)

  const imgRef = await getImageRef(from, tty)

  log && Logger.pair(`Creating tar of image`, imgRef)
  const tarPath = await saveTar(imgRef)

  log && Logger.pair(`Unpacking image tar at path`, tarPath)
  return await unpack(tarPath)
}

/**
 * Creates a Docker image from a tar file
 * Gets a tarFolder, and packages it into a single tar file
 * Then imports it into docker as a new image
 * @function
 * @private
 * @param {Object} params - Parsed options of a params object
 *
 * @returns {string} - Path to the exported image tar folder 
 */
const createImageFromTar = async (params, tarFolder) => {
  const { import:importImg, log, to, clean, test } = params

  log && Logger.pair(`Re-packing tar into docker image...`)
  const tarPackage = await pack(tarFolder, to)

  log && Logger.pair(`Loading image back into docker...`)
  const imgId = importImg && await loadImg(tarPackage, to, test)

  log && Logger.pair(`Cleaning up temp folder...`)
  clean && await cleanup(tarFolder, test)

  return imgId || tarPackage
}

/**
 * Exports an image from docker into a .tar file
 * Then modifies the JSON config within the export based on passed in params
 * Then recreates an new Docker image from the modified .tar files
 * @function
 * @export
 * @param {Object} overrides - Override params passed from the calling method
 *
 * @returns {string} - Docker image ID of the newly created image
 */
const docply = async (overrides) => {
  const params = await parseArgs(overrides)
  const tarFolder = await creatTarFromImg(params)
  const modified = await modifyImg(tarFolder, params)
  const imgId = await createImageFromTar(params, modified)

  return imgId
}

// Check if the parent module has a parent
// If it does, then it was called from code
// So we should return the method instead of running it automatically
module.parent ? (module.exports = { docply }) : docply()
