const { cleanup } = require('./utils/cleanup')
const { modifyImg } = require('./modify/modify')
const { parseArgs } = require('./utils/parseArgs')
const { pack, unpack } = require('./libs/tar/tar')
const { getImageRef, saveTar, loadImg } = require('./libs/docker/docker')

const docply = async (ref, opts) => {
  // const params = await parseArgs()
  // const imgRef = await getImageRef(params.image)
  // const imgRef = await getImageRef(params.image, params.tty)
  // const tarPath = await saveTar(imgRef)

  // const tarPath = '/Users/ltipton/keg-hub/taps/docply/.tmp/2f17b13c-44af-4827-b6cc-bdaf36b5c988.tar'

  const tarFolder = await unpack(tarPath)
  const modified = await modifyImg(tarFolder)

  const tarPackage = await pack(tarFolder)
  await loadImg(tarFolder)
  await cleanup()

}

// Check if the parent module ( task module ) has a parent
// If it does, then it was called by the Keg-CLI
// So we should return the task definition instead of running the task action
module.parent
  ? (module.exports = { docply })
  : (async () => {
      return await docply()
    })()
