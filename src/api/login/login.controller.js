const createError = require('http-errors')

const { db } = require('../../helpers/db')
const { hashString } = require('../../helpers/hash')
const { createJwtToken } = require('../../helpers/jwt')

const { validatePostLoginController } = require('./login.schema')

async function postLoginController(ctx) {
  const {
    request: { body }
  } = ctx

  validatePostLoginController(body)

  const hashedPassword = hashString(body.password)

  const user = await db
    .users()
    .findOne(
      { email: body.email, password: hashedPassword },
      { projection: { secret_key: 1 } }
    )

  if (!user) {
    throw createError(404, 'user not found')
  }

  const userToken = createJwtToken(user._id.toHexString(), user.secret_key)

  ctx.body = { token: userToken }
}

module.exports = { postLoginController }
