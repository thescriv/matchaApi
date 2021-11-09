const crypto = require('crypto')
const createError = require('http-errors')
const { ObjectId } = require('mongodb')

const { db } = require('../../helpers/db')

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
    throw createError(400, 'Nickname already taken', {
      help: 'Sorry nickname already taken.'
    })
  }

  const userId = new ObjectId()

  const secretKey =
    crypto
      .createHash('sha256')
      .update(body.email + body.password)
      .digest('hex') +
    ';' +
    userId

  const userPassword = crypto
    .createHash('sha256')
    .update(body.password)
    .digest('hex')

  const newUser = {
    ...body,
    _id: userId,
    password: userPassword,
    secret_key: secretKey
  }

  await db.users().insertOne(newUser)

  ctx.body = {}
}

module.exports = { postRegisterController }
