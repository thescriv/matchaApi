const { isEmpty } = require('lodash')

async function globalMiddleware(ctx, next) {
  await next()

  if (ctx.status === 200 && isEmpty(ctx.body)) {
    ctx.status = 204
  }
}

module.exports = { globalMiddleware }
