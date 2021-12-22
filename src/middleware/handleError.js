const config = require('../config')

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
      console.log(err)
    }

    ctx.body = error
  }
}

module.exports = { handleErrorMiddleware }
