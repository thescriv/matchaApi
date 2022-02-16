const config = require('../config')

const { logger } = require('../helpers/logger')

const log = logger.child({ func: 'handleErrorMiddleware' })

async function handleErrorMiddleware(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500

    const errorMessage = err?.message || 'An error occured, sorry !'

    const error = {
      message: errorMessage,
      help: err?.help || errorMessage
    }

    if (config.MIDDLEWARE_ERROR_LOGGER) {
      log.error(err)
    }

    ctx.body = error
  }
}

module.exports = { handleErrorMiddleware }
