const fs = require('fs')
const path = require('path')
const tar = require('tar-fs')
const { getTarPath, getTarFolder } = require('../../utils/getTarPath')

const pack = (folder, tarName) => {
  const tarPath = getTarPath(tarName)

  return new Promise((res, rej) => {
    tar.pack(folder)
      .pipe(fs.createWriteStream(tarPath))
      .on('finish', () => res(tarPath))
      .on('error', err => rej(err))
  })
}

const unpack = (tarPath, folder) => {
  const tarFolder = getTarFolder(folder)

  return new Promise((res, rej) => {
    fs.createReadStream(tarPath)
      .pipe(tar.extract(tarFolder))
      .on('finish', () => res(tarFolder))
      .on('error', err => rej(err))
  })
}

module.exports = {
  pack,
  unpack
}