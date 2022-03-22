const { validatePostLoginController } = require('./login.schema')
const { postLoginUser } = require('./login.lib')

async function postLoginController(ctx) {
  const {
    request: { body }
  } = ctx

  validatePostLoginController(body)

  const userToken = await postLoginUser(body)

  ctx.body = { token: userToken }
}

module.exports = { postLoginController }
