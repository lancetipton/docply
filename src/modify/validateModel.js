
const { Logger } = require('@keg-hub/cli-utils')
const { invalidImgJSON } = require('../utils/errors/errors')
const { validate, typeOf, isObj, isArr } = require('@keg-hub/jsutils')

/**
 * Checks if the failed values of the validator are null
 * Docker allows values to be null, but the validate method does not
 * So we have to run an extra check to ensure it does not throw for null values
 * @function
 * @exported
 * @throws
 * @param {Object} output - Response from the validate method
 *
 * @returns {Void}
 */
const checkNonNullValue = (output) => {
  const nonNullKeys = Object.values(output)
    .filter(meta => !meta.success && meta.value !== null)

  nonNullKeys.length && invalidImgJSON(nonNullKeys)
}

/**
 * Builds a validator object that the validate method can handel
 * @function
 * @private
 * @param {Object} obj - Object to have it's keys and values validated
 * @param {Object} model - Object the contains the metadata for validating the obj argument
 *
 * @returns {Object} - Contains the object to validate and its validator methods
 */
const buildValidator = (obj, model) => {
  return Object.entries(obj)
    .reduce((args, [key, value]) => {
      const type = typeOf(value).toLowerCase()
      const validateMethod = model[key]
        ? model[key].validate
        : model.validate || Logger.error(`\nMissing key in image jsonModel => ${key}\n`)
      
      validateMethod &&
        (args.validators[key] = validateMethod)

      return args
    }, { object: obj, validators: {} })
}

/**
 * Validate the model match the defined jsonModel spec
 * This ensures we create a valid json config that docker can load
 * @function
 * @exported
 * @throws
 * @param {Object} obj - Object to have it's keys and values validated
 * @param {Object} model - Object the contains the metadata for validating the obj argument
 *
 * @returns {Void}
 */
const validateModel = (obj, model) => {
  const { object, validators } = buildValidator(obj, model)
  const [ success, outcome ] = validate(object, validators, { logs: false })
  !success && checkNonNullValue(outcome)

  Object.entries(obj)
    .map(([key, value]) => {
      isObj(value)
        ? validateModel(value, model[key].children)
        : isArr(value) &&
            value.map(val => validateModel({ val }, { val: model[key].children }))
    })
}

module.exports = {
  validateModel
}