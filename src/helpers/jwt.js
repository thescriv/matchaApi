const jwt = require('jsonwebtoken')
const config = require('../config')

function createJwtToken(userId, userSecretKey) {
  const token = jwt.sign(
    { user_id: userId },
    config.JWT_SECRET_KEY + userSecretKey,
    {
      algorithm: 'HS256',
      expiresIn: '1y'
    }
  )

  // console.log(jwt.verify(token, config.JWT_SECRET_KEY + userSecretKey, {algorithm: 'HS256'}))

  return token
}

function decodeJwtToken(token) {
  const tokenPayload = jwt.decode(token)

  return tokenPayload
}

module.exports = {
  createJwtToken,
  decodeJwtToken
}
