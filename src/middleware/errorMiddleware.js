const config = require('../config')

const { logger } = require('../helpers/logger')

const { translate } = require('../helpers/i18n')

const log = logger.child({ func: 'errorMiddleware' })

async function errorMiddleware(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500

    const errorMessage = err?.message || 'An error occured, sorry !'

    const error = {
      message: errorMessage,
      help: translate(err?.help || errorMessage)
    }

    if (config.MIDDLEWARE_ERROR_LOGGER) {
      log.error(err)
    }

    ctx.body = error
  }
}

module.exports = { errorMiddleware }
