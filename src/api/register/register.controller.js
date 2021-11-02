const { validateRegisterController } = require('./register.schema')

async function postRegisterController(ctx) {
  const {
    request: { body }
  } = ctx

  validateRegisterController(body)

  ctx.body = {}
}

module.exports = { postRegisterController }
