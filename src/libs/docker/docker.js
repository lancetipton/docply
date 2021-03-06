const { ask } = require('@keg-hub/ask-it')
const { convertToJson } = require('./helpers')
const { asyncCmd } = require('@keg-hub/spawn-cmd')
const { noOpObj } = require('@keg-hub/jsutils')
const { getTarPath } = require('../../utils/getTarPath')
const { dockerCmdError } = require('../../utils/errors/errors')

/**
 * Cache holder for docker images
 * @type {Object}
 */
let __IMAGES

/**
 * Runs a docker command capturing the output of the command
 * @function
 * @private
 * @param {string|Array} cmd - Docker command to run
 * @param {Object} env - Extra env to add when running the command
 *
 * @returns {Array} - Data converted to an array
 */
const dockerCmd = async (cmd, env = noOpObj) => {
  return asyncCmd(`docker ${cmd}`, {
    env: { ...process.env, ...env },
  })
}

/**
 * Gets a list of all the current docker images
 * @function
 * @private
 *
 * @returns {Array} - Current docker images
 */
const getImages = async () => {
  const { data, error } = await dockerCmd(`image ls --format "{{json .}}"`)
  error && dockerCmdError(error)
  const images = convertToJson(data)
  return !images.length ? dockerCmdError(`No docker images exist!`) : images
}

/**
 * Gets a docker image id for the local docker images
 * @function
 * @private
 * @param {string} imageRef - Docker image id to use by default
 * @param {boolean} askFor - Should ask for the user to select an image
 *
 * @returns {string} - Docker image id
 */
const getImageRef = async (imageRef, askFor = true) => {
  // Get the images and cache it so we can compare later
  __IMAGES = await getImages()

  // TODO: If imageRef is not an ID, loop the images and find the matching name
  if (imageRef) return imageRef

  const items = __IMAGES.map(img => {
    let label = img.repository
    img.tag && (label += `:${img.tag}`)
    return `${label} - ${img.id}`
  })

  const index =
    askFor &&
    (await ask.promptList(items, 'Docker Images:', 'Select an Image:'))

  const selected = __IMAGES[index]

  return selected
    ? selected.id
    : dockerCmdError(`A docker image ID is required!`)
}

/**
 * Save the docker image as a tar
 * @param {string} imageRef - Reference of the docker image to save as a tar
 * @param {string} [tarName=] - Name of the tar file to be saved
 * @example
 * docker save $KEG_IMG_NAME -o $KEG_FROM_TAR
 *
 * @returns {Object} Promise that resolves true if tar is created
 */
const saveTar = async (imageRef, tarName) => {
  const tarPath = getTarPath(tarName)
  const { error } = await dockerCmd(`save ${imageRef} -o ${tarPath}`)
  error && dockerCmdError(error)

  return tarPath
}

/**
 * Loads a tar file into docker as an image
 * @param {string} tarPath - Path to the tar file
 * @example
 * loadImg(tarPath) => // Same as docker load -i <tar-path>
 *
 * @returns {Object} Promise that resolves true if image can be loaded
 */
const loadImg = async tarPath => {
  const { data, error } = await dockerCmd(`load -i ${tarPath}`)
  return error ? dockerCmdError(error) : data.split(':').pop()
    .trim()
}

module.exports = {
  getImageRef,
  loadImg,
  saveTar,
}
