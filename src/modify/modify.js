const path = require('path')
const { isArr, isObj } = require('@keg-hub/jsutils')
const { IMG_MANIFEST } = require('../constants/constants')
const { loadManifestError } = require('../utils/errors/errors')

const loadImgConfig = (tarFolder, configName) => {
  const configLoc = path.join(tarFolder, configName)
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
 
const modifyImg = async (tarFolder, params, opts) => {
  const manifest = loadManifest(tarFolder)
  const imgConfig = loadImgConfig(tarFolder, manifest.Config)

  // TODO: modify the config as needed based on params and opts
  console.log(imgConfig)

}

module.exports = {
    modifyImg
}