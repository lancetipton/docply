const path = require('path')

const pack = jest.fn(() => {
  return 'test-mock-img'
})
const unpack = jest.fn(() => {
  return path.join(__dirname, '../image/mock-tar-export')
})

module.exports = {
  pack,
  unpack,
}