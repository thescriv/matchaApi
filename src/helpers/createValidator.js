const Ajv = require('ajv')
const createError = require('http-errors')

const ajv = new Ajv()

function createValidator(schema) {
  const ajvValidator = ajv.compile(schema)

  return function validate(data) {
    const isValid = ajvValidator(data)

    if (!isValid) {
      const firstError = ajvValidator.errors[0]

      const dataPath = firstError.dataPath.replace(/\./, '')

      const message = dataPath + ' ' + firstError.message

      const error = {
        param_name: dataPath,
        keyword: firstError.keyword,
        message,
        details: firstError.params
      }

      throw createError(400, error)
    }
  }
}

module.exports = { createValidator }
