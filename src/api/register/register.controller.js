const { validateRegisterController } = require('./register.schema')

const { postRegisterUser } = require('./register.lib')

async function postRegisterUserController(ctx) {
  const {
    request: { body }
  } = ctx

  validateRegisterController(body)

  await postRegisterUser(body)

  ctx.body = {}
}

module.exports = { postRegisterUserController }
