const Ajv = require('ajv')
const createError = require('http-errors')

const ajv = new Ajv()

function createValidator(schema) {
  const ajvValidator = ajv.compile(schema)

  return function validate(data) {
    const isValid = ajvValidator(data)

    if (!isValid) {
      const firstError = ajvValidator.errors[0]

      const error = {
        param_name: firstError.dataPath,
        keyword: firstError.keyword,
        message: firstError.message.replace(/\./, ''),
        details: firstError.params
      }

      throw createError(400, error)
    }
  }
}

module.exports = { createValidator }
