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

  return token
}

function decodeJwtToken(token) {
  const tokenPayload = jwt.decode(token)

  return tokenPayload
}

function verifyJwtToken(token, userSecretKey) {
  try {
    jwt.verify(token, config.JWT_SECRET_KEY + userSecretKey, {
      algorithm: 'HS256'
    })
  } catch (err) {
    return false
  }
  return true
}

module.exports = {
  createJwtToken,
  decodeJwtToken,
  verifyJwtToken
}
