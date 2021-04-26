const { deepMerge, noOpObj } = require('@keg-hub/jsutils')
const { argsParse } = require('@keg-hub/args-parse')

const task = {
  options: {
    from: {
      description: 'Name of docker id of the image to modify',
    },
    to: {
      description: 'Name of the new image to be created',
    },
    hash: {
      description: 'Tar of an exported image, overrides the --from option',
    },
    test: {
      description:
        'Run in test mode, using the mock tar files. Overrides --hash and --from options',
      default: false,
    },
    remove: {
      description:
        'Items to be removed from the new image. Sets the value at the key path to null',
      type: 'array',
    },
    add: {
      description:
        'Items to be added from the new image. Overrides the value at the key path',
      type: 'array',
    },
    config: {
      description:
        'A JSON string or file path. Merged and overrides the original image JSON',
      example: '--config path/to/config',
    },
    clean: {
      description: 'Delete the tmp files created during the modify process',
      default: true,
    },
    import: {
      description:
        'Toggle the tar back into docker. The --clean option is disabled when false',
      default: true,
    },
    tty: {
      description: 'Toggle terminal tty',
      default: true,
    },
    log: {
      description: 'Log actions before they are executed',
      type: 'bool',
      default: false,
    },
  },
}

/**
 * Parses the cmd line options and merges with the passed in overrides
 * @function
 * @export
 * @param {Object} overrides - Override params passed from the calling method
 *
 * @returns {Object} - Merged params object
 */
const parseArgs = async (overrides = noOpObj) => {
  const params = await argsParse({
    task,
    params: {},
    args: process.argv.slice(2),
  })

  // Allow overriding the defaults if calling docply from code
  // By merging with overrides argument
  const merged = deepMerge(params, overrides)

  return {
    ...merged,
    // Only want to log actions if tty is also true
    log: Boolean(merged.log && merged.tty),
    // Force clean false if import is false, So we keep the tar file and folder
    clean: Boolean(merged.clean && merged.import),
  }
}

module.exports = {
  parseArgs,
}
