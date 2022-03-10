const { hashString } = require('../../helpers/hash')
const { createJwtToken } = require('../../helpers/jwt')

const { validatePostLoginController } = require('./login.schema')

const { findUserAndAssertExist } = require('../../lib/users')

async function postLoginController(ctx) {
  const {
    request: { body }
  } = ctx

  validatePostLoginController(body)

  const hashedPassword = hashString(body.password)

  const user = await findUserAndAssertExist(
    { email: body.email, password: hashedPassword },
    { projection: { secret_key: 1 } }
  )

  const userToken = createJwtToken(user._id.toHexString(), user.secret_key)

  ctx.body = { token: userToken }
}

module.exports = { postLoginController }
