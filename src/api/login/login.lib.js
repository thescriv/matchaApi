const { hashString } = require('../../helpers/hash')
const { createJwtToken } = require('../../helpers/jwt')

const { findUserAndAssertExist } = require('../../lib/users')

async function postLoginUser(body) {
  const hashedPassword = hashString(body.password)

  const user = await findUserAndAssertExist(
    { email: body.email, password: hashedPassword },
    { projection: { secret_key: 1 } }
  )

  const userToken = createJwtToken(user._id.toHexString(), user.secret_key)

  return userToken
}

module.exports = { postLoginUser }
