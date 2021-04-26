const path = require('path')

const getImageRef = jest.fn((ref) => {
  return ref || 'test-mock-img'
})
const loadImg = jest.fn(() => {
  return 'test-mock-img'
})
const saveTar = jest.fn(() => {
  return path.join(__dirname, '../image/mock-tar-export.tar')
})

module.exports = {
  getImageRef,
  loadImg,
  saveTar,
}