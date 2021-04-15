const { argsParse } = require('@keg-hub/args-parse')

const task = {
  options: {
    image: {},
    fromTar: {},
    toTar: {},
    remove: {
      type: 'array'
    },
    add: {
      type: 'array'
    },
    tty: {
      type: 'bool',
      default: true
    }
  }
}

const parseArgs = async () => {
  return await argsParse({
    task,
    params: {},
    args: process.argv.slice(2),
  })
}

module.exports = {
  parseArgs
}