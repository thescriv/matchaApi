const createError = require('http-errors')

const { db } = require('../../helpers/db')
const { hashString } = require('../../helpers/hash')

const { validateRegisterController } = require('./register.schema')

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

  const secretKey = hashString(body.email + body.password)

  const userPassword = hashString(body.password)

  const newUser = {
    ...body,
    password: userPassword,
    secret_key: secretKey,
    created_at: Date.now()
  }

  await db.users().insertOne(newUser)

  ctx.body = {}
}

module.exports = { postRegisterController }
