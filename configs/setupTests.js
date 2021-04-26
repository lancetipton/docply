const { getImgConfig, getImgManifest } = require('../src/__mocks__/image')

global.getImgConfig = getImgConfig
global.getImgManifest = getImgManifest
global.getMockConfig = () => require('../src/__mocks__/config/mockConfig')
