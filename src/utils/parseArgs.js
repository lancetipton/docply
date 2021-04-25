const { argsParse } = require('@keg-hub/args-parse')

const task = {
  options: {
    image: {},
    fromTar: {},
    toTar: {},
    hash: {},
    test: {
      default: false
    },
    remove: {
      type: 'array'
    },
    add: {
      type: 'array'
    },
    tty: {
      type: 'bool',
      default: true
    },
    log: {
      type: 'bool',
      default: false
    }
  }
}

const parseArgs = async () => {
  const params = await argsParse({
    task,
    params: {},
    args: process.argv.slice(2),
  })

  params.log = params.log && params.tty

  return params
}

module.exports = {
  parseArgs
}