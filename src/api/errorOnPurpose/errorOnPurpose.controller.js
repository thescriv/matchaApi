const createError = require('http-errors')

async function classicErrorOnPurpose() {
  throw new Error('an error occured')
}

async function httpErrorOnPurpose() {
  throw createError(400, 'An error occured', { help: 'An error occured' })
}

module.exports = { classicErrorOnPurpose, httpErrorOnPurpose }
