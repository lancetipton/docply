const { cleanup } = require('./utils/cleanup')
const { modifyImg } = require('./modify/modify')
const { Logger } = require('@keg-hub/cli-utils')
const { parseArgs } = require('./utils/parseArgs')
const { pack, unpack } = require('./libs/tar/tar')
const { getImageRef, saveTar, loadImg } = require('./libs/docker/docker')

const docply = async (ref, opts) => {
  const params = await parseArgs()
  // const { log } = params
  // const log = true

  // const imgRef = await getImageRef(params.image)
  // const imgRef = await getImageRef(params.image, params.tty)

  // log && Logger.pair(`Creating tar of image`, imgRef)
  // const tarPath = await saveTar(imgRef)

  // log && Logger.pair(`Unpacking image tar at path`, tarPath)
  // const tarFolder = await unpack(tarPath)

  // log && Logger.pair(`Modifying image manifest at path`, tarFolder)
  const tarFolder = `/Users/ltipton/keg-hub/taps/docply/.tmp/de8f009d-d557-4d8b-b233-123e71dce076`
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
