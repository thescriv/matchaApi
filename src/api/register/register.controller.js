const createError = require('http-errors')

const { db } = require('../../helpers/db')

const { validateRegisterController } = require('./register.schema')

const { createNewUser } = require('./register.lib')

async function postRegisterController(ctx) {
  const {
    request: { body }
  } = ctx

  validateRegisterController(body)

  const emailAlreadyExist = await db
    .users()
    .countDocuments({ email: body.email })

  if (emailAlreadyExist) {
    throw createError(400, 'Email already taken', {
      help: 'Sorry email already taken.'
    })
  }

  const newUser = createNewUser(body)

  await db.users().insertOne(newUser)

  ctx.body = {}
}

module.exports = { postRegisterController }
