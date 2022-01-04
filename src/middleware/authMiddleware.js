const { decodeJwtToken, verifyJwtToken } = require('../helpers/jwt')

const { ObjectId } = require('mongodb')
const { db } = require('../helpers/db')
const createError = require('http-errors')

async function authMiddleware(ctx, next) {
  ctx.auth = {
    userId: null
  }

  const bearerToken = ctx.headers.authorization

  if (bearerToken) {
    const token = bearerToken.split(' ')[1]

    const tokenPayload = decodeJwtToken(token)

    const userId = ObjectId.createFromHexString(tokenPayload.user_id)

    const user = await db
      .users()
      .findOne({ _id: userId }, { projection: { _id: 0, secret_key: 1 } })

    if (!user) {
      throw createError(401, 'token is invalid', { help: 'token is invalid' })
    }

    if (verifyJwtToken(token, user.secret_key)) {
      ctx.auth.userId = userId
    } else {
      throw createError(401, 'token is invalid', { help: 'token is invalid' })
    }
  }

  await next()
}

module.exports = { authMiddleware }
