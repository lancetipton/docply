const { isStr, isFunc, isObj } = require('@keg-hub/jsutils')
const path = require('path')
const rootDir = path.join(__dirname, '../')

let __MOCKS

global.getMock = mock => {
  __MOCKS = __MOCKS || require('../src/__mocks__')
  return __MOCKS[mock]
}
global.getMockConfig = () => getMock('mockConfig')

global.resetJest = () => {
  jest.resetModules()
  jest.resetAllMocks()
  jest.clearAllMocks()
}

const resetMocks = (mocks) => {
  Object.entries(mocks)
    .map(([ key, value ]) => {
      isFunc(value)
        ? value.mockClear()
        : isObj(value) && resetMocks(value)
    })
}

global.setMocks = (toMock={}, caller) => {
  const callerDir = caller.path.replace(rootDir, '')
  const mocksToReset = {}
  __MOCKS = __MOCKS || require('../src/__mocks__')

  Object.entries(toMock)
    .map(([location, data]) => {
      // callerDir is the relative path from root directory to test file
      // So join that with the passed in location
      // Which creates the full relative path from root to the file we want to mock
      // Then, because the root dir is one folder back from this file
      // Append ../ to account for it
      // This creates a relative path to the mock file from this file
      const locFromTest = location.startsWith('/') || location.startsWith('.')
        ? `../${path.join(callerDir, location)}`
        : location

      const mock = (isStr(data) && __MOCKS[data]) || data
      __MOCKS[data] && (mocksToReset[data] = __MOCKS[data])

      return mock
        ? jest.setMock(locFromTest, mock)
        : console.error(`Can not find mock from data.`, data)
    })

    return () => resetMocks(mocksToReset)

}
