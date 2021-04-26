const path = require('path')

const cleanup = jest.fn(async () => true)

const getTarFolder = jest.fn(() => {
  return path.join(__dirname, '../image/mock-tar-export')
})
const getTarPath = jest.fn(() => {
  return path.join(__dirname, '../image/mock-tar-export.tar')
})
const parseArgs = jest.fn(overrides => {
  return overrides || {}
})

module.exports = {
  cleanup,
  getTarFolder,
  getTarPath,
  parseArgs,
}
