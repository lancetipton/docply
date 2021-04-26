global.resetJest()

const resetMocks = global.setMocks({
  '../libs/tar/tar': 'tar',
  '../utils/cleanup': 'utils',
  '../modify/modify': 'modify',
  '../utils/parseArgs': 'utils',
  '../utils/getTarPath': 'utils',
  '@keg-hub/cli-utils': 'external',
  '../libs/docker/docker': 'docker',
}, module)


const packMock = global.getMock('pack')
const LoggerMock = global.getMock('Logger')
const unpackMock = global.getMock('unpack')
const loadImgMock = global.getMock('loadImg')
const saveTarMock = global.getMock('saveTar')
const cleanupMock = global.getMock('cleanup')
const parseArgsMock = global.getMock('parseArgs')
const modifyImgMock = global.getMock('modifyImg')
const getImageRefMock = global.getMock('getImageRef')
const getTarFolderMock = global.getMock('getTarFolder')

const { docply } = require('../docply')

describe('docply', () => {

  beforeEach(() => resetMocks())

  afterAll(() => global.resetJest())

  test('docply should be a function', () => {
    expect(typeof docply).toBe('function')
  })

  test('docply should not be called when required from another file', () => {
    // docply calls parseArgs, so check if the mock has been called
    expect(parseArgsMock).not.toHaveBeenCalled()
  })

  test('docply should call parseArgs with the passed in args', async () => {
    const overrides = {}
    await docply(overrides)
    expect(parseArgsMock).toHaveBeenCalledWith(overrides)
  })

  test('docply should call getTarFolder when hash exists', async () => {
    const overrides = { hash: 'test-mock-img' }
    await docply(overrides)
    expect(getTarFolderMock).toHaveBeenCalled()
    expect(getTarFolderMock.mock.calls[0][0]).toBe(overrides.hash)
  })

  test('docply should not call getTarFolder when no hash exists', async () => {
    const overrides = {}
    await docply(overrides)
    expect(getTarFolderMock).not.toHaveBeenCalled()
  })

  test('docply should not call getImageRef when a hash exists', async () => {
    const overrides = { hash: 'test-mock-img' }
    await docply(overrides)
    expect(getImageRefMock).not.toHaveBeenCalled()
  })

  test('docply should call getImageRef with from when no hash exists', async () => {
    const overrides = { from: 'test-mock-img' }
    await docply(overrides)
    expect(getImageRefMock).toHaveBeenCalled()
    expect(getImageRefMock.mock.calls[0][0]).toBe(overrides.from)
  })

  test('docply should pass the imgRef from getImageRef to saveTar', async () => {
    const overrides = { from: 'test-mock-img' }
    await docply(overrides)
    expect(saveTarMock.mock.calls[0][0]).toBe(getImageRefMock.mock.results[0].value)
  })

  test('docply should pass the tarPath from saveTar to unpack', async () => {
    const overrides = { from: 'test-mock-img' }
    await docply(overrides)
    expect(unpackMock.mock.calls[0][0]).toBe(saveTarMock.mock.results[0].value)
  })

  test('docply should call modifyImgMock with the tarFolder and params', async () => {
    const overrides = { from: 'test-mock-img' }
    await docply(overrides)
    const tarFolder = unpackMock.mock.results[0].value
    expect(modifyImgMock).toHaveBeenCalledWith(tarFolder, overrides)
  })

  test('docply should call modifyImgMock when a hash has been passed', async () => {
    const overrides = { hash: 'test-mock-img' }
    await docply(overrides)
    const tarFolder = getTarFolderMock.mock.results[0].value
    expect(modifyImgMock).toHaveBeenCalledWith(tarFolder, overrides)
  })

  test('docply should pass the tarFolder from unpack to pack', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img' }
    await docply(overrides)
    expect(packMock).toHaveBeenCalledWith(
      unpackMock.mock.results[0].value,
      overrides.to
    )
  })

  test('docply should call loadImg with the response from the pack method', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img', import: true }
    await docply(overrides)
    expect(loadImgMock).toHaveBeenCalled()
    expect(loadImgMock.mock.calls[0][0]).toBe(packMock.mock.results[0].value)
  })

  test('docply should not call loadImg when import is false', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img', import: false }
    await docply(overrides)
    expect(loadImgMock).not.toHaveBeenCalled()
  })

  test('docply should not call cleanup when clean is false', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img', import: true, clean: false }
    await docply(overrides)
    expect(cleanupMock).not.toHaveBeenCalled()
  })

  test('docply should call cleanup with the tarFolder when clean is true', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img', import: true, clean: true }
    await docply(overrides)
    const tarFolder = unpackMock.mock.results[0].value
    expect(cleanupMock).toHaveBeenCalledWith(tarFolder)
  })

  test('docply should not call Logger methods when log is false', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img', import: true, log: false }
    await docply(overrides)
    expect(LoggerMock.pair).not.toHaveBeenCalled()
    expect(LoggerMock.success).not.toHaveBeenCalled()

  })

  test('docply should call Logger methods when log is true', async () => {
    const overrides = { from: 'test-mock-img', to: 'modified-mock-img', import: true, log: true }
    await docply(overrides)
    expect(LoggerMock.pair).toHaveBeenCalled()
    expect(LoggerMock.success).toHaveBeenCalled()
  })

})