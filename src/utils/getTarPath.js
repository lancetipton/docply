const path = require('path')
const { uuid } = require('@keg-hub/jsutils')
const { TEMP_PATH } = require('../constants/constants')

const getTarFolder = (folder=uuid()) => {
  return path.join(TEMP_PATH, folder)
}

const getTarPath = (tarName=uuid()) => {
  const tarPath = path.extname(tarName) === '.tar' ? tarName : `${tarName}.tar`
  return path.join(TEMP_PATH, tarPath)
}

module.exports = {
  getTarFolder,
  getTarPath
}