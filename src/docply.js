const path = require('path')
const { cleanup } = require('./utils/cleanup')
const { modifyImg } = require('./modify/modify')
const { Logger } = require('@keg-hub/cli-utils')
const { parseArgs } = require('./utils/parseArgs')
const { pack, unpack } = require('./libs/tar/tar')
const { getTarFolder } = require('./utils/getTarPath')
const { getImageRef, saveTar, loadImg } = require('./libs/docker/docker')

const creatTarFromImg = async params => {
  const { image, hash, log, tty, test } = params
  if(hash) return getTarFolder(hash, test)

  const imgRef = await getImageRef(image, tty)

  log && Logger.pair(`Creating tar of image`, imgRef)
  const tarPath = await saveTar(imgRef)

  log && Logger.pair(`Unpacking image tar at path`, tarPath)
  return await unpack(tarPath)
}

const docply = async (ref, opts) => {
  const params = await parseArgs()
  const { log } = params

  const tarFolder = await creatTarFromImg(params)

  log && Logger.pair(`Modifying image manifest at path`, tarFolder)
  const modified = await modifyImg(tarFolder, params, opts)

  // log && Logger.pair(`Re-packing tar into docker image...`)
  // const tarPackage = await pack(tarFolder)

  // log && Logger.pair(`Loading image back into docker...`)
  // await loadImg(tarFolder)

  // log && Logger.pair(`Cleaning up temp folder...`)
  // await cleanup()

}

// Check if the parent module ( task module ) has a parent
// If it does, then it was called by the Keg-CLI
// So we should return the task definition instead of running the task action
module.parent
  ? (module.exports = { docply })
  : (async () => {
      return await docply()
    })()
