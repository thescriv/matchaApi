const createError = require('http-errors')

const { db } = require('../../helpers/db')
const { hashString } = require('../../helpers/hash')

const { validatePostLoginController } = require('./login.schema')

async function postLoginController(ctx) {
  const {
    request: { body }
  } = ctx

  validatePostLoginController(body)

  const hashedPassword = hashString(body.password)

  const user = await db
    .users()
    .findOne({ email: body.email, password: hashedPassword })

  if (!user) {
    throw createError(404, 'user not found')
  }

  ctx.body = {}
}

module.exports = { postLoginController }
