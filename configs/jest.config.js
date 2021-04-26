const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '../'),
  testEnvironment: "node",
  verbose: true,
  transformIgnorePatterns: [
    ".*"
  ],
  testMatch: [
    `<rootDir>/src/**/__tests__/**/*.js?(x)`
  ],
  coverageDirectory: "reports/coverage",
  coveragePathIgnorePatterns: [
    "<rootDir>/src/__mocks__",
    "<rootDir>/src/__tests__"
  ],
  collectCoverageFrom: [
    "src/**/*.{js}",
    "!**/__mocks__/**/*.{js}"
  ],
  moduleFileExtensions: [ 'js', 'json' ],
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: [`<rootDir>/configs/setupTests.js`],
}
